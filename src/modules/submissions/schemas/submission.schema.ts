import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { IsBoolean, IsInt, IsString, IsUrl, Max } from 'class-validator';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';

export type SubmissionDocument = HydratedDocument<Submissions>;

@Schema({ timestamps: true })
export class Submissions {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: Types.ObjectId;

  @IsString()
  @Prop({ required: true, unique: false })
  userWalletAddress: string;

  @Prop({
    type: Number,
    validate: [isScoreValid, 'Score must be less than or equal to 1000'],
  })
  @IsInt()
  @Max(1000)
  score: number;

  @Prop()
  @IsBoolean()
  reviewed: boolean;

  @Prop()
  accepted: boolean;

  @Prop({ required: true })
  @IsUrl()
  result: string;

  @Prop({ type: Types.ObjectId, ref: 'Hackathon', required: true })
  hackathon: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Escrow' })
  escrow: Types.ObjectId;
}

function isScoreValid(value: number): boolean {
  return value <= 1000;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submissions);
SubmissionSchema.plugin(customTimestampPlugin);
