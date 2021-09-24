import { BigNumber } from '@ethersproject/bignumber';

export interface IDapplet {
  description: string
  flags: BigNumber
  icon: {
    hash: string
    uris: string[]
  }
  interfaces: any[]
  moduleType: 1
  name: string
  owner: string
  title: string
}

export interface IDappletsList {
  name: string
  dapplets: {
    [key: string]: string
  }
}
