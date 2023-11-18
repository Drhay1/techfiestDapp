import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('participants')
@Controller('participants')
export class ParticipantsController {}
