import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, TreeRepository } from 'typeorm';

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
    private dataSource: DataSource,
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
    const rootBlock = await this.treeRepository.findOneBy({
      uuid: createBlockDto.rootBlockId,
    });

    const parentBlock = await this.treeRepository.findOneBy({
      uuid: createBlockDto.rootBlockId,
    });

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
    const block = await this.treeRepository.findOneBy({
      uuid: id,
    });

    return await this.treeRepository.findDescendantsTree(block);
  }

  async findOne(id: string) {
    return await this.treeRepository.findOneBy({
      uuid: id,
    });
  }

  async update(id: string, updateBlockDto: UpdateBlockDto) {
    const block = await this.treeRepository.findOneBy({
      uuid: id,
    });
    block.properties = updateBlockDto.block.properties;
    block.type = updateBlockDto.block.type;
    return await this.treeRepository.save(block);
  }

  async remove(deleteBlockDTO: DeleteBlockDTO) {
    const blockToRemove = await this.treeRepository.findOneBy({
      uuid: deleteBlockDTO.blockId,
    });
    const parent = await this.treeRepository.findOneBy({
      uuid: blockToRemove.pid,
    });

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
    const block = await this.treeRepository.findOneBy({ uuid: id });
    const blockWithTree = await this.treeRepository.findDescendantsTree(block);

    const targetParent = await this.treeRepository.findOneBy({
      uuid: moveBlockDTO.targetBlockId,
    });
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
      for (const [_, child] of targetParentWithTree.children
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

  async syncBulk({ block }: CreateBlukDto, parent?: Block) {
    const currBlock = await this.treeRepository.findOneBy({ uuid: block.uuid });

    console.log(currBlock, block.uuid, '\n\n');

    currBlock.blockJson = {
      ...block,
    };

    const r = await this.treeRepository.save(currBlock);

    return r;

    // try {
    //   let currBlock = await repo.findOneBy({ uuid: block.uuid });
    //   if (currBlock !== null && currBlock.type !== 'root_block') {
    //     await repo.remove(currBlock);
    //   }

    //   if (currBlock === null || currBlock.type !== 'root_block') {
    //     currBlock = repo.create();
    //     currBlock.uuid = block.uuid.replace(/-/gi, '');
    //     // newBlock.uuid = block.uuid.replace(/-/gi, '');
    //     currBlock.type = block.type;
    //     currBlock.properties = block.properties;
    //     currBlock.order = block.order;
    //   }

    //   if (parent) {
    //     currBlock.parent = parent;
    //   }
    //   const saved = await repo.save(currBlock);

    //   if (block.children.length > 0) {
    //     for (const child of block.children.sort((a, b) => a.order - b.order)) {
    //       await this.syncBulk({ block: child }, saved);
    //     }
    //   }
    //   await queryRunner.commitTransaction();
    // } catch (e) {
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    // }
  }
}

function move<T>(arr: T[], from: number, to: number) {
  const newArr = [...arr];

  const item = newArr.splice(from, 1)[0];
  newArr.splice(to, 0, item);

  return newArr;
}
