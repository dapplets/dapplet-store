import { IDapplet, IDappletsList, Lists } from "../../config/types";

export interface ItemDappletProps {
  item: IDapplet
  dappletsVersions: any
  selectedDapplets: IDappletsList
  setSelectedDapplets: any
  localDapplets: IDappletsList
  setLocalDapplets: any
  selectedList?: Lists
  setSelectedList: any
  dappletsTransactions: any
  editLocalDappletsList: (item: IDapplet) => (e: any) => void
  editSelectedDappletsList: (item: IDapplet) => (e: any) => void
}