import { Types } from 'mongoose';
import { Address } from '@/models/types';
import { UserProps } from '@/modules/user/interfaces/user.interfaces';

export interface HackathonProps {
  _id?: string;
  user?: UserProps;
  escrow: Types.ObjectId;
  status: string;
  company: Record<'_id' | 'companyName', string | Types.ObjectId>;
  participants: Record<any, any>;
  address: Address;
  initialRewardAmount: number;
  hackathonName: string;
  description: string;
  submissionCriteria: string;
  events: string;
  rewardCount: number;
  group: string[];
  account: string;
  totalRewardinUsd: number;
  rewardsArrayInUSD: string[];
  submissionDeadline: Date;
  networkName: string;
  chainId: number;
  equalDistribution: string;
  documentations: string[];
  escrowId: string;
  tokenAmounts: number;
  onReview: boolean;
  published: boolean;
}
