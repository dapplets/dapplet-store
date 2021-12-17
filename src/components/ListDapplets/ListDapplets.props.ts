import { IDapplet, IDappletsList, IDappletVersions, Lists } from "../../config/types";

export interface ListDappletsProps {
  dapplets: IDapplet[]
  dappletsVersions?: IDappletVersions
  selectedDapplets: IDappletsList
  setSelectedDapplets: React.Dispatch<React.SetStateAction<IDappletsList>>
  localDapplets: IDappletsList
  setLocalDapplets: React.Dispatch<React.SetStateAction<IDappletsList>>
  selectedList?: Lists
  setSelectedList: React.Dispatch<React.SetStateAction<Lists | undefined>>
  dappletsTransactions: any
  updateDappletsTransactions: any
  expandedItems: string[]
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>
  sortType: string
  searchQuery: string
  addressFilter: string
  setAddressFilter: any
  setSortType: any
  editSearchQuery: any
}