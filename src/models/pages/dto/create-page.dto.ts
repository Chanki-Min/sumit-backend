import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsByteLength,
} from 'class-validator';

export class CreatePageDto {
  @ApiProperty({
    description: 'Title of page',
    minLength: 1,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsByteLength(0, 50)
  title: string;

  @ApiPropertyOptional({
    description: 'Description of page',
    minLength: 0,
    maxLength: 200,
  })
  @IsOptional()
  @IsByteLength(0, 200)
  description?: string; // default: null

  @ApiPropertyOptional({
    description: 'Decide to share this page to other users',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  share?: boolean; // default: false

  @ApiPropertyOptional({
    description: 'Array of hashtags',
    default: null,
    isArray: true,
    maxLength: 200,
    minLength: 0,
    type: [String],
    // maxItems: 20,
  })
  @IsArray()
  @IsByteLength(0, 200, { each: true })
  @IsOptional()
  hashtags?: string[]; // default: null
}
