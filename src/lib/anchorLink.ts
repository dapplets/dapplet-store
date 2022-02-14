import { Lists } from '../models/myLists';
import { Sort } from '../models/sort'

let timer: any | null = null

export const getAnchorParams = (isFirst: boolean = true, address: string = '') => {
  const urlParts   = document.URL.split('#');
  const anchor = (urlParts.length > 1) ? decodeURI(urlParts[1]) : null
  if (!anchor) return null
  const params = Object.fromEntries(anchor.split('&').map((param) => param.split('=')))
  if (params.selectedList === 'undefined') params.selectedList = undefined
  params.isTrustedSort = params.isTrustedSort === 'true'
  if (params.selectedList === Lists.MyListing && isFirst) params.selectedList = undefined
  if (params.addressFilter === address && address !== '') params.selectedList = Lists.MyListing
  return params
}

export const setAnchorParams = ({
  sortType,
  addressFilter,
  searchQuery,
  isTrustedSort,
  selectedList,
}: Sort) => {
  
  const urlParts = document.URL.split('#');
  const newUrl = `${urlParts[0]}#sortType=${sortType}&addressFilter=${addressFilter}&searchQuery=${searchQuery}&isTrustedSort=${isTrustedSort}&selectedList=${selectedList}`
  if (timer !== null) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    window.location.href = newUrl
    timer = null
  }, 1000)
  
}
