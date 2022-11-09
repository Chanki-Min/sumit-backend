import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { CreateBlukDto } from './dto/create-bulk.dto';
import { CreateRootDto } from './dto/create-root.dto';
import { DeleteBlockDTO } from './dto/delete-block.dto';
import { MoveBlockDTO } from './dto/move-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@ApiBearerAuth()
@ApiTags('blocks')
@UseGuards(AuthGuard('jwt'))
@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}
  @Post('bulk')
  createBulk(@Body() createBlukDto: CreateBlukDto) {
    return this.blocksService.syncBulk(createBlukDto);
  }

  @Post('root')
  createRoot(@Body() createBlockDto: CreateRootDto) {
    return this.blocksService.createRoot(createBlockDto);
  }

  @Post()
  create(@Body() createBlockDto: CreateBlockDto) {
    return this.blocksService.create(createBlockDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blocksService.findOne(id);
  }

  @Get('tree/:id')
  findOneAsFullTree(@Param('id') id: string) {
    return this.blocksService.findOneAsFullTree(id);
  }

  @Get()
  findAll() {
    return this.blocksService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlockDto: UpdateBlockDto) {
    return this.blocksService.update(id, updateBlockDto);
  }

  @Patch('move/:id')
  moveBlock(@Param('id') id: string, @Body() moveBlockDTO: MoveBlockDTO) {
    return this.blocksService.move(id, moveBlockDTO);
  }

  @Delete()
  remove(@Body() deleteBlockDTO: DeleteBlockDTO) {
    return this.blocksService.remove(deleteBlockDTO);
  }
}
