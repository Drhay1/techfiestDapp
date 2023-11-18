import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOffChainHackathonDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Hackathon Name is required' })
  hackathonName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Submission Criteria is required' })
  submissionCriteria: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Events is required' })
  events: string;

  @ApiProperty()
  @IsOptional()
  startDate: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Submission Deadline is required' })
  submissionDeadline: string;

  @ApiProperty()
  @IsOptional()
  endDate: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Equal Distribution is required' })
  equalDistribution: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'initial Reward Amount is required' })
  @IsNumber()
  // @Min(200)
  initialRewardAmount: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Connect your wallet to proceed' })
  @IsString()
  account?: any;

  @ApiProperty()
  @IsString()
  @IsOptional()
  alternativeWalletAddress?: any;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'Invalid Chain ID' })
  chainId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Select reward token' })
  rewardTokenAddress: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Choose if the hackathon is launched onchain or offchain',
  })
  @ApiProperty()
  @IsBoolean({ message: 'Value must be a boolean' })
  isOnchain: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  slug: string;
}
