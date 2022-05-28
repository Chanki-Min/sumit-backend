import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { CreateBlockDto } from './dto/create-block.dto';
import { CreateRootDto } from './dto/create-root.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { Block } from './entities/block.entity';

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(Block)
    private treeRepository: TreeRepository<Block>,
  ) {}

  async createRoot(createRootDto: CreateRootDto) {
    const rootBlock = await this.treeRepository.create();
    rootBlock.type = 'root_block';
    rootBlock.properties = {};
    rootBlock.uuid = createRootDto.rootBlockId;
    rootBlock.order = 0;

    return await this.treeRepository.save(rootBlock);
  }

  async create(createBlockDto: CreateBlockDto) {
    const rootBlock = await this.treeRepository.findOne(
      createBlockDto.rootBlockId,
    );

    const parentBlock = await this.treeRepository.findOne(
      createBlockDto.parentId,
    );

    // TODO: assert parent is within rootblock

    const newBlock = new Block();
    newBlock.properties = createBlockDto.block.properties;
    newBlock.type = createBlockDto.block.type;
    newBlock.uuid = createBlockDto.block.uuid;
    newBlock.order = createBlockDto.block.order;
    newBlock.parent = parentBlock;

    return await this.treeRepository.save(newBlock);
  }

  async findAll() {
    return await this.treeRepository.findTrees();
  }

  async findOne(id: string) {
    return await this.treeRepository.findOne(id);
  }

  async update(id: number, updateBlockDto: UpdateBlockDto) {
    return `This action updates a #${id} block`;
  }

  async remove(id: number) {
    return `This action removes a #${id} block`;
  }
}
