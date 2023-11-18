import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class HackathonInitDto {
  @ApiProperty({
    description: 'Hackathon Name',
    example: 'hackathon 1',
  })
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
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Submission Deadline is required' })
  submissionDeadline: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'End Date is required' })
  endDate: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Equal Distribution is required' })
  equalDistribution: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'initial Reward Amount is required' })
  @IsNumber()
  initialRewardAmount: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Connect your wallet to proceed' })
  @IsString()
  account?: any;

  @ApiProperty()
  @IsString({ message: 'Invalid address' })
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
}

export class HackathonSendDto {
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
  @IsNotEmpty({ message: 'Reward Count is required' })
  @IsNumber()
  rewardCount: number;

  @ApiProperty()
  @IsOptional()
  escrowAddress?: string;

  @ApiProperty()
  account: any;

  @ApiProperty()
  totalRewardinUsd: any;

  @ApiProperty()
  rewardsArrayInUSD: any[];

  @ApiProperty()
  @IsNotEmpty({ message: 'Network Name is required' })
  networkName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Chain Id is required' })
  @IsNumber()
  chainId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Start Date is required' })
  startDate: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Submission Deadline is required' })
  submissionDeadline: string;

  @ApiProperty()
  @IsOptional({ message: 'End Date is required' })
  endDate: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Equal Distribution is required' })
  equalDistribution: string;

  @ApiProperty()
  documentations: any[];

  @ApiProperty()
  @IsOptional()
  escrowId?: string;

  @ApiProperty()
  tokenAmounts: any;

  @ApiProperty()
  @IsNotEmpty({ message: 'Deposited Token Amount is required' })
  depositedTokenAmount: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Please select a reward token' })
  rewardTokenAddress: any;

  @ApiProperty()
  // @IsNotEmpty({ message: 'isNew is required' })
  // @IsBoolean()
  isNew: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  slug: string;
}

export class HackathonPublishDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'Invalid Hackathon ID' })
  id: number;
}

export class UpdateHackathonDto extends PartialType(HackathonInitDto) {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  hackathonId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No description provided' })
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Submission Criteria is required' })
  submissionCriteria: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Events is required' })
  events: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Invalid start date' })
  startDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  submissionDeadline: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Invalid end date' })
  endDate: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  slug: string;
}
