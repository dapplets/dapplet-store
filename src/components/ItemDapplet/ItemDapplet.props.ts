import { IDappletsList } from "../../config/types";
import { IDapplet } from "../../models/dapplets";

export interface ItemDappletProps {
  item: IDapplet
  dappletsVersions: any
  selectedDapplets: IDappletsList
  localDapplets: IDappletsList
  dappletsTransactions: any
  editLocalDappletsList: (item: IDapplet) => (e: any) => void
  editSelectedDappletsList: (item: IDapplet) => (e: any) => void
  expandedItems: string[] 
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>
}