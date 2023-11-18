import { Types } from 'mongoose';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PayoutDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Provide the transaction hash' })
  hash: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'UserId not provided' })
  userId: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty({ message: 'Invalid hackathon ID' })
  hackathonId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'No amount provided' })
  amount: number;
}
