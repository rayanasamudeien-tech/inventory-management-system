import { IsEmail, IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class UpdateSupplierDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  contactPerson?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @Matches(/^[+0-9\s()-]+$/, { message: 'Phone number contains invalid characters' })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  category?: string;
}
