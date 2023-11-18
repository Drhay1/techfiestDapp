import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Web3Service } from '../web3/web3.service';
import { UserService } from '../user/user.service';
import { HackathonService } from './hackathon.service';
import { CompanyService } from '../company/company.service';
import { HackathonController } from './hackathon.controller';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Escrow, EscrowSchema } from './schemas/escrow.schema';
import { Winners, WinnersSchema } from './schemas/winners.schema';
import { SettingSchema, Settings } from '@/general/settings.schema';
import { SubmissionsService } from '../submissions/submissions.service';
import { Hackathon, HackathonsSchema } from './schemas/hackathon.schema';
import { Company, CompanySchema } from '../company/schemas/company.schema';
import { ParticipantsService } from '../participants/participants.service';
import {
  Transactions,
  TransactionsSchema,
} from './schemas/transactions.schema';
import {
  Notifications,
  NotificationsSchema,
} from '../user/schemas/notifications.schema';
import {
  PasswordRecover,
  PasswordRecoverSchema,
} from '../user/schemas/passwordRecover.schema';
import {
  SubmissionSchema,
  Submissions,
} from '../submissions/schemas/submission.schema';
import {
  Participants,
  ParticipantsSchema,
} from '../participants/schemas/participants.schema';
import {
  UserEmailVerification,
  UserEmailVerificationSchema,
} from '../user/schemas/userEmailVerification.schema';

@Module({
  providers: [
    UserService,
    Web3Service,
    CompanyService,
    HackathonService,
    SubmissionsService,
    ParticipantsService,
  ],
  controllers: [HackathonController],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Escrow.name, schema: EscrowSchema },
      { name: Winners.name, schema: WinnersSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Settings.name, schema: SettingSchema },
      { name: Hackathon.name, schema: HackathonsSchema },
      { name: Submissions.name, schema: SubmissionSchema },
      { name: Transactions.name, schema: TransactionsSchema },
      { name: Participants.name, schema: ParticipantsSchema },
      { name: Notifications.name, schema: NotificationsSchema },
      { name: PasswordRecover.name, schema: PasswordRecoverSchema },
      { name: UserEmailVerification.name, schema: UserEmailVerificationSchema },
    ]),
  ],
})
export class HackathonModule {}
