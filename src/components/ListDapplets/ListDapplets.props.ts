import { IDappletsList, Lists } from "../../config/types";
import { IDapplet } from "../../models/dapplets";

export interface ListDappletsProps {
  dapplets: IDapplet[]
  selectedDapplets: IDappletsList
  setSelectedDapplets: React.Dispatch<React.SetStateAction<IDappletsList>>
  localDapplets: IDappletsList
  setLocalDapplets: React.Dispatch<React.SetStateAction<IDappletsList>>
  selectedList?: Lists
  setSelectedList: any
  expandedItems: string[]
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>
  sortType: string
  searchQuery: string
  addressFilter: string
  setAddressFilter: any
  setSortType: any
  editSearchQuery: any
  trustedUsersList: string[]
  setTrustedUsersList: any
  isTrustedSort: boolean
  openedList: any
  setOpenedList: any
  address: string
}