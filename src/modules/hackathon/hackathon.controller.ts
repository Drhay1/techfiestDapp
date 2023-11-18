import moment from 'moment';
import slugify from 'slugify';
import { Model } from 'mongoose';
import * as exceljs from 'exceljs';
import { ApiTags } from '@nestjs/swagger';
import { PayoutDto } from './dto/payout-dto';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Escrow } from './schemas/escrow.schema';
import { Winners } from './schemas/winners.schema';
import { UserService } from '../user/user.service';
import { Web3Service } from '../web3/web3.service';
import { Settings } from '@/general/settings.schema';
import { HackathonService } from './hackathon.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Role } from '../user/interfaces/user.interfaces';
import { CompanyService } from '../company/company.service';
import { Transactions } from './schemas/transactions.schema';
import { HackathonStatus } from './schemas/hackathon.schema';
import HttpStatusCodes from '@/configurations/HttpStatusCodes';
import { Roles } from '@/middleware/authorization/roles.decorator';
import { MailService, emailAttachments } from '../mail/mail.service';
import { Submissions } from '../submissions/schemas/submission.schema';
import { SubmissionsService } from '../submissions/submissions.service';
import { chains, statusesMap, supportedTokens } from '@/utils/constants';
import { ParticipantsService } from '../participants/participants.service';
import { RolesGuard } from '@/middleware/authorization/guards/roles.guard';
import { VerifyLogin } from '@/middleware/authorization/verifylogin.strategy';
import { CreateOffChainHackathonDto } from './dto/createOffchainHackathon-dto';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  HackathonInitDto,
  HackathonPublishDto,
  HackathonSendDto,
  UpdateHackathonDto,
} from './dto/create-hackathon-dto';

const BigNumber = require('bignumber.js');
const today = moment();

@ApiTags('hackathon')
@Controller('hackathon')
export class HackathonController {
  constructor(
    private web3: Web3Service,
    private userService: UserService,
    private mailService: MailService,
    private web3Service: Web3Service,
    private configService: ConfigService,
    private companyService: CompanyService,
    private hackathonService: HackathonService,
    private submissionService: SubmissionsService,
    private partipantService: ParticipantsService,

    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @InjectModel(Escrow.name)
    private escrowModel: Model<Escrow>,

    @InjectModel(Winners.name)
    private winnersModel: Model<Winners>,

    @InjectModel(Settings.name)
    private settingsModel: Model<Settings>,

    @InjectModel(Transactions.name)
    private transactionsModel: Model<Transactions>,
  ) {}

  @UseGuards(VerifyLogin)
  @Roles(Role.Client)
  @UseGuards(RolesGuard)
  @Post('init')
  async init(
    @Body(ValidationPipe) body: HackathonInitDto,
    @Res() res: any,
    @Req() req: any,
  ) {
    const user = req.user;

    const {
      account: clientWalletAccount,
      alternativeWalletAddress,
      initialRewardAmount,
    } = body;

    let settings = await this.settingsModel.findOne();

    if (!settings || !settings.allowHack)
      throw new HttpException(
        'Contact us to launch a new hackathon',
        HttpStatusCodes.FORBIDDEN,
      );

    const chain = chains.find((c) => c.chainId === body.chainId);

    if (!chain)
      throw new HttpException(
        'Blockchain not yet supported',
        HttpStatusCodes.FORBIDDEN,
      );

    const rewardToken = supportedTokens.find(
      (token) => token.address === body.rewardTokenAddress,
    );

    if (!rewardToken)
      throw new HttpException(
        'Reward token not supported',
        HttpStatusCodes.BAD_REQUEST,
      );

    const web3 = await this.web3Service.connectionChain(chain.provider);
    const account = await this.web3Service.getAccount(web3);
    const stakeContract = await this.web3.createStake(
      web3,
      chain.stakingAddress,
    );

    const escrowFactory = await this.web3.createEscrowFactory(
      web3,
      chain.escrowFactoryAddress,
    );

    const requesterWallets = alternativeWalletAddress
      ? [clientWalletAccount, alternativeWalletAddress]
      : [clientWalletAccount];

    const trustedHandlers = [...requesterWallets, account];

    try {
      const valueBN = await web3.utils.toBN(1 * rewardToken.decimals);

      const approveGasLimit = await web3.eth.estimateGas({
        from: account,
        to: chain.hmtAddress!,
        data: web3.eth.abi.encodeFunctionCall(
          {
            name: 'approve',
            type: 'function',
            inputs: [
              { type: 'address', name: 'spender' },
              { type: 'uint256', name: 'amount' },
            ],
          },
          [chain.stakingAddress!, valueBN],
        ),
      });

      const approveTransaction = {
        from: account,
        to: chain.hmtAddress!,
        data: web3.eth.abi.encodeFunctionCall(
          {
            name: 'approve',
            type: 'function',
            inputs: [
              { type: 'address', name: 'spender' },
              { type: 'uint256', name: 'amount' },
            ],
          },
          [chain.stakingAddress, valueBN],
        ),
        gas: approveGasLimit,
      };

      const privateKey = process.env.PRIVATE_KEY!;

      const signedApproveTransaction = await web3.eth.accounts.signTransaction(
        approveTransaction,
        privateKey,
      );

      await web3.eth.sendSignedTransaction(
        signedApproveTransaction.rawTransaction,
      );

      const stakeGasLimit = await stakeContract.methods
        .stake(valueBN)
        .estimateGas({ from: account });

      const stakeTransactionData = await stakeContract.methods
        .stake(valueBN)
        .encodeABI();

      const signedStakeTransaction = await web3.eth.accounts.signTransaction(
        {
          from: account,
          to: chain.stakingAddress,
          data: stakeTransactionData,
          gas: stakeGasLimit,
        },
        privateKey,
      );

      const stakedTrx = await web3.eth.sendSignedTransaction(
        signedStakeTransaction.rawTransaction,
      );

      const rcs = await web3.eth.getTransactionReceipt(
        stakedTrx.transactionHash,
      );

      const strxBlockNumber = rcs.blockNumber;
      const nonce = await web3.eth.getTransactionCount(account, 'latest');

      await stakeContract.getPastEvents(
        'StakeDeposited',
        {
          fromBlock: strxBlockNumber,
          toBlock: strxBlockNumber,
        },
        async (err: any, [{ returnValues }]) => {
          try {
            const createEscrowGas = await escrowFactory.methods
              .createEscrow(rewardToken.address, trustedHandlers)
              .estimateGas({ from: account });

            return res.send({});

            const createEscrowTx = await escrowFactory.methods.createEscrow(
              rewardToken.address,
              trustedHandlers,
            );

            const createEscrowTxData = createEscrowTx.encodeABI();

            const signedTransaction = await web3.eth.accounts.signTransaction(
              {
                from: account,
                to: chain.escrowFactoryAddress,
                data: createEscrowTxData,
                gas: createEscrowGas,
                nonce,
              },
              privateKey,
            );

            const trx = await web3.eth.sendSignedTransaction(
              signedTransaction.rawTransaction,
            );

            const rc = await web3.eth.getTransactionReceipt(
              trx.transactionHash,
            );

            const trxBlockcNumber = rc.blockNumber;

            await escrowFactory.getPastEvents(
              'Launched',
              {
                fromBlock: trxBlockcNumber,
                toBlock: trxBlockcNumber,
              },
              async (err: any, [{ returnValues }]) => {
                const { escrow } = returnValues;

                try {
                  const newEscrow = await new this.escrowModel({
                    address: escrow,
                    user: user._id,
                    initialRewardAmount,
                  }).save();

                  return res.status(200).send({
                    status: true,
                    msg: 'Hackathon Escrow Created',
                    escrow,
                    initialRewardAmount,
                    id: newEscrow.id,
                  });
                } catch (err) {
                  throw new HttpException(
                    'Unable to store new escrow',
                    HttpStatusCodes.BAD_REQUEST,
                  );
                }
              },
            );
          } catch (err) {
            console.log(err);
            throw new HttpException(
              'Unable to stake',
              HttpStatusCodes.BAD_REQUEST,
            );
          }
        },
      );
    } catch (err) {
      this.logger.error(
        'Calling getHello()',
        err.stack,
        HackathonController.name,
      );

      //TODO: Add notification to admin for possible error
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Client)
  @UseGuards(RolesGuard)
  @Post('create-offchain-hackathon')
  async createOffChainHackathon(
    @Body(ValidationPipe) body: CreateOffChainHackathonDto,
    @Res() res: any,
    @Req() req: any,
  ) {
    try {
      const user = req.user;

      let settings = await this.settingsModel.findOne();

      if (!settings || !settings.allowHack)
        throw new HttpException(
          'Contact us to launch a new hackathon',
          HttpStatusCodes.FORBIDDEN,
        );

      const hackathonId = await this.hackathonService.generateItemId();

      // transforms deadline to UTC timestamp
      body.submissionDeadline = `${body.submissionDeadline}Z`;
      body.slug = slugify(body.hackathonName).toLowerCase();

      await this.hackathonService.sendHackathonRequest({
        ...body,
        user: user._id,
        company: user.company._id,
        hackathonId,
      });

      return res
        .status(HttpStatusCodes.OK)
        .send({ msg: 'Your hackathon is sent for review' });
    } catch (err) {
      console.log(err);

      throw new HttpException(err, HttpStatusCodes.FORBIDDEN);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Client, Role.Admin)
  @UseGuards(RolesGuard)
  @Post('send')
  async send(@Body() body: HackathonSendDto, @Res() res: any, @Req() req: any) {
    const user = req.user;

    const { escrowId, depositedTokenAmount } = body;

    const isTokenAllowed = supportedTokens.filter(
      (token) => token.address === body.rewardTokenAddress,
    );

    if (!isTokenAllowed)
      throw new HttpException(
        'Reward Token is not allowed for now',
        HttpStatusCodes.FORBIDDEN,
      );

    try {
      const escrow = await this.escrowModel.findById(escrowId);

      if (!escrow)
        throw new HttpException(
          'The Escrow does not exists',
          HttpStatusCodes.BAD_REQUEST,
        );

      const hackathonId = await this.hackathonService.generateItemId();
      body.submissionDeadline = `${body.submissionDeadline}Z`;
      body.slug = slugify(body.hackathonName).toLowerCase();

      await this.hackathonService.sendHackathonRequest({
        ...body,
        initialRewardAmount: depositedTokenAmount,
        user: user._id,
        escrow: escrow._id,
        company: user.company._id,
        hackathonId,
      });

      //TODO: notify the admin through email

      return res
        .status(HttpStatusCodes.OK)
        .send({ msg: 'Your hackathon is sent for review' });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Client)
  @UseGuards(RolesGuard)
  @Get('client-hacks')
  async getClientHacks(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Res() res: any,
    @Req() req: any,
  ) {
    const user = req.user;

    try {
      const hacks = await this.hackathonService.getClientHackathons(
        user,
        page,
        limit,
      );

      return res.status(HttpStatusCodes.OK).send(hacks);
    } catch (err) {
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('requests')
  async getHackathonRequests(@Res() res: any, @Req() req: any): Promise<any> {
    try {
      const requests = await this.hackathonService.getHackathonRequests();
      return res.status(HttpStatusCodes.OK).send(requests);
    } catch (err) {
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('')
  async getAllHacks(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 100,
    @Res() res: any,
  ) {
    try {
      const hacks = await this.hackathonService.getHackathons(page, limit);
      return res.status(HttpStatusCodes.OK).send(hacks);
    } catch (err) {
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('adetail/:id')
  async getHackForAdmin(@Param('id') id: number, @Res() res: any) {
    try {
      const hackathon = await this.hackathonService.getHackathonByIdWithMore(
        id,
      );

      return res.status(HttpStatusCodes.OK).send({ hackathon });
    } catch (err) {
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Client)
  @UseGuards(RolesGuard)
  @Get('cdetail/:id')
  async getHackForClient(@Param('id') id: number, @Res() res: any) {
    try {
      const hackathon = await this.hackathonService.getHackathonByIdWithMore(
        id,
      );

      return res.status(HttpStatusCodes.OK).send({ hackathon });
    } catch (err) {
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('adownload-submissions/:id')
  async downloadSubmissionsForAdmin(@Param('id') id: number, @Res() res: any) {
    try {
      const hackathon = await this.hackathonService.getHackathonSubmissions(id);

      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Submissions');

      worksheet.columns = [
        { header: 'Name', key: 'name', width: 35 },
        { header: 'Email', key: 'email', width: 35 },
        { header: 'Submission', key: 'submission', width: 35 },
        { header: 'Score', key: 'score', width: 35 },
        { header: 'Wallet Address', key: 'wallet', width: 35 },
      ];

      worksheet.addRows(
        hackathon.submissions.map((userSubmission: any) => ({
          name:
            userSubmission.user.firstname + ' ' + userSubmission.user?.lastname,
          email: userSubmission.user.email,
          submission: userSubmission.result.startsWith('www.')
            ? userSubmission.result.replace(/^www\./i, 'https://')
            : userSubmission.result.startsWith('http://')
            ? userSubmission.result.replace(/^http:/i, 'https:')
            : userSubmission.result.startsWith('https://')
            ? userSubmission.result
            : 'https://' + userSubmission.result,
          score: userSubmission.score,
          userWalletAddress: userSubmission.userWalletAddress,
        })),
      );
      worksheet.getColumn('submission').eachCell((cell: any, rowNumber) => {
        if (rowNumber > 1) {
          cell.value = {
            text: cell.value,
            hyperlink: cell.value,
          };
        }
      });
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${hackathon.hackathonName}-submissions-techfiesta.xlsx`,
      );

      await workbook.xlsx.write(res);

      return res.status(HttpStatusCodes.OK);
    } catch (err) {
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Client)
  @UseGuards(RolesGuard)
  @Get('cdownload-submissions/:id')
  async downloadSubmissionsForClient(@Param('id') id: number, @Res() res: any) {
    try {
      const hackathon = await this.hackathonService.getHackathonSubmissions(id);

      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Submissions');

      worksheet.columns = [
        { header: 'Name', key: 'name', width: 35 },
        { header: 'Submission', key: 'submission', width: 35 },
        { header: 'Score', key: 'score', width: 35 },
        { header: 'Wallet Address', key: 'userWalletAddress', width: 35 },
      ];

      worksheet.addRows(
        hackathon.submissions.map((userSubmission: any) => {
          return {
            name:
              userSubmission.user.firstname +
              ' ' +
              userSubmission.user.lastname,
            submission: userSubmission.result.startsWith('www.')
              ? userSubmission.result.replace(/^www\./i, 'https://')
              : userSubmission.result.startsWith('http://')
              ? userSubmission.result.replace(/^http:/i, 'https:')
              : userSubmission.result.startsWith('https://')
              ? userSubmission.result
              : 'https://' + userSubmission.result,
            score: userSubmission.score,
            userWalletAddress: userSubmission.userWalletAddress,
          };
        }),
      );

      worksheet.getColumn('submission').eachCell((cell: any, rowNumber) => {
        if (rowNumber > 1) {
          cell.value = {
            text: cell.value,
            hyperlink: cell.value,
          };
        }
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${hackathon.hackathonName}-submissions-techfiesta.xlsx`,
      );

      await workbook.xlsx.write(res);

      return res.status(HttpStatusCodes.OK);
    } catch (err) {
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Put('publish/:id')
  async publishAHackathon(@Body() body: HackathonPublishDto, @Res() res: any) {
    const { id } = body;
    const privateKey = process.env.PRIVATE_KEY!;

    if (!id)
      throw new HttpException(
        'Invalid Hackathon ID',
        HttpStatusCodes.BAD_REQUEST,
      );

    const hackathon = await this.hackathonService.getHackathonEscrowById(id);

    const chain = chains.find((c) => c.chainId === hackathon.chainId);

    if (!chain)
      throw new HttpException(
        'Invalid Hackathon chain',
        HttpStatusCodes.BAD_REQUEST,
      );

    const rewardToken = supportedTokens.find(
      (token) => token.address === hackathon.rewardTokenAddress,
    );

    if (!rewardToken)
      throw new HttpException(
        'This hackathon does not support the reward token',
        HttpStatusCodes.BAD_REQUEST,
      );

    if (hackathon.escrow) {
      const web3 = await this.web3Service.connectionChain(chain.provider);
      const account = await this.web3Service.getAccount(web3);

      const escrow = await this.web3Service.getEscrow(
        web3,
        hackathon.escrow.address,
      );

      const escrowStatus = await escrow.methods
        .status()
        .call({ from: account });

      if (statusesMap[escrowStatus] !== 'Launched')
        throw new HttpException(
          'Hackathon Escrow in use is already in Launch state',
          HttpStatusCodes.BAD_REQUEST,
        );

      if (statusesMap[escrowStatus] === 'Pending')
        throw new HttpException(
          'The hackathon already in pending state',
          HttpStatusCodes.BAD_REQUEST,
        );

      const jobManifestURI = `${(
        Date.now() +
        `_` +
        Math.floor(Math.random() * (100 * 100) + 1)
      ).toLowerCase()}.json`;

      const manifestURI = `${this.configService.get<string>(
        'SERVER_URL',
      )}/public/manifests/${jobManifestURI}`;

      const value = new BigNumber(0);

      const gasEstimation = await web3.eth.estimateGas({
        from: account,
        to: escrow.options.address,
        data: escrow.methods
          .setup(account, account, value, value, manifestURI, '0x1')
          .encodeABI(),
      });

      const nonce = await web3.eth.getTransactionCount(account, 'latest');

      const transaction = {
        from: account,
        to: escrow.options.address,
        gas: gasEstimation,
        data: escrow.methods
          .setup(account, account, value, value, manifestURI, '0x1')
          .encodeABI(),
        nonce: nonce,
      };

      const signedTransaction = await web3.eth.accounts.signTransaction(
        transaction,
        privateKey,
      );

      await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    }
    try {
      await this.hackathonService.publishAHackathon(id);

      return res
        .status(HttpStatusCodes.OK)
        .send({ status: HackathonStatus.published });
    } catch (err) {
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Put('update')
  async updateHackathon(@Body() body: UpdateHackathonDto, @Res() res: any) {
    try {
      const hackathon = await this.hackathonService.getHackathonByIdWithMore(
        body.hackathonId,
      );

      body.slug = slugify(body.hackathonName).toLowerCase();

      // const companyId = hackathon.company._id.toString();
      // await this.companyService.updateCompany(companyId, { logo: body.logo });

      await this.hackathonService.updateHackathon(body);

      return res.status(HttpStatusCodes.OK).send({ updated: true });
    } catch (err) {
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @Get('all')
  async getAllHackaThons(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 100,
    @Res() res: any,
  ) {
    try {
      const hacks = await this.hackathonService.getPublishedAndActiveHackathons(
        page,
        limit,
      );

      return res.status(HttpStatusCodes.OK).send(hacks);
    } catch (err) {
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @Get('hacks/:id')
  async getHacksForAll(
    @Param('id') id: number,
    @Res() res: any,
    @Req() req: any,
  ) {
    try {
      const hackathon = await this.hackathonService.getHackathonById(id);
      return res.status(HttpStatusCodes.OK).send({ hackathon });
    } catch (err) {
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @Post('register')
  async registerForAHack(@Body() body: any, @Res() res: any, @Req() req: any) {
    const { id: hackathonId, userWalletAddress } = body;

    try {
      if (!userWalletAddress)
        throw new HttpException(
          `You need to connect your wallet`,
          HttpStatusCodes.BAD_REQUEST,
        );

      const hackathon = await this.hackathonService.getHackathonEscrowById(
        hackathonId,
      );

      const chain = chains.find((c) => c.chainId === hackathon.chainId);

      if (!chain)
        throw new HttpException(
          'Invalid Hackathon chain',
          HttpStatusCodes.BAD_REQUEST,
        );

      const web3 = await this.web3Service.connectionChain(chain.provider);

      if (!web3.utils.toChecksumAddress(userWalletAddress))
        throw new HttpException(
          'Wallet address is invalid',
          HttpStatusCodes.BAD_REQUEST,
        );

      const user = req.user;

      if (!user.firstname)
        throw new HttpException(
          'Fill in your firstname to proceed',
          HttpStatusCodes.BAD_REQUEST,
        );

      if (!hackathon)
        throw new HttpException(
          'Hackathon not found',
          HttpStatusCodes.BAD_REQUEST,
        );

      if (moment(hackathon.submissionDeadline).isBefore(today))
        throw new HttpException(
          'You cannot register for this Hackathon anymore',
          HttpStatusCodes.FORBIDDEN,
        );

      const userIsRegistered =
        hackathon.participants && hackathon.participants.includes(user._id);

      if (userIsRegistered) {
        throw new HttpException(
          'You are already registered',
          HttpStatusCodes.FORBIDDEN,
        );
      }

      await this.hackathonService.addUserAsHackathonParticipant(
        user,
        hackathon,
      );

      await this.partipantService.createParticipantRecord(
        user,
        hackathon,
        userWalletAddress,
      );

      const confirmationTemplate = {
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `You registered for ${hackathon.hackathonName}`,
        context: {
          title: hackathon.hackathonName,
        },
        attachments: [...emailAttachments],
      };

      const msg = {
        to: user.email,
        ...confirmationTemplate,
      };

      await this.mailService.notifyEmailOnHackathonRegister(msg);

      return res
        .status(HttpStatusCodes.OK)
        .send({ msg: 'You have been registered', userId: user._id });
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @Put('submit-result')
  async submitAHackathon(@Body() body: any, @Res() res: any, @Req() req: any) {
    const user = req.user;
    const { userWalletAddress, hackathonId, result } = body;

    const hackathon = await this.hackathonService.getHackathonEscrowById(
      hackathonId,
    );

    if (!hackathon)
      throw new HttpException('Invalid Hackathon', HttpStatusCodes.BAD_REQUEST);

    if (hackathon.chainId !== body.chainId)
      throw new HttpException(
        'Please connect to the appropriate network to submit',
        HttpStatusCodes.FORBIDDEN,
      );

    const chain = chains.find((c) => c.chainId === hackathon.chainId);

    if (!chain)
      throw new HttpException(
        'Invalid Hackathon chain',
        HttpStatusCodes.BAD_REQUEST,
      );

    const web3 = await this.web3Service.connectionChain(chain.provider);

    if (!web3.utils.toChecksumAddress(userWalletAddress))
      throw new HttpException(
        'Wallet address is invalid',
        HttpStatusCodes.BAD_REQUEST,
      );

    if (!user.firstname)
      throw new HttpException(
        'Fill in your firstname to proceed',
        HttpStatusCodes.BAD_REQUEST,
      );

    if (!userWalletAddress)
      throw new HttpException(
        'Connect your wallet to submit',
        HttpStatusCodes.BAD_REQUEST,
      );

    if (!hackathonId)
      throw new HttpException(
        'Refresh your browser to submit again',
        HttpStatusCodes.BAD_REQUEST,
      );

    if (!result)
      throw new HttpException(
        'You must provide a result',
        HttpStatusCodes.BAD_REQUEST,
      );

    if (moment(hackathon.submissionDeadline).isBefore(today))
      throw new HttpException(
        'Submission deadline is passed',
        HttpStatusCodes.FORBIDDEN,
      );

    const submitted = await this.submissionService.checkUserSubmitted(
      user,
      hackathon,
    );

    if (submitted)
      throw new HttpException(
        'You submitted already',
        HttpStatusCodes.FORBIDDEN,
      );

    if (hackathon.escrow) {
      const account = await this.web3Service.getAccount(web3);
      const escrow = await this.web3Service.getEscrow(
        web3,
        hackathon.escrow.address,
      );

      const escrowStatus = await escrow.methods
        .status()
        .call({ from: account });

      if (statusesMap[escrowStatus] !== 'Pending') {
        throw new HttpException(
          'Escrow not in pending state',
          HttpStatusCodes.BAD_REQUEST,
        );
      }
    }

    try {
      let newSubmission: Submissions;

      if (hackathon.escrow) {
        newSubmission = await this.submissionService.createSubmission({
          user: user._id,
          userWalletAddress,
          hackathon: hackathon._id,
          escrow: hackathon.escrow._id,
          result: result.result,
        });
      } else {
        newSubmission = await this.submissionService.createSubmission({
          user: user._id,
          userWalletAddress,
          hackathon: hackathon._id,
          result: result.result,
        });
      }

      await this.hackathonService.addUserToSubmission(newSubmission, hackathon);

      const confirmationTemplate = {
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `Submission confirmation for ${hackathon.hackathonName}`,
        context: {
          hackathonName: hackathon.hackathonName,
          firstName: user.firstname,
        },
        attachments: [...emailAttachments],
      };

      const msg = {
        to: user.email,
        ...confirmationTemplate,
      };

      await this.mailService.notifyEmailOnSubmission(msg);

      return res.status(HttpStatusCodes.OK).send({
        msg: 'Submitted result',
        submitted: true,
        hackathonId: hackathon._id.toString(),
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Client)
  @UseGuards(RolesGuard)
  @Put('set-score')
  async setScore(@Body() body: any, @Res() res: any, @Req() req: any) {
    const { _id, score } = body;
    try {
      const result = await this.submissionService.updateUserScore(_id, score);

      return res.status(200).send({ result, status: true });
    } catch (e) {
      throw new HttpException(e, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Client)
  @UseGuards(RolesGuard)
  @Put('accept-result')
  async acceptResult(@Body() body: any, @Res() res: any, @Req() req: any) {
    const { _id, accepted } = body;
    try {
      const result = await this.submissionService.setAccepted(_id, accepted);
      return res.status(200).send({ result, status: true });
    } catch (e) {
      throw new HttpException(e, HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Client)
  @UseGuards(RolesGuard)
  @Post('payout')
  async payoutReq(@Body() body: any, @Res() res: any, @Req() req: any) {
    const {
      acceptedSubmissions,
      hackathonId,
      equalDistribution,
      escrowId,
      rewards,
    }: Record<any, any> = body;
    const privateKey = process.env.PRIVATE_KEY!;
    const user = req.user;

    if (!hackathonId || !acceptedSubmissions || !escrowId)
      throw new HttpException('Invalid Request', HttpStatusCodes.BAD_REQUEST);

    let _rewards: any;
    let areRewardsUnique: any;

    if (equalDistribution === 'no') {
      _rewards = rewards.map((reward: number) => reward);
      areRewardsUnique = rewards.length === new Set(_rewards).size;
    }

    if (equalDistribution === 'no' && !rewards) {
      throw new HttpException(
        'No rewards to distribute',
        HttpStatusCodes.BAD_REQUEST,
      );
    }

    const hackathon = await this.hackathonService.getHackathonById(hackathonId);

    if (!hackathon)
      throw new HttpException('Job not found', HttpStatusCodes.NOT_FOUND);

    const chain = chains.find((c) => c.chainId === hackathon.chainId);

    if (!chain)
      throw new HttpException(
        'Invalid Hackathon chain',
        HttpStatusCodes.BAD_REQUEST,
      );

    const es = await this.escrowModel.findById(escrowId);
    const web3 = await this.web3Service.connectionChain(chain.provider);
    const account = await this.web3Service.getAccount(web3);

    const escrow = await this.web3Service.getEscrow(
      web3,
      hackathon.escrow.address,
    );

    const escrowStatus = await escrow.methods.status().call({ from: account });

    if (statusesMap[escrowStatus] === 'Paid') {
      throw new HttpException(
        'Participants has been paid',
        HttpStatusCodes.FORBIDDEN,
      );
    }

    const escrowRecOracleAddr = await escrow.methods
      .recordingOracle()
      .call({ from: account });

    const usersIdFromAcceptedSubmissions = acceptedSubmissions.map(
      (obj: any) => obj.user._id,
    );

    if (
      !Array.isArray(usersIdFromAcceptedSubmissions) ||
      usersIdFromAcceptedSubmissions.length === 0
    ) {
      throw new HttpException(
        'User to reward are not specified',
        HttpStatusCodes.BAD_REQUEST,
      );
    }

    if (
      equalDistribution === 'no' &&
      (!Array.isArray(rewards) || rewards.length === 0)
    ) {
      throw new HttpException(
        'Rewards are not specified or empty',
        HttpStatusCodes.BAD_REQUEST,
      );
    }

    const usersToReward = await this.userService.getUsersByIdsAndMore(
      usersIdFromAcceptedSubmissions,
    );

    if (!web3.utils.isAddress(es.address))
      throw new HttpException(
        'Escrow address is empty or invalid',
        HttpStatusCodes.BAD_REQUEST,
      );

    const balance: any = await escrow.methods
      .getBalance()
      .call({ from: account });

    const rewardToken = supportedTokens.find(
      (token) => token.address == hackathon.rewardTokenAddress,
    );

    if (!rewardToken)
      throw new HttpException(
        `Token not supported`,
        HttpStatusCodes.BAD_REQUEST,
      );

    const escrowBalance = balance / 10 ** rewardToken.decimals;

    //TODO: check for complete status
    if (escrowBalance <= 0)
      throw new HttpException(
        'Hackathon out of funds',
        HttpStatusCodes.BAD_REQUEST,
      );

    if (
      web3.utils.toChecksumAddress(escrowRecOracleAddr) ===
      web3.utils.toChecksumAddress(account)
    ) {
      try {
        const array2Map = new Map(
          usersToReward.map((item: any) => [item._id.toString(), item]),
        );
        const joinedUserAndSubmission = acceptedSubmissions.map(
          (item: any) => ({
            ...item,
            user: array2Map.get(item.user._id),
          }),
        );

        if (equalDistribution === 'no') {
          const userWithReward = joinedUserAndSubmission.map(
            (obj: any, index: number) => ({
              ...obj,
              amountToPay: rewards[index],
            }),
          );

          const rewardToBigNumbers = rewards.map((reward: any) =>
            new BigNumber(reward).shiftedBy(rewardToken.decimals),
          );

          const walletAddresses = userWithReward.map(
            (obj: any) => obj.userWalletAddress,
          );

          const randomNumber = await this.hackathonService.getRandomNumber();

          const randomNumberBigNumber = new BigNumber(randomNumber);

          const gasNeeded = await escrow.methods
            .bulkPayOut(
              walletAddresses,
              rewardToBigNumbers,
              '',
              '',
              randomNumberBigNumber,
            )
            .estimateGas({ from: account });

          const trx = escrow.methods.bulkPayOut(
            walletAddresses,
            rewardToBigNumbers,
            '',
            '',
            randomNumberBigNumber,
          );

          const sTnonce = await web3.eth.getTransactionCount(account, 'latest');

          const signedTransaction = await web3.eth.accounts.signTransaction(
            {
              from: account,
              to: es.address,
              gas: gasNeeded,
              data: trx.encodeABI(),
              nonce: sTnonce,
            },
            privateKey,
          );

          const rc = await web3.eth.sendSignedTransaction(
            signedTransaction.rawTransaction,
          );

          const blockNumber = rc.blockNumber;

          const transactionHash = rc.transactionHash;

          await escrow.getPastEvents(
            'BulkTransfer',
            {
              fromBlock: blockNumber,
              toBlock: blockNumber,
            },
            async (err: any, [{ returnValues }]) => {
              const completeGasEstimation = await escrow.methods
                .complete()
                .estimateGas({ from: account! });

              const cNonce = await web3.eth.getTransactionCount(
                account,
                'latest',
              );

              const transactionObject = {
                from: account,
                to: es.address,
                data: escrow.methods.complete().encodeABI(),
                gas: completeGasEstimation,
                nonce: cNonce,
              };

              const signedTransaction = await web3.eth.accounts.signTransaction(
                transactionObject,
                privateKey,
              );

              const transactionReceipt = await web3.eth.sendSignedTransaction(
                signedTransaction.rawTransaction,
              );

              console.log(
                'Complete Transaction hash:',
                transactionReceipt.transactionHash,
              );

              const winnersIds = userWithReward.map((obj: any) => obj._id);

              //create winners record
              await (
                await this.winnersModel.create({
                  user: user._id,
                  // @ts-ignore
                  hackathon: hackathon._id,
                  winners: winnersIds,
                  amounts: rewards,
                })
              ).save();

              await this.hackathonService.addWinnersToHackathon(
                hackathonId,
                winnersIds,
              );

              const trx = await (
                await this.transactionsModel.create({
                  user: user._id,
                  // @ts-ignore
                  hackathon: hackathon._id,
                  transactionHash,
                })
              ).save();

              await this.hackathonService.updateHackathonStatus(
                hackathonId,
                HackathonStatus.ended,
              );

              await this.hackathonService.addTrxToHackathon(
                hackathonId,
                trx._id,
              );

              return res.status(200).send({
                status: true,
                msg: 'You have paid all accepted workers',
              });
            },
          );
        }
      } catch (err) {
        console.log(err);
        throw new HttpException(
          'Paid participants or There is an error',
          HttpStatusCodes.BAD_REQUEST,
        );
      }
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Client)
  @UseGuards(RolesGuard)
  @Post('paid-user')
  async paidUser(@Body() body: PayoutDto, @Res() res: any, @Req() req: any) {
    const { hash, userId, hackathonId, amount } = body;

    const user = req.user;

    try {
      const hackathon = await this.hackathonService.getHackathonById(
        hackathonId,
      );

      let recordForHackathonExists = await this.winnersModel.findOne({
        hackathon: hackathon._id,
      });

      if (!recordForHackathonExists) {
        recordForHackathonExists = new this.winnersModel({
          hackathon: hackathon._id,
          winners: [userId],
          amounts: [amount],
          user: user._id,
        });

        await recordForHackathonExists.save();

        await this.hackathonService.addWinnersToHackathon(hackathonId, [
          userId,
        ]);

        const trx = await (
          await this.transactionsModel.create({
            user: user._id,
            hackathon: hackathon._id,
            transactionHash: hash,
          })
        ).save();

        await this.hackathonService.addTrxToHackathon(hackathonId, trx._id);

        //TODO: check if winners are upto reward count to end the hackathon

        return res.status(HttpStatusCodes.OK).send({
          msg: 'User has been paid successfully',
          userId,
        });
      } else {
        if (!recordForHackathonExists.winners.includes(userId)) {
          recordForHackathonExists.winners.push(userId);
          recordForHackathonExists.amounts.push(amount);

          await recordForHackathonExists.save();

          return res.status(HttpStatusCodes.OK).send({
            msg: 'User has been paid successfully',
            userId,
          });
        } else {
          throw new Error('Participant already paid');
        }
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatusCodes.BAD_REQUEST, {
        cause: new Error(error),
      });
    }
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Client)
  @UseGuards(RolesGuard)
  @Get('check-paid/:userId/:hackathonId')
  async checkUserIsPaid(
    @Param('userId') userId: string,
    @Param('hackathonId') hackathonId: number,
    @Res() res: any,
    @Req() req: any,
  ): Promise<boolean> {
    try {
      const hackathon = await this.hackathonService.getHackathonByIdWithMore(
        hackathonId,
      );

      const userIsFound =
        hackathon.winners.length > 0 &&
        hackathon.winners.find((winner) => winner._id.toString() === userId);

      if (userIsFound)
        return res
          .send({ paid: true, userId })
          .status(HttpStatusCodes.FORBIDDEN);

      return res.send({ paid: false, userId }).status(HttpStatusCodes.OK);
    } catch (error) {
      throw new HttpException(error, HttpStatusCodes.BAD_REQUEST, {
        cause: new Error(error),
      });
    }
  }

  @Get('/sponsors')
  async getSponsors(): Promise<any> {
    const companies = await this.hackathonService.getSponsors();
    return companies;
  }
}
