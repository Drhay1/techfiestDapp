import { User } from './user.schema';
import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BUserProps } from '../../company/interface/company.interface';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';

export type NotificationsDocument = HydratedDocument<BUserProps>;

@Schema({ timestamps: true })
export class Notifications {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  user: Types.ObjectId;

  @Prop()
  payout: boolean;

  @Prop()
  participants: boolean;

  @Prop()
  completed: boolean;

  @Prop()
  recentHackathon: boolean;

  @Prop()
  hackathonSetup: boolean;

  @Prop()
  rewards: boolean;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
NotificationsSchema.plugin(customTimestampPlugin);
