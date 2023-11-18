import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { HackathonService } from '../hackathon/hackathon.service';
import { SettingSchema, Settings } from '@/general/settings.schema';
import {
  Notifications,
  NotificationsSchema,
} from './schemas/notifications.schema';
import {
  PasswordRecover,
  PasswordRecoverSchema,
} from './schemas/passwordRecover.schema';
import {
  Hackathon,
  HackathonsSchema,
} from '../hackathon/schemas/hackathon.schema';
import {
  UserEmailVerification,
  UserEmailVerificationSchema,
} from './schemas/userEmailVerification.schema';
import {
  SubmissionSchema,
  Submissions,
} from '../submissions/schemas/submission.schema';
import {
  Participants,
  ParticipantsSchema,
} from '../participants/schemas/participants.schema';
import { Company, CompanySchema } from '../company/schemas/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Settings.name, schema: SettingSchema },
      { name: Hackathon.name, schema: HackathonsSchema },
      { name: Submissions.name, schema: SubmissionSchema },
      { name: Participants.name, schema: ParticipantsSchema },
      { name: Notifications.name, schema: NotificationsSchema },
      { name: PasswordRecover.name, schema: PasswordRecoverSchema },
      { name: UserEmailVerification.name, schema: UserEmailVerificationSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, HackathonService],
  exports: [MongooseModule],
})
export class UserModule {}
