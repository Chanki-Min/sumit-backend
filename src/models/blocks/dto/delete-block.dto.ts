export interface DeleteBlockDTO {
  rootBlockId: string;
  blockId: string;
  csr: {
    blockPath: number[];
  };
}
