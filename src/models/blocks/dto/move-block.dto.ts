import { BlockDTO } from './create-block.dto';

export class MoveBlockDTO {
  rootBlockId: string;
  targetBlockId: string; // 이동시킬 부모의 id
  order: number;
  csr: {
    block: BlockDTO;
    splitDropzonePath: number[];
    itemPath: number[];
  };
}
