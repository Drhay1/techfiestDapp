import { Model } from 'mongoose';
import { Response } from 'express';
import * as exceljs from 'exceljs';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { Settings } from '@/general/settings.schema';
import { ResetPasswordDto } from './dto/create-user-dto';
import { Role, UserProps } from './interfaces/user.interfaces';
import { HackathonService } from '../hackathon/hackathon.service';
import HttpStatusCodes from '../../configurations/HttpStatusCodes';
import { Roles } from '@/middleware/authorization/roles.decorator';
import { Submissions } from '../submissions/schemas/submission.schema';
import { Participants } from '../participants/schemas/participants.schema';
import { RolesGuard } from '@/middleware/authorization/guards/roles.guard';
import { HackathonProps } from '../hackathon/interfaces/hackathon.interface';
import { VerifyLogin } from '@/middleware/authorization/verifylogin.strategy';
import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  Body,
  Param,
  Query,
  UseGuards,
  Put,
  HttpException,
} from '@nestjs/common';
import {
  AllowHacksDTO,
  ChangePasswordDto,
  CreateClientUserDto,
  CreateUserDto,
  LoginUserDto,
  UpdateNotificationsDto,
  UpdateUserDto,
} from './dto/create-user-dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private mailService: MailService,
    private userService: UserService,
    private configService: ConfigService,
    private hackathonService: HackathonService,

    @InjectModel(Settings.name)
    private settingsModel: Model<Settings>,

    @InjectModel(Submissions.name)
    private submissionsModel: Model<Submissions>,

    @InjectModel(Participants.name)
    private participantModel: Model<Participants>,
  ) {}

  @Get()
  @UseGuards(VerifyLogin)
  async user(@Res() res: any, @Req() req: any) {
    return res.status(200).send({ user: req.user });
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('all-users-count')
  async getAllUsersCount(@Res() res: any, @Req() req: any) {
    const usersCount = (await this.userService.findAll()).length;
    return res.status(200).send({ usersCount });
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('download-users-emails')
  async downloadUsersEmailsForAdmin(@Res() res: any) {
    try {
      const users = await this.userService.findAll();

      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Users');

      worksheet.columns = [{ header: 'Email', key: 'email', width: 35 }];

      worksheet.addRows(
        users.map((user: any) => ({
          email: user.email,
        })),
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=users-email-techfiesta.xlsx`,
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
  @Put('allow')
  async allowHacks(@Body() body: AllowHacksDTO, @Res() res: any) {
    const value: boolean = body.value;

    try {
      let settings = await this.settingsModel.findOne();

      if (!settings) {
        settings = new this.settingsModel();
      }

      settings.allowHack = value;
      await settings.save();

      res.status(HttpStatusCodes.OK).send({ msg: 'Updated settings', value });
    } catch (error) {
      throw new HttpException('Cannot update ', HttpStatusCodes.BAD_REQUEST);
    }
  }

  @UseGuards(VerifyLogin)
  @Get('stats')
  async loadUserStats(@Res() res: any, @Req() req: any) {
    const allUserParticipation = await this.participantModel.find({
      user: req.user._id,
    });

    const userSubmissions = await this.submissionsModel
      .find({ user: req.user._id })
      .populate({ path: 'hackathon', select: 'hackathonId' })
      .populate({ path: 'user', select: '_id' })
      .select('_id result')
      .exec();

    let hackathons: HackathonProps[];

    if (allUserParticipation.length > 0) {
      const allUserParticipationArrId = allUserParticipation.map(
        (participant) => participant.hackathon,
      );

      hackathons = await this.hackathonService.findByIds(
        allUserParticipationArrId,
      );
    }

    const bigBigObject = {
      hackathons,
      submissions: userSubmissions,
    };

    return res.status(HttpStatusCodes.OK).send(bigBigObject);
  }

  @Put()
  @UseGuards(VerifyLogin)
  async updateUser(
    @Res() res: any,
    @Req() req: any,
    @Body() body: UpdateUserDto,
  ) {
    await this.userService.updateUserProflie(body, req.user);
    return res.status(200).send({ updated: true });
  }

  @UseGuards(VerifyLogin)
  @Put('/notifications')
  async updatedNotificationsInfo(
    @Body() body: UpdateNotificationsDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    const user = req.user;

    const notifications: any = await this.userService.getNotificationsByUser(
      user._id,
    );

    try {
      if (notifications) {
        await this.userService.updateNotifications(notifications._id, body);
        res.status(HttpStatusCodes.OK).send({ msg: 'Info updated' });
      } else {
        await this.userService.createNotifications(body, user);
        return res.status(200).send({ created: true });
      }
    } catch (err) {
      //TODO: notifiy admin with the error message
      console.log(err);
      throw new HttpException(
        'Something went wrong',
        HttpStatusCodes.BAD_REQUEST,
      );
    }
  }

  @Post('client-register')
  async clientRegister(
    @Body() body: CreateClientUserDto,
    @Res() res: any,
  ): Promise<UserProps> {
    const userFound = await this.userService.findOneByEmail(body.email);

    if (userFound)
      throw new HttpException(
        'This email is already associated with an account',
        HttpStatusCodes.BAD_REQUEST,
      );

    const newUser = await this.userService.create(body, [Role.Client]);

    const { password, createdAt, updatedAt, isBanned, ...user } =
      newUser.toObject();

    const newUserData = await this.userService.findOneByEmail(body.email);
    if (!user.isVerified) this.userService.createUserEmailToken(newUserData);

    return res.status(200).json({ user });
  }

  @Post('user-register')
  async userRegister(
    @Body() body: CreateUserDto,
    @Res() res: any,
  ): Promise<UserProps> {
    const userData = await this.userService.findOneByEmail(body.email);

    if (userData)
      throw new HttpException(
        'This email is already associated with an account',
        HttpStatusCodes.BAD_REQUEST,
      );

    const userObject = await this.userService.create(body, [Role.User]);
    const { password, createdAt, updatedAt, ...user } = userObject.toObject();

    const newUserData = await this.userService.findOneByEmail(body.email);
    if (!user.isVerified) this.userService.createUserEmailToken(newUserData);

    return res.status(200).json({ isRegistered: true, user });
  }

  @Post('login')
  async loginUser(
    @Body() body: LoginUserDto,
    @Res() res: any,
  ): Promise<UserProps> {
    const userData = await this.userService.findOneByEmail(body.email);

    if (!userData)
      throw new HttpException(
        'Invalid credentials',
        HttpStatusCodes.BAD_REQUEST,
      );

    const loggedUser = await this.userService.login(body, userData);

    if (!loggedUser.status)
      throw new HttpException(loggedUser.msg, HttpStatusCodes.BAD_REQUEST);

    const { password, createdAt, updatedAt, ...user } = userData.toObject();

    if (!userData.isVerified) this.userService.createUserEmailToken(userData);

    return res.status(200).send({
      ...loggedUser,
      user,
      isAuthenticated: true,
      token: loggedUser.token,
    });
  }

  @Post('request-password')
  async requestPassword(
    @Body() body: ResetPasswordDto,
    @Res() res: any,
  ): Promise<Response<any>> {
    const userData = await this.userService.findOneByEmail(body.email);

    if (!userData)
      throw new HttpException('User not found', HttpStatusCodes.FORBIDDEN);

    const { msg, status, email } =
      await this.userService.createForgotPasswordCode(userData);

    return res.status(status).send({ msg, passwordRequested: true, email });
  }

  @Get('verify-account/:token')
  async verifyAccount(@Param('token') token: string, @Res() res: any) {
    if (!token)
      return res
        .status(302)
        .redirect(
          `${this.configService.get(
            'CLIENT_URL',
          )}/login?msg=Invalid token provided`,
        );

    const { isVerified, msg } = await this.userService.verifyEmailToken(token);

    if (isVerified)
      return res
        .status(302)
        .redirect(`${this.configService.get('CLIENT_URL')}/login?msg=${msg}`);

    if (!isVerified)
      return res
        .status(302)
        .redirect(`${this.configService.get('CLIENT_URL')}/login?msg=${msg}`);
  }

  @Get('reset-password')
  async resetPassword(@Query('code') code: string, @Res() res: any) {
    const {
      redirect,
      statusCode,
      userId,
      msg,
      code: token,
    } = await this.userService.verifyResetPasswordCode(code);

    if (userId)
      return res
        .status(statusCode)
        .redirect(
          `${this.configService.get(
            'CLIENT_URL',
          )}/reset-password?id=${userId}&code=${token}`,
        );

    if (redirect)
      return res
        .status(statusCode)
        .redirect(
          `${this.configService.get('CLIENT_URL')}/recover-password?msg=${msg}`,
        );

    return res
      .status(statusCode)
      .redirect(
        `${this.configService.get('CLIENT_URL')}/recover-password?msg=${msg}`,
      );
  }

  @Post('change-password')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Res() res: any,
  ): Promise<void> {
    const user = await this.userService.findOneByid(body.id);
    if (!user)
      throw new HttpException('User not found', HttpStatusCodes.FORBIDDEN);

    const { msg, statusCode } = await this.userService.updateUserPassword({
      email: user.email,
      ...body,
    });

    return res.status(statusCode).send({ msg, changed: true });
  }

  @UseGuards(VerifyLogin)
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Post('invite-users')
  async inviteUsers(@Body() invitedUsers: any, @Res() res: any): Promise<void> {
    try {
      const emails = invitedUsers.map((user: UserProps) => user.email);

      const notFoundEmails = await this.userService.findNonExistingEmails(
        emails,
      );

      const createdUsers =
        await this.userService.createUsersWithRandomPasswords(notFoundEmails);

      await this.mailService.sendInviteUsersEmail(createdUsers);

      return res.send({ createdUsers }).status(200);
    } catch (error) {
      throw new HttpException(error, HttpStatusCodes.FORBIDDEN);
    }
  }
}
