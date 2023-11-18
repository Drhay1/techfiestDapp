import { Injectable } from '@nestjs/common';
import { SubmissionsInterface } from './interfaces/submissions.interfaces';
import { Submissions } from './schemas/submission.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserProps } from '../user/interfaces/user.interfaces';
import { HackathonProps } from '../hackathon/interfaces/hackathon.interface';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submissions.name) private submissionModel: Model<Submissions>,
  ) {}

  async createSubmission(data: SubmissionsInterface): Promise<any> {
    const newSubmission = (
      await this.submissionModel.create({
        ...data,
      })
    ).save();

    return newSubmission;
  }

  async checkUserSubmitted(
    user: UserProps,
    hackathon: HackathonProps,
  ): Promise<HackathonProps> {
    const submission = await this.submissionModel
      .findOne({
        hackathon: hackathon._id,
        user: user._id,
      })
      .exec();

    // @ts-ignore
    return submission;
  }

  async updateUserScore(_id: string, score: number): Promise<any> {
    const result = await this.submissionModel
      .findOneAndUpdate({ _id }, { score, reviewed: true }, { new: true })
      .populate('user', 'firstname lastname')
      .exec();
    return result;
  }

  async setAccepted(_id: string, accepted: boolean): Promise<any> {
    const result = await this.submissionModel
      .findOneAndUpdate({ _id }, { reviewed: true, accepted }, { new: true })
      .populate('user', 'firstname lastname')
      .exec();

    return result;
  }
}
