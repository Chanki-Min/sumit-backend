import * as path from 'path';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { Repository, TreeRepository } from 'typeorm';

import { Block } from '../blocks/entities/block.entity';
import { Slide } from '../slides/entities/slide.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,

    @InjectRepository(Slide)
    private slideRepository: Repository<Slide>,

    @InjectRepository(Block)
    private blockRepository: TreeRepository<Block>,
  ) {}

  async create(userId: string, createPageDto: CreatePageDto) {
    const emptyPageEntity = this.pageRepository.create();
    const emptySlideEntity = this.slideRepository.create();

    const emptyBlockEntity = this.blockRepository.create();
    emptyBlockEntity.type = 'root_block';
    emptyBlockEntity.properties = {};

    emptyBlockEntity.order = 0;

    emptySlideEntity.root_block = emptyBlockEntity;
    emptySlideEntity.order = 0;
    emptySlideEntity.pathname = '/';

    const pageToSave = this.pageRepository.merge(
      emptyPageEntity,
      {
        user_uuid: userId,
      },
      createPageDto,
    );

    const page = await this.pageRepository.save(pageToSave);
    emptySlideEntity.page_uuid = page.uuid;
    console.log(emptySlideEntity);
    const rootBlock = await this.blockRepository.save(emptyBlockEntity);
    await this.slideRepository.save(emptySlideEntity);

    const textBlock = this.blockRepository.create();
    textBlock.type = 'plain_text';
    textBlock.properties = { text: '' };
    textBlock.parent = rootBlock;
    textBlock.order = 0;
    textBlock.pid = rootBlock.uuid;
    await this.blockRepository.save(textBlock);
  }

  // TODO: rate-limit
  async findAll(userId: string) {
    return await this.pageRepository.find({
      where: {
        user_uuid: userId,
      },
    });
  }

  async findOne(userId: string, pageId: string) {
    return await this.pageRepository.findOne({
      where: {
        user_uuid: userId,
        uuid: pageId,
      },
      relations: ['slides'],
    });
  }

  async update(userId: string, pageId: string, updatePageDto: UpdatePageDto) {
    const pageToUpdate = await this.pageRepository.findOne({
      where: {
        user_uuid: userId,
        uuid: pageId,
      },
    });

    const updatedPage = this.pageRepository.merge(pageToUpdate, updatePageDto);
    return await this.pageRepository.save(updatedPage);
  }

  async uploadImage(userId: string, pageId: string, file: Express.Multer.File) {
    // const pageToUpdate = await this.pageRepository.findOne({
    //   where: {
    //     user_uuid: userId,
    //     uuid: pageId,
    //   },
    // });

    return await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: path.join('page-thumb', pageId),
        // ACL: 'public-read',
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();
  }

  async remove(userId: string, pageId: string) {
    const pageToDelete = await this.pageRepository.findOne({
      where: {
        user_uuid: userId,
        uuid: pageId,
      },
    });

    return await this.pageRepository.remove(pageToDelete);
  }
}
