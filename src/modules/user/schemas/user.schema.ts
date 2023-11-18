import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BUserProps } from '../../company/interface/company.interface';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';

export type UserDocument = HydratedDocument<BUserProps>;

enum Role {
  User = 'user',
  Admin = 'admin',
  Client = 'client',
}

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  password: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  updated_at: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: [String], enum: Object.values(Role), default: [Role.User] })
  roles: Role[];

  @Prop({ type: Types.ObjectId, ref: 'Company' })
  company: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Notifications' })
  notifications: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Hackathons' })
  hackathons: Types.ObjectId;

  @Prop({ default: false })
  isBanned: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(customTimestampPlugin);
