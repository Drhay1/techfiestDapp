import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Participants } from './schemas/participants.schema';
import { Model } from 'mongoose';
import { UserProps } from '../user/interfaces/user.interfaces';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel(Participants.name)
    private participantModel: Model<Participants>,
  ) {}

  async createParticipantRecord(
    user: UserProps,
    hackathon: any,
    userWalletAddress: string,
  ): Promise<any> {
    const newParticpant = (
      await this.participantModel.create({
        user: user._id,
        hackathon: hackathon._id,
        userWalletAddress,
      })
    ).save();

    return newParticpant;
  }
}
