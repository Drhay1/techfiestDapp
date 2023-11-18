import { Escrow } from './escrow.schema';
import { Address } from '@/models/types';
import { HydratedDocument, Types } from 'mongoose';
import { Transactions } from './transactions.schema';
import { User } from '../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Company } from '@/modules/company/schemas/company.schema';
import { BUserProps } from '../../company/interface/company.interface';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';
import { Submissions } from '@/modules/submissions/schemas/submission.schema';

export type HackathonDocument = HydratedDocument<BUserProps>;

export enum HackathonStatus {
  pending = 'pending',
  published = 'published',
  ended = 'ended',
  rejected = 'rejected',
  reviewing = 'reviewing',
}

export enum GroupEnum {
  ALL = 'all',
  DEVELOPER = 'developers',
}

@Schema({ timestamps: true })
export class Hackathon {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Escrow.name })
  escrow: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Company.name })
  company: Types.ObjectId;

  @Prop({ unique: true, required: true })
  hackathonId: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  participants: User[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Submissions.name }] })
  submissions: Submissions[];

  @Prop()
  depositedTokenAmount: number;

  @Prop()
  depositedTokenAddress: string;

  @Prop()
  initialRewardAmount: number;

  @Prop()
  hackathonName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  submissionCriteria: string;

  @Prop({ required: true })
  events: string;

  @Prop()
  rewardCount: number;

  @Prop()
  account: string;

  @Prop()
  totalRewardinUsd: number;

  @Prop()
  rewardsArrayInUSD: string[];

  @Prop({ required: true })
  submissionDeadline: Date;

  @Prop({ required: false })
  endDate: Date;

  @Prop({ required: false })
  startDate: Date;

  @Prop()
  timeZone: string;

  @Prop()
  networkName: string;

  @Prop()
  chainId: number;

  @Prop()
  equalDistribution: string;

  @Prop()
  documentations: Documentation[];

  @Prop()
  escrowId: string;

  @Prop()
  tokenAmounts: number;

  @Prop({
    type: String,
    enum: Object.values(HackathonStatus),
    default: HackathonStatus.pending,
  })
  status: HackathonStatus;

  @Prop({ default: false })
  published: boolean;

  @Prop({ default: [GroupEnum.ALL] })
  group: GroupEnum[];

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  winners: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Transactions.name }] })
  transaction: Types.ObjectId;

  @Prop({ required: true })
  rewardTokenAddress: string;

  @Prop({ isRequired: true })
  isOnchain: Boolean;

  @Prop({ isRequired: true })
  slug: string;

  @Prop()
  paymentToken: string;

  @Prop()
  requiresAgeLimit: boolean;

  @Prop({ isRequired: true, default: false })
  requiresCountry: boolean;

  @Prop()
  concordiumWallet: string;
}

export class Documentation {
  @Prop()
  documentation: string;

  @Prop()
  id: string;
}

export const HackathonsSchema = SchemaFactory.createForClass(Hackathon);
HackathonsSchema.plugin(customTimestampPlugin);
