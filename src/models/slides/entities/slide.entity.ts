import { Block } from 'src/models/blocks/entities/block.entity';
import { Page } from 'src/models/pages/entities/page.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Slide {
  @PrimaryGeneratedColumn('uuid')
  uuid: number;

  @Column({ type: 'varchar', length: 50 })
  pathname: string;

  @Column()
  order: number;

  @ManyToOne(() => Page, (page) => page.slides, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  page_uuid: string;

  @OneToOne(() => Block)
  @JoinColumn()
  root_block: Block;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
