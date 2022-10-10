import { Module } from '@nestjs/common';

import { PagesModule } from '../pages/pages.module';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';

@Module({
  controllers: [SlidesController],
  providers: [SlidesService],
})
export class SlidesModule {}
