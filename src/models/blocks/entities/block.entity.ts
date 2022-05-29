import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import {
  BlockFields,
  BlockTypes,
} from '../interfaces/blockProperties.interface';

@Entity()
@Tree('closure-table')
export class Block {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  type: BlockTypes; // title_1, image 등의 블록 타입을 지정

  @Column({ type: 'json' })
  properties: BlockFields['properties']; // type에 따른 블록의 데이터

  @TreeChildren()
  children: Block[]; // 문제점: Typeorm 에서 children의 순서를 지정하기 어려움

  @Column({ type: 'int' })
  order: number;

  @TreeParent()
  parent: Block;

  @Column({ nullable: true })
  pid: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
