import { Slide } from 'src/models/slides/entities/slide.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Page {
  @PrimaryGeneratedColumn('uuid')
  uuid: number;

  @Column({ type: 'varchar', length: 50 })
  user_uuid: string;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  @Column({ type: 'boolean' })
  share: boolean;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @OneToMany(() => Slide, (slide) => slide.page_uuid, {
    cascade: false,
  })
  slides: Slide[];
}
