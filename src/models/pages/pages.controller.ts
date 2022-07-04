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

import { User, AuthzUser } from '../../decorators/user.decorator';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PagesService } from './pages.service';

@UseGuards(AuthGuard('jwt'))
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  create(
    @User() { sub: userId }: AuthzUser,
    @Body() createPageDto: CreatePageDto,
  ) {
    return this.pagesService.create(userId, createPageDto);
  }

  @Get()
  findAllByUser(@User() { sub: userId }: AuthzUser) {
    return this.pagesService.findAll(userId);
  }

  @Get(':pageId')
  findOne(@User() { sub: userId }: AuthzUser, @Param('pageId') pageId: string) {
    return this.pagesService.findOne(userId, pageId);
  }

  @Patch(':pageId')
  update(
    @User() { sub: userId }: AuthzUser,
    @Param('pageId') pageId: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pagesService.update(userId, pageId, updatePageDto);
  }

  @Delete(':pageId')
  remove(@User() { sub: userId }: AuthzUser, @Param('pageId') pageId: string) {
    return this.pagesService.remove(userId, pageId);
  }
}
