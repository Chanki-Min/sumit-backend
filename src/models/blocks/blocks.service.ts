import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { chown } from 'fs';
import { TreeRepository } from 'typeorm';
import { CreateBlockDto } from './dto/create-block.dto';
import { CreateBlukDto } from './dto/create-bulk.dto';
import { CreateRootDto } from './dto/create-root.dto';
import { DeleteBlockDTO } from './dto/delete-block.dto';
import { IndentBlockDTO } from './dto/indent-block.dto';
import { MoveBlockDTO } from './dto/move-block.dto';
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

    const parentAncestors = await this.treeRepository.findAncestors(
      parentBlock,
    );

    if (parentAncestors[0].uuid !== rootBlock.uuid) {
      // TODO: 예외처리 (parent가 root에 없음)
    }

    const newBlock = new Block();
    newBlock.properties = createBlockDto.block.properties;
    newBlock.type = createBlockDto.block.type;
    newBlock.uuid = createBlockDto.block.uuid;
    newBlock.order = createBlockDto.block.order;
    newBlock.pid = parentBlock.uuid;
    newBlock.parent = parentBlock;

    return await this.treeRepository.save(newBlock);
  }

  async findAll() {
    return await this.treeRepository.findTrees();
  }

  async findOneAsFullTree(id: string) {
    const block = await this.treeRepository.findOne(id);
    return await this.treeRepository.findDescendantsTree(block);
  }

  async findOne(id: string) {
    return await this.treeRepository.findOne(id);
  }

  async update(id: string, updateBlockDto: UpdateBlockDto) {
    const block = await this.treeRepository.findOne(id);
    block.properties = updateBlockDto.block.properties;
    block.type = updateBlockDto.block.type;
    return await this.treeRepository.save(block);
  }

  async remove(deleteBlockDTO: DeleteBlockDTO) {
    const blockToRemove = await this.treeRepository.findOne(
      deleteBlockDTO.blockId,
      {},
    );
    const parent = await this.treeRepository.findOne(blockToRemove.pid);

    const parentWithBlockToRemoveWithChild =
      await this.treeRepository.findDescendantsTree(parent);

    const blockToRemovesChilds = parentWithBlockToRemoveWithChild.children.find(
      (c) => c.uuid === blockToRemove.uuid,
    ).children;

    for (const [index, child] of blockToRemovesChilds.entries()) {
      child.parent = parent;
      child.pid = parent.uuid;
      child.order = blockToRemove.order + index;
      await this.treeRepository.save(child);
    }

    const siblingToReorder = parentWithBlockToRemoveWithChild.children
      .filter(
        (c) => c.uuid !== blockToRemove.uuid && c.order > blockToRemove.order,
      )
      .sort((c) => c.order);

    for (const [index, sibling] of siblingToReorder.entries()) {
      sibling.order = blockToRemove.order + blockToRemovesChilds.length + index;
      await this.treeRepository.save(sibling);
    }
    await this.treeRepository.remove(blockToRemove);
  }

  async move(id: string, moveBlockDTO: MoveBlockDTO) {
    const block = await this.treeRepository.findOne(id);
    const blockWithTree = await this.treeRepository.findDescendantsTree(block);

    const targetParent = await this.treeRepository.findOne(
      moveBlockDTO.targetBlockId,
    );
    const targetParentWithTree = await this.treeRepository.findDescendantsTree(
      targetParent,
    );

    if (targetParentWithTree.children.some((c) => c.uuid === block.uuid)) {
      const moved = move(
        targetParentWithTree.children.sort((a, b) => a.order - b.order),
        block.order,
        moveBlockDTO.order,
      );

      moved.forEach((v, i) => (v.order = i));
      for (const m of moved) {
        await this.treeRepository.save(m);
      }
    } else {
      for (const [index, child] of targetParentWithTree.children
        .sort((c) => c.order)
        .slice(moveBlockDTO.order)
        .entries()) {
        child.order += 1;
        await this.treeRepository.save(child);
      }
      blockWithTree.order = moveBlockDTO.order;
      blockWithTree.parent = targetParentWithTree;
      await this.treeRepository.save(blockWithTree);
    }
  }

  // TODO: implement index
  async indent(indentBlockDTO: IndentBlockDTO) {
    //   const block = await this.treeRepository.findOne(indentBlockDTO.block.uuid);
    //   if (indentBlockDTO.directon === 'right') {
    //   } else {
    //   }
  }

  async createBulk({ block }: CreateBlukDto, parent?: Block) {
    const newBlock = this.treeRepository.create();
    newBlock.uuid = block.uuid.replace(/-/gi, '');
    newBlock.type = block.type;
    newBlock.properties = block.properties;
    newBlock.order = block.order;
    if (parent) {
      newBlock.parent = parent;
    }
    const saved = await this.treeRepository.save(newBlock);

    if (block.children.length > 0) {
      for (const child of block.children.sort((a, b) => a.order - b.order)) {
        await this.createBulk({ block: child }, saved);
      }
    }
  }
}

function move<T>(arr: T[], from: number, to: number) {
  const newArr = [...arr];

  const item = newArr.splice(from, 1)[0];
  newArr.splice(to, 0, item);

  return newArr;
}
