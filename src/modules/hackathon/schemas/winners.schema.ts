import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';

export type TransactionDocument = HydratedDocument<any>;

@Schema({ timestamps: true })
export class Winners {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Hackathon', required: true })
  hackathon: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  winners: Types.ObjectId[];

  @Prop({ default: false })
  notified: Boolean;

  @Prop({ type: [Number], required: true })
  amounts: number[];

  getTotalAmount(): number {
    return this.amounts.reduce((total, amount) => total + amount, 0);
  }
}

export const WinnersSchema = SchemaFactory.createForClass(Winners);
WinnersSchema.plugin(customTimestampPlugin);
