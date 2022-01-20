import { IDappletsList } from "../../config/types";
import { IDapplet } from "../../models/dapplets";

export interface SortableListProps {
  dapplets: IDapplet[]
  items?: IDappletsList
  setItems: React.Dispatch<React.SetStateAction<IDappletsList>>
  selectedDapplets: IDappletsList
  localDapplets: IDappletsList
  editLocalDappletsList: (item: IDapplet) => void
  editSelectedDappletsList: (item: IDapplet) => void
  setAddressFilter: any
  addressFilter: string
  setOpenedList: any
  searchQuery: string
  trustedUsersList: string[]
  isTrustedSort: boolean
}