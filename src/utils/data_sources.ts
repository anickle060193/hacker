export interface WikimediaRecentChangeData {
  id: number;
  wiki: string;
  title: string;
  type: string;
  user: string;
  comment?: string;
}

export interface BlockchainNewBlockData {
  op: "block";
  x: {
    txIndexes: number[];
    nTx: number;
    totalBTCSent: number;
    estimatedBTCSent: number;
    reward: number;
    size: number;
    blockIndex: number;
    prevBlockIndex: number;
    height: number;
    hash: string;
    mrklRoot: string;
    version: number;
    time: number;
    bits: number;
    nonce: number;
  };
}

export interface BlockchainNewTransactionData {
  op: "utx";
  x: {
    lock_time: number;
    ver: number;
    size: number;
    inputs: {
      sequence: number;
      prev_out: {
        spent: true;
        tx_index: number;
        type: number;
        addr: string;
        value: number;
        n: number;
        script: string;
      };
      script: string;
    }[];
    time: number;
    tx_index: number;
    vin_sz: number;
    hash: string;
    vout_sz: number;
    relayed_by: string;
    out: {
      spent: false;
      tx_index: number;
      type: number;
      addr: string;
      value: number;
      n: number;
      script: string;
    }[];
  };
}
