import { Module } from '@nestjs/common';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Participants,
  ParticipantsSchema,
} from './schemas/participants.schema';

@Module({
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  imports: [
    MongooseModule.forFeature([
      { name: Participants.name, schema: ParticipantsSchema },
    ]),
  ],
})
export class ParticipantsModule {}
