import { IsEmail, IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  contactPerson: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  @Matches(/^[+0-9\s()-]+$/, { message: 'Phone number contains invalid characters' })
  phone: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  @MinLength(2)
  category: string;
}
