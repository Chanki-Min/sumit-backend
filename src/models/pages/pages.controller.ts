import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { of } from 'rxjs';

import { User, AuthzUser } from '../../decorators/user.decorator';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PagesService } from './pages.service';

import 'dotenv/config';

@ApiBearerAuth()
@ApiTags('pages')
@UseGuards(AuthGuard('jwt'))
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  async create(
    @User() { sub: userId }: AuthzUser,
    @Body() createPageDto: CreatePageDto,
  ) {
    return this.pagesService.create(userId, createPageDto);
  }

  @Get()
  async findAllByUser(@User() { sub: userId }: AuthzUser) {
    return this.pagesService.findAll(userId);
  }

  @Get(':pageId')
  async findOne(
    @User() { sub: userId }: AuthzUser,
    @Param('pageId') pageId: string,
  ) {
    return of(this.pagesService.findOne(userId, pageId));
  }

  @Patch(':pageId')
  async update(
    @User() { sub: userId }: AuthzUser,
    @Param('pageId') pageId: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pagesService.update(userId, pageId, updatePageDto);
  }

  @Put(':pageId/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFiles() file: Express.Multer.File,
    @User() { sub: userId }: AuthzUser,
    @Param('pageId') pageId: string,
  ) {
    return this.pagesService.uploadImage(userId, pageId, file);
  }

  @HttpCode(204)
  @Delete(':pageId')
  async remove(
    @User() { sub: userId }: AuthzUser,
    @Param('pageId') pageId: string,
  ) {
    await this.pagesService.remove(userId, pageId);
    return;
  }
}
