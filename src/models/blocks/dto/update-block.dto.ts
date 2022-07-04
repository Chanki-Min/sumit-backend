import { BlockDTO } from './create-block.dto';

export class UpdateBlockDto {
  rootBlockId: string;
  block: BlockDTO;
  csr: {
    blockPath: number[];
  };
}
