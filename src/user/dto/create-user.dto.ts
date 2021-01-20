import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { getEnumKeys } from 'src/utils';
import { Gender, Role } from '../enums';

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(255)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsISO8601({ strict: true })
  dob: Date;

  @IsEnum(Gender, {
    message: `gender: must be one of: '${getEnumKeys(Gender)}' value.`,
  })
  gender: Gender;

  @IsEnum(Role, {
    message: `role: must be a valid role value ${getEnumKeys(Role)}`,
  })
  role: Role;

  @IsPhoneNumber('MX')
  mobile: string;
}
