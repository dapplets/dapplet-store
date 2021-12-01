import { IDapplet, IDappletsList, Lists } from "../../config/types";

export interface ItemDappletProps {
  item: IDapplet
  dappletsVersions: any
  selectedDapplets: IDappletsList
  localDapplets: IDappletsList
  selectedList?: Lists
  dappletsTransactions: any
  editLocalDappletsList: (item: IDapplet) => (e: any) => void
  editSelectedDappletsList: (item: IDapplet) => (e: any) => void
}