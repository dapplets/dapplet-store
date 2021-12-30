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

