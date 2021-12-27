interface AnchorParams {
  sortType: string
  addressFilter: string
  searchQuery: string
  isTrustedSort: boolean
  selectedList: string | undefined
}


export const getAnchorParams = () => {
  const urlParts   = document.URL.split('#');
  const anchor = (urlParts.length > 1) ? decodeURI(urlParts[1]) : null
  if (!anchor) return null
  const params = Object.fromEntries(anchor.split('|').map((param) => param.split('=')))
  if (params.selectedList === 'undefined') params.selectedList = undefined
  params.isTrustedSort = params.isTrustedSort === 'true'
  console.log({params})
  return params
}

export const setAnchorParams = ({
  sortType,
  addressFilter,
  searchQuery,
  isTrustedSort,
  selectedList,
}: AnchorParams) => {
  const urlParts   = document.URL.split('#');
  window.location.href = 
    `${urlParts[0]}#sortType=${sortType}|addressFilter=${addressFilter}|searchQuery=${searchQuery}|isTrustedSort=${isTrustedSort}|selectedList=${selectedList}`
}