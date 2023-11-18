import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubmissionSchema, Submissions } from './schemas/submission.schema';

@Module({
  providers: [SubmissionsService],
  controllers: [SubmissionsController],
  imports: [
    MongooseModule.forFeature([
      { name: Submissions.name, schema: SubmissionSchema },
    ]),
  ],
})
export class SubmissionsModule {}
