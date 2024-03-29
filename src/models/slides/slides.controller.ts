import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { SlidesService } from './slides.service';

@ApiBearerAuth()
@ApiTags('slides')
@UseGuards(AuthGuard('jwt'))
@Controller('slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @Post()
  create(@Body() createSlideDto: CreateSlideDto) {
    return this.slidesService.create(createSlideDto);
  }

  @Get()
  findAll() {
    return this.slidesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slidesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSlideDto: UpdateSlideDto) {
    return this.slidesService.update(+id, updateSlideDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slidesService.remove(+id);
  }
}
