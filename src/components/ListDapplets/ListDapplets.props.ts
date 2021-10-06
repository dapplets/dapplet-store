import { IDappletsList } from "../../config/types";

export interface ListDappletsProps {
  list: any[]
  dappletsVersions: any
  selectedDapplets: IDappletsList
  setSelectedDapplets: any
  localDapplets: IDappletsList
  setLocalDapplets: any
  selectedList: IDappletsList | undefined
  setSelectedList: any
  dappletsTransactions: any
  updateDappletsTransactions: any
}