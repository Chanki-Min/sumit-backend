import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsByteLength,
} from 'class-validator';

export class CreatePageDto {
  @IsNotEmpty()
  @IsByteLength(0, 50)
  title: string;

  @IsOptional()
  @IsByteLength(0, 200)
  description?: string; // default: null

  @IsOptional()
  @IsBoolean()
  share?: boolean; // default: false

  @IsArray()
  @IsByteLength(0, 200, { each: true })
  @IsOptional()
  hashtags?: string[]; // default: null
}
