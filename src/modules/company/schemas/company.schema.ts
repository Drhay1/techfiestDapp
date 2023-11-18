import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BUserProps } from '../../company/interface/company.interface';
import { User } from '../../user/schemas/user.schema';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';

export type CompanyDocument = HydratedDocument<BUserProps>;

@Schema({ timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } })
export class Company {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Hackathon' })
  hackathon: Types.ObjectId;

  @Prop()
  companyName: string;

  @Prop()
  country: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  logo: string;

  @Prop()
  zipCode: number;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
CompanySchema.plugin(customTimestampPlugin);
