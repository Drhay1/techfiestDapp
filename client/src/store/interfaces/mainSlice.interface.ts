import { ErrorProps } from './user.interface';

//TODO: define testimonals props
export interface MainSliceProps {
  appVersion: string;
  paymentTicker: string;
  testimonials: any[];
  allowHacks: boolean;
  allowing: boolean;
  allowed: boolean;
  errMsg: ErrorProps | null | any;
  canLaunchHacks?: boolean;
}
