import { UserGender, UserRole } from '@user/enums';
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

  @IsEnum(UserGender, {
    message: `gender: must be one of: '${getEnumKeys(UserGender)}' value.`,
  })
  gender: UserGender;

  @IsEnum(UserRole, {
    message: `role: must be a valid role value ${getEnumKeys(UserRole)}`,
  })
  role: UserRole;

  @IsPhoneNumber('MX')
  mobile: string;
}
