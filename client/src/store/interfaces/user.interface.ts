export enum Role {
  User = 'user',
  Admin = 'admin',
  Client = 'client',
}

export interface UserProps {
  _id?: any;
  firstname: string;
  lastname: string;
  password?: string;
  email: string;
  isVerified: boolean;
  roles: Role[];
  company?: CompanyProps;
  notifications?: NotificationsProps;
  userWalletAddress?: string;
}

export interface CompanyProps {
  companyName: string;
  country: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  logo?: string;
}

export interface NotificationsProps {
  payout?: boolean;
  participants?: boolean;
  completed?: boolean;
  recentHackathon?: boolean;
  hackathonSetup?: boolean;
  rewards?: boolean;
}

export interface ErrorProps {
  msg: string;
  Id: string;
}

export interface UserStateProps {
  _id?: any;
  account?: string | null;
  defaultCurrency: string;
  user?: UserProps | null;
  usersCount?: number;
  companyInfo?: CompanyProps | null;
  isRegistering?: boolean;
  isLoggin?: boolean;
  isLoading?: boolean;
  errMsg?: ErrorProps | null | any;
  isRegistered?: boolean;
  loggin?: boolean;
  updatingProfile?: boolean;
  updatedProfile?: boolean;
  isAuthenticated?: boolean;
  updatingCompany?: boolean;
  updatedCompany?: boolean;
  updatingNotifications?: boolean;
  updatedNotifications?: boolean;
  updated?: boolean;
  token?: string | any;
  reqResettingPass?: boolean;
  passwordRequestedProps?: {
    msg: string;
    passwordRequested: boolean;
    email: string;
  } | null;
  changedPasswordProps?: {
    msg: string;
    changed: boolean;
  } | null;
  clientProfileProps?: {
    msg: string;
    changed: boolean;
  } | null;
  clientNotificationsProps?: {
    msg: string;
    changed: boolean;
  } | null;
  city?: string;
  notificationsInfo?: NotificationsProps | null;
  loadingStats?: boolean;
  loadingUsers?: boolean;
  stats?: any;
  invitingUsers?: boolean;
  invitedUsers?: boolean;
  createdUsers?: any[] | null;
}

export interface InviteUsersProps {
  selected: boolean;
  name: string;
  email: string;
  invited?: boolean;
}

export interface LoginProps {
  email: string;
  password: string;
}

export interface AuthProps {
  email?: string;
  password?: string;
}
