import path from 'path';
import { promisify } from 'util';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { Repository } from 'typeorm';

import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const s3UploadAsync = promisify(s3.upload);

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
  ) {}

  async create(userId: string, createPageDto: CreatePageDto) {
    const emptyPageEntity = this.pageRepository.create();
    const pageToSave = this.pageRepository.merge(
      emptyPageEntity,
      {
        user_uuid: userId,
      },
      createPageDto,
    );

    return await this.pageRepository.save(pageToSave);
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
    const pageToUpdate = await this.pageRepository.findOne({
      where: {
        user_uuid: userId,
        uuid: pageId,
      },
    });

    const s3UploadParam = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: path.join('page-thumb', pageId),
      ACL: 'public-read',
      Body: file,
      ContentType: 'image/png',
    };

    return await s3UploadAsync(s3UploadParam);
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
