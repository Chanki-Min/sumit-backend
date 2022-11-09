import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Slide } from '../../slides/entities/slide.entity';

@Entity()
export class Page {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 50 })
  user_uuid: string;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  share: boolean;

  @Column('simple-array', { nullable: true })
  hashtags: string[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @OneToMany(() => Slide, (slide) => slide.page_uuid, {
    cascade: false,
    eager: true,
  })
  slides: Slide[];
}
