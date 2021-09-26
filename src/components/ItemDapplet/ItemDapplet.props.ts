import { IDapplet, IDappletsList } from "../../config/types";

export interface ItemDappletProps {
  item: IDapplet
  dappletsVersions: any
  selectedDapplets: IDappletsList
  setSelectedDapplets: any
  localDapplets: IDappletsList
  setLocalDapplets: any
  selectedList: IDappletsList | undefined
  setSelectedList: any
}