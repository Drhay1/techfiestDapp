import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CompanyDocument = HydratedDocument<any>;

@Schema({ timestamps: true })
export class Settings {
  @Prop({ type: Types.ObjectId, default: false })
  allowHack: boolean;
}

export const SettingSchema = SchemaFactory.createForClass(Settings);
