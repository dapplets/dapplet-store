import { BigNumber } from '@ethersproject/bignumber';

export enum Lists {
  Selected = 'Selected dapplets',
  Local = 'My dapplets',
}

export interface IDappletsList {
  listName: Lists
  dappletsNames: string[]
}

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

export interface IDappletVersions {
  [name: string]: string[]
}
