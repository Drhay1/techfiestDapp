import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';

export type TransactionDocument = HydratedDocument<any>;

@Schema({ timestamps: true })
export class Transactions {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: Types.ObjectId;

  @Prop({ required: true })
  transactionHash: string;

  @Prop({ type: Types.ObjectId, ref: 'Hackathon', required: true })
  hackathon: Types.ObjectId;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions);
TransactionsSchema.plugin(customTimestampPlugin);
