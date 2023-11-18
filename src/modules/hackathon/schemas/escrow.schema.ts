import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BUserProps } from '../../company/interface/company.interface';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';

export type CompanyDocument = HydratedDocument<BUserProps>;

@Schema({ timestamps: true })
export class Escrow {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: Types.ObjectId;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  initialRewardAmount: number;

  @Prop({ type: Types.ObjectId, ref: 'Hackathon' })
  hackathon: Types.ObjectId;
}

export const EscrowSchema = SchemaFactory.createForClass(Escrow);
EscrowSchema.plugin(customTimestampPlugin);
