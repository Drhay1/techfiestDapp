import { Types } from 'mongoose';
import { UserProps } from 'src/modules/user/interfaces/user.interfaces';

export interface CompanyProps {
  id?: string;
  companyName?: string;
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: number;
  position?: string;
  user?: Types.ObjectId;
  toObject?: () => any;
}

export interface BUserProps {
  defaultCurrency?: string;
  isClient?: boolean;
  isParticipant?: boolean;
  user?: UserProps;
  companyInfo?: CompanyProps | null;
  notifications?: null;
}
