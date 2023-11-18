import { Address } from '../../utils/tokens';
import { ErrorProps, UserProps } from './user.interface';

export enum HackathonStatus {
  pending = 'pending',
  published = 'published',
  ended = 'ended',
  rejected = 'rejected',
  reviewing = 'reviewing',
}

interface EscrowProps {
  id?: string;
  escrow?: string;
  initialRewardAmount?: number;
}

interface CompanyProps {
  companyName: string;
  logo: string;
}

interface SubmissionsProps {
  _id?: string;
  user: UserProps;
  result: string;
  createdAt: Date;
  userWalletAddress: string;
  score: number;
  accepted: boolean;
}

//TODO: create a type for escrow
//TODO: type for submissions
export interface HackathonProps {
  _id?: string;
  user: UserProps;
  escrow: any[];
  company: CompanyProps;
  participants: UserProps[];
  address: string;
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
  endDate: Date;
  startDate: Date;
  timeZone: string;
  networkName: string;
  chainId: number;
  equalDistribution: string;
  documentations: DocumentationProps[];
  escrowId: string;
  tokenAmounts: number;
  status: HackathonStatus;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  hackathonId: number;
  submissions: SubmissionsProps[];
  rewardTokenAddress?: string;
  winners: string[];
  isOnchain: boolean;
  slug: string;
  paymentToken: Address;
  requiresCountry: boolean;
  concordiumWallet: Address;
}
export interface DocumentationProps {
  documentation: string;
  id: string;
}

export interface HackathonStateProps {
  errMsg?: ErrorProps | null | any;
  escrowProps?: EscrowProps;
  hackathons?: HackathonProps[];
  fetchingRequest?: boolean;
  fetchedRequests?: boolean;
  initializing?: boolean;
  initialized?: boolean;
  sending?: boolean;
  updatingHackathon?: boolean;
  updatedHackathon?: boolean;
  sent?: boolean;
  hackathonToReview?: HackathonProps[];
  fetchingHackInfo?: boolean;
  fetchedHackInfo?: boolean;
  adminHackInfo?: HackathonProps;
  clientHackInfo?: HackathonProps;
  publishing?: boolean;
  published?: boolean;
  fetchingHacks?: boolean;
  fetchedHacks?: boolean;
  hackathonInfo?: HackathonProps;
  registering?: boolean;
  registered?: boolean;
  clientHacks?: HackathonProps[];
  submitting?: boolean;
  submitted?: boolean;
  clientHackathons?: HackathonProps[];
  fetchingClientHack?: boolean;
  fetchedClientHack?: boolean;
  fetchingClientHackSubmissionsDownload?: boolean;
  fetchedClientHackSubmissionsDownload?: boolean;
  fetchingAdminHackSubmissionsDownload?: boolean;
  fetchedAdminHackSubmissionsDownload?: boolean;
  scoring?: boolean;
  scored?: boolean;
  paid?: boolean;
  paying?: boolean;
  rewardTokenAddress?: string;
  companyLogo?: string;
  isCreatingOffChainHackathonLoading?: boolean;
  createdOffChainHackathon?: boolean;
  createdOffChainHackathonInfo?: boolean;
  checkingUserIsPaid?: boolean;
  userIsNowPaid?: boolean;
}

export interface HackathonInitProps {
  hackathonName: string;
  description: string;
  submissionCriteria: string;
  events: string;
  startDate: string;
  submissionDeadline: string;
  endDate: string;
  equalDistribution: string;
  initialRewardAmount: number;
  account: any;
  alternativeWalletAddress?: any;
  chainId: number;
  rewardTokenAddress: string;
  isOnchain: boolean;
}

export interface HackathonUpdateProps {
  hackathonName: string;
  description: string;
  submissionCriteria: string;
  events: string;
  startDate: string;
  submissionDeadline: string;
  endDate: string;
  logo: string | undefined;
  hackathonId: string | number | undefined;
  rewardCount?: number;
  totalRewardinUsd?: any;
  rewardsArrayInUSD?: any[];
  equalDistribution?: string;
  tokenAmounts?: number;
}

export interface HackathonSendProps {
  hackathonName: string;
  description: string;
  submissionCriteria: string;
  events: string;
  rewardCount: number;
  escrowAddress?: string;
  totalRewardinUsd: any;
  rewardsArrayInUSD: any[];
  submissionDeadline: string;
  networkName: string | undefined;
  chainId: number | undefined;
  endDate: string;
  equalDistribution: string;
  documentations: any[];
  escrowId?: string;
  tokenAmounts: any;
  depositedTokenAmount: string;
  rewardTokenAddress: any;
}
