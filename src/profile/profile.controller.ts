import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthzUser, User } from '../decorators/user.decorator';
import { ProfileService } from './profile.service';

@ApiBearerAuth()
@ApiTags('profile')
@UseGuards(AuthGuard('jwt'))
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @User() { sub: userId }: AuthzUser,
  ) {
    return this.profileService.uploadImage(userId, file);
  }
}
