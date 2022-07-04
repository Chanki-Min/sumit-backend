import { BlockDTO } from './create-block.dto';

export interface IndentBlockDTO {
  rootBlockId: string;
  block: BlockDTO;
  directon: 'left' | 'right';
  csr: {
    splitParentPath: number[];
    splitItemPath: number[];
  };
}
