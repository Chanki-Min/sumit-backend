import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private pageRepositry: Repository<Page>,
  ) {}

  async create(userId: string, createPageDto: CreatePageDto) {
    const emptyPageEntity = this.pageRepositry.create();
    const pageToSave = this.pageRepositry.merge(
      emptyPageEntity,
      {
        user_uuid: userId,
      },
      createPageDto,
    );

    return await this.pageRepositry.save(pageToSave);
  }

  // TODO: rate-limit
  async findAll(userId: string) {
    return await this.pageRepositry.find({
      where: {
        user_uuid: userId,
      },
    });
  }

  async findOne(userId: string, pageId: string) {
    return await this.pageRepositry.findOne({
      where: {
        user_uuid: userId,
        uuid: pageId,
      },
    });
  }

  async update(userId: string, pageId: string, updatePageDto: UpdatePageDto) {
    const pageToUpdate = await this.pageRepositry.findOne({
      where: {
        user_uuid: userId,
        uuid: pageId,
      },
    });

    const updatedPage = this.pageRepositry.merge(pageToUpdate, updatePageDto);
    return await this.pageRepositry.save(updatedPage);
  }

  async remove(userId: string, pageId: string) {
    const pageToDelete = await this.pageRepositry.findOne({
      where: {
        user_uuid: userId,
        uuid: pageId,
      },
    });

    return await this.pageRepositry.remove(pageToDelete);
  }
}
