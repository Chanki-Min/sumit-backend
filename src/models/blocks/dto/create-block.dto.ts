import {
  BlockFields,
  BlockTypes,
} from '../interfaces/blockProperties.interface';

export class CreateBlockDto {
  rootBlockId: string;
  parentId: string;
  block: BlockDTO;
  csr: {
    dropPath: number[];
  };
}

export type BlockDTO = {
  uuid: string;

  type: BlockTypes;
  properties: BlockFields['properties'];
  children: BlockDTO[];

  order: number;

  parent: string | null;
};
