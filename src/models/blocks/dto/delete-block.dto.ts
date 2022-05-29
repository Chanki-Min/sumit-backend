import { BlockDTO } from './create-block.dto';

export interface DeleteBlockDTO {
  rootBlockId: string;
  blockId: string;
  csr: {
    blockPath: number[];
  };
}
