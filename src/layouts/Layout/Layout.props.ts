import { IDapplet, IDappletsList, Lists } from "../../config/types";

export interface LayoutProps {
  dappletTitles?: { [x: string]: string }
  selectedDappletsList: IDappletsList
  setSelectedDappletsList: any
  localDappletsList: IDappletsList
  setLocalDappletsList: React.Dispatch<React.SetStateAction<IDappletsList>>
  selectedList?: Lists
  setSelectedList: React.Dispatch<React.SetStateAction<Lists | undefined>>
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
