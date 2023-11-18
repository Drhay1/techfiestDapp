import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {}
