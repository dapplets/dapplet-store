import { IDappletsList, Lists } from "../../config/types";

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
}
