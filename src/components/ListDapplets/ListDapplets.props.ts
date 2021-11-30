import { IDapplet, IDappletsList, IDappletVersions, Lists } from "../../config/types";

export interface ListDappletsProps {
  list: IDapplet[]
  dappletsVersions?: IDappletVersions
  selectedDapplets: IDappletsList
  setSelectedDapplets: React.Dispatch<React.SetStateAction<IDappletsList>>
  localDapplets: IDappletsList
  setLocalDapplets: React.Dispatch<React.SetStateAction<IDappletsList>>
  selectedList?: Lists
  setSelectedList: React.Dispatch<React.SetStateAction<Lists | undefined>>
  dappletsTransactions: any
  updateDappletsTransactions: any
}