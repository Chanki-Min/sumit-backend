import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlocksModule } from '../blocks/blocks.module';
import { Block } from '../blocks/entities/block.entity';
import { Slide } from '../slides/entities/slide.entity';
import { SlidesModule } from '../slides/slides.module';
import { Page } from './entities/page.entity';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Page, Block, Slide])],
  controllers: [PagesController],
  providers: [PagesService],
})
export class PagesModule {}
