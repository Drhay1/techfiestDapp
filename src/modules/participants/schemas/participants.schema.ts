import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BUserProps } from '../../company/interface/company.interface';
import { User } from '../../user/schemas/user.schema';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';

export type CompanyDocument = HydratedDocument<BUserProps>;

@Schema({ timestamps: true })
export class Participants {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Hackathon' })
  hackathon: Types.ObjectId;

  @Prop({ required: true })
  userWalletAddress: string;
}

export const ParticipantsSchema = SchemaFactory.createForClass(Participants);
ParticipantsSchema.plugin(customTimestampPlugin);
