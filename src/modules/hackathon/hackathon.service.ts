import moment from 'moment';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserProps } from '../user/interfaces/user.interfaces';
import { UpdateHackathonDto } from './dto/create-hackathon-dto';
import { Hackathon, HackathonStatus } from './schemas/hackathon.schema';
import { Participants } from '../participants/schemas/participants.schema';
import { Company } from '../company/schemas/company.schema';

@Injectable()
export class HackathonService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private readonly mailService: MailService,

    @InjectModel(Hackathon.name)
    private hackathonModel: Model<Hackathon>,

    @InjectModel(Participants.name)
    private participantModel: Model<Participants>,

    @InjectModel(Company.name)
    private companyModel: Model<Company>,
  ) {}

  async getHackathons(page: number, limit: number): Promise<Hackathon[]> {
    const skip = (page - 1) * limit;
    return await this.hackathonModel
      .find()
      .populate({
        path: 'company',
        select: 'companyName logo',
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async getHackathonById(id: number): Promise<any> {
    return await this.hackathonModel
      .findOne({ hackathonId: id })
      .populate({ path: 'company', select: 'companyName logo _id' })
      .populate({ path: 'escrow' })
      .exec();
  }

  async getHackathonByIdWithMore(hackathonId: number): Promise<Hackathon> {
    const hackathon = await this.hackathonModel
      .findOne({ hackathonId })
      .populate({ path: 'winners', select: 'firstname lastname' })
      .populate({ path: 'company', select: 'companyName logo id' })
      .populate({ path: 'participants', select: 'id email firstname lastname' })
      .populate({
        path: 'submissions',
        select:
          'result createdAt score reviewed accepted _id userWalletAddress slug requiresCountry',
        populate: { path: 'user', select: 'firstname lastname _id' },
      })
      .exec();

    const newParticipants = await Promise.all(
      hackathon.participants.map(async (participant: any) => {
        const updatedParticipant = await this.participantModel.findOne(
          {
            user: participant._id,
            hackathon: hackathon._id,
          },
          'userWalletAddress',
        );

        const participantWithUpdatedInfo = {
          ...participant.toObject(),
          userWalletAddress: updatedParticipant.userWalletAddress || null,
        };
        return participantWithUpdatedInfo;
      }),
    );

    const newHackathon = {
      ...hackathon.toObject(),
      participants: newParticipants,
    };

    return newHackathon;
  }

  async getHackathonSubmissions(hackathonId: number): Promise<Hackathon> {
    const hackathon = await this.hackathonModel
      .findOne({ hackathonId })
      .populate({
        path: 'submissions',
        select:
          'result createdAt score reviewed accepted _id userWalletAddress',
        populate: { path: 'user', select: 'firstname lastname _id email' },
      })
      .exec();

    return hackathon;
  }

  async sendHackathonRequest(data: any): Promise<any> {
    const newHackthon = await this.hackathonModel.create({
      ...data,
    });

    return newHackthon;
  }

  async getHackathonRequests(): Promise<any> {
    return this.hackathonModel
      .find({ status: HackathonStatus.pending })
      .populate({
        path: 'company',
        select: 'companyName',
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async generateItemId(): Promise<number> {
    const item = await this.hackathonModel
      .findOne()
      .sort({ hackathonId: -1 })
      .exec();

    return item ? (item.hackathonId ? item.hackathonId + 1 : 1) : 1;
  }

  async generateDeadline(days: number): Promise<Date> {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);
    return deadline;
  }

  async publishAHackathon(hackathonId: number): Promise<void> {
    const update = await this.hackathonModel.updateOne(
      { hackathonId },
      { status: HackathonStatus.published },
    );

    const hackathon = await this.getHackathonById(hackathonId);

    const allUsers: UserProps[] = await this.userService.findAll();

    const url = `${this.configService.get('CLIENT_URL')}/hacks/${hackathonId}/${
      hackathon.slug
    }`;

    await this.mailService.sendUsersPublishedHackathon(
      hackathon,
      allUsers,
      url,
    );
  }

  async updateHackathon(data: UpdateHackathonDto) {
    const updatedHackathon = await this.hackathonModel
      .findOneAndUpdate({ hackathonId: data.hackathonId }, data, { new: true })
      .exec();

    return updatedHackathon;
  }

  async addWinnersToHackathon(
    hackathonId: number,
    winners: Types.ObjectId[],
  ): Promise<void> {
    const hackathon = await this.hackathonModel.findOne({ hackathonId });
    hackathon.winners.push(...winners);
    await hackathon.save();
  }

  async addTrxToHackathon(
    hackathonId: number,
    txId: Types.ObjectId,
  ): Promise<void> {
    await this.hackathonModel.updateOne(
      { hackathonId },
      { $set: { transaction: txId } },
    );
  }

  async getPublishedAndActiveHackathons(
    page: number,
    limit: number,
  ): Promise<any> {
    const skip = (page - 1) * limit;
    return await this.hackathonModel
      .find({
        status: {
          $in: [
            HackathonStatus.published,
            HackathonStatus.reviewing,
            HackathonStatus.ended,
          ],
        },
      })
      .populate({
        path: 'company',
        select: 'companyName logo',
      })
      .skip(skip)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getSponsors(): Promise<any> {
    const hackathons = await this.hackathonModel
      .find({
        status: {
          $in: [
            HackathonStatus.published,
            HackathonStatus.reviewing,
            HackathonStatus.ended,
          ],
        },
      })
      .populate({
        path: 'company',
        select: 'companyName logo',
      });

    const companies = hackathons.map((hackathon) => hackathon.company);

    const uniqueCompanies = [...new Set(companies)];

    return uniqueCompanies;
  }

  async addUserAsHackathonParticipant(
    user: UserProps,
    hackathon: any,
  ): Promise<any> {
    await this.hackathonModel.findOneAndUpdate(
      { hackathonId: hackathon.hackathonId },
      { $push: { participants: user._id } },
      { new: true },
    );
  }

  async addUserToSubmission(newSubmission: any, hackathon: any): Promise<any> {
    await this.hackathonModel.findOneAndUpdate(
      { hackathonId: hackathon.hackathonId },
      { $push: { submissions: newSubmission._id } },
      { new: true },
    );
  }

  async getHackathonEscrowById(id: number): Promise<any> {
    const result = await this.hackathonModel
      .findOne({ hackathonId: id })
      .populate({ path: 'escrow', select: 'address' })
      .sort({ createdAt: -1 })
      .exec();

    return result;
  }

  async getClientHackathons(
    user: UserProps,
    page: number,
    limit: number,
  ): Promise<any> {
    const skip = (page - 1) * limit;
    return await this.hackathonModel
      .find({ user: user._id })
      .populate({ path: 'company', select: 'companyName' })
      .populate({ path: 'participants', select: 'email firstname lastname' })
      .populate({
        path: 'submissions',
        select:
          'result createdAt score reviewed accepted _id userWalletAddress',
        populate: { path: 'user', select: 'firstname lastname' },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateHackathonStatus(
    hackathonId: number,
    status: HackathonStatus,
  ): Promise<any> {
    const update = await this.hackathonModel.updateOne(
      { hackathonId },
      { status: status },
    );
    return update;
  }

  async findByIds(hackIds: Types.ObjectId[]): Promise<any[]> {
    return await this.hackathonModel
      .find(
        { _id: { $in: hackIds } },
        'slug hackathonName tokenAmounts status hackathonId submissionDeadline rewardTokenAddress totalRewardinUsd',
      )
      .populate({ path: 'company', select: 'companyName' })
      .sort({ createdAt: -1 });
  }

  async getRandomNumber() {
    return Math.floor(Math.random() * (1000000 - 1) + 1);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async changeHackathonStatus() {
    const today = moment();
    const hackathons = await this.hackathonModel
      .find({ status: 'published' })
      .sort({ createdAt: -1 })
      .exec();

    try {
      hackathons.map(async (hackathon: Hackathon) => {
        if (moment(hackathon.submissionDeadline).isBefore(today)) {
          const requiredStatus = [HackathonStatus.published];

          if (requiredStatus.includes(hackathon.status)) {
            await this.hackathonModel.updateOne(
              { hackathonId: hackathon.hackathonId },
              { status: HackathonStatus.reviewing },
            );
          }
        }
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async endOffChainHackathonsWithRewardCount() {
    const hackathons = await this.hackathonModel
      .find()
      .sort({ createdAt: -1 })
      .exec();

    hackathons.map(async (hackathon) => {
      if (
        !hackathon.isOnchain &&
        hackathon.winners.length === hackathon.rewardCount
      ) {
        await this.hackathonModel.updateOne(
          { hackathonId: hackathon.hackathonId },
          { status: HackathonStatus.ended },
        );
      }
    });
  }
}
