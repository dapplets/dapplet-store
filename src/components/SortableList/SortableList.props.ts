import { IDapplet, IDappletsList, Lists } from "../../config/types";

export interface SortableListProps {
  dapplets: IDapplet[]
  items?: IDappletsList
  setItems: React.Dispatch<React.SetStateAction<IDappletsList>>
  selectedDapplets: IDappletsList
  localDapplets: IDappletsList
  editLocalDappletsList: (item: IDapplet) => (e: any) => void
  editSelectedDappletsList: (item: IDapplet) => (e: any) => void
  expandedItems: string[] 
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>
  setAddressFilter: any
  addressFilter: string
  setOpenedList: any
  searchQuery: string
}