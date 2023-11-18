import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

class BaseUserDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(5, { message: 'Password should be at least 5 characters long' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Confirm password is required' })
  cpassword: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'You must agree to the terms and conditions' })
  @IsBoolean()
  agree: boolean;
}
export class CreateClientUserDto extends BaseUserDto {}

export class CreateUserDto extends BaseUserDto {}

class UserDto extends CreateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName?: string;
}

export class NotificationsDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  payout?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  participants?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  recentHackathon?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  hackathonSetup?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  rewards?: boolean;
}
export class UpdateNotificationsDto extends PartialType(NotificationsDto) {}

export class UpdateUserDto extends PartialType(UserDto) {}

export class LoginUserDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(5, { message: 'Password should be at least 5 characters long' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Confirm password is required' })
  // @Equals('password', { message: 'Passwords do not match' })
  cpassword: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Invalid request, id is required' })
  id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Invalid request, code is required' })
  code: string;
}

export class AllowHacksDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'No value proivded' })
  @IsBoolean()
  value: boolean;
}
