import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('jwt')) // 이 라우팅은 auth0로 인해 보호됨
  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
