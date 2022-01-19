import { IDappletsList, Lists } from "../../config/types";
import { IDapplet } from "../../models/dapplets";

export interface LayoutProps {
  dappletTitles?: { [x: string]: string }
  selectedDappletsList: IDappletsList
  setSelectedDappletsList: any
  localDappletsList: IDappletsList
  setLocalDappletsList: React.Dispatch<React.SetStateAction<IDappletsList>>
  selectedList?: Lists
  setSelectedList: any
	children?: React.ReactElement
  activeTags: string[]
  setActiveTags: any
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>
  trustedUsersList: string[]
  setAddressFilter: any
  openedList: any
  setOpenedList: any
  loginInfo: string | null
  dapplets: IDapplet[]
}
