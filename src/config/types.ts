import { BigNumber } from '@ethersproject/bignumber';

export enum Lists {
  Selected = 'Selected dapplets',
  Local = 'My dapplets',
}

export interface IDappletsListElement {
  name: string
  type: string
}

export interface IDappletsList {
  listName: Lists
  dapplets: IDappletsListElement[]
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
  version: any
  versionToShow: string
  timestamp: any
  timestampToShow: string
}
