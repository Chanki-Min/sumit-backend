import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitySchema, MixedList } from 'typeorm';

export const getTypeOrmSqliteMemoryTestingModule = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  entities: EntitySchema<any>[],
) => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: entities,
    synchronize: true,
  }),
  TypeOrmModule.forFeature(entities),
];
