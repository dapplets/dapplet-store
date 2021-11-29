import { IDappletsList } from "../../config/types";

export interface ListDappletsProps {
  list: any[]
  dappletsVersions: any
  selectedDapplets: IDappletsList
  setSelectedDapplets: React.Dispatch<React.SetStateAction<IDappletsList>>
  localDapplets: IDappletsList
  setLocalDapplets: React.Dispatch<React.SetStateAction<IDappletsList>>
  selectedList: IDappletsList | undefined
  setSelectedList: any
  dappletsTransactions: any
  updateDappletsTransactions: any
}