import { MyListElement } from '../models/myLists'

export const updateMyListing = (
  dapplets: MyListElement[],
  dapplet: MyListElement,
  index: number
) => {
  return [...dapplets.slice(0, index), dapplet, ...dapplets.slice(index + 1)]
}
