import { UserProps } from '@/modules/user/interfaces/user.interfaces';

export interface SubmissionsInterface {
  user: UserProps;
  userWalletAddress: string;
  trxHash?: string;
  hackathon: any;
  escrow?: string;
  result: string;
}
