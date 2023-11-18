import { Types } from 'mongoose';

export enum Role {
  User = 'user',
  Admin = 'admin',
  Client = 'client',
}

export interface UserProps {
  id?: string;
  _id?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  cpassword?: string;
  company?: Types.ObjectId;
  notifications?: Types.ObjectId;
  email?: string;
  isVerified?: boolean;
  isRegistered?: boolean;
  roles?: Role[];
  msg?: string;
  isBanned?: boolean;
  code?: string;
  createdAt?: Date;
  updatedAt?: Date;
  toObject?: () => any;
}

export interface AuthProps {
  email?: string;
  password?: string;
}
