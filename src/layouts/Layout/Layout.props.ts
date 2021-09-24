import { IDappletsList } from "../../config/types";

export interface LayoutProps {
  selectedDapplets: IDappletsList
  setSelectedDapplets: any
  localDapplets: IDappletsList
  setLocalDapplets: any
  selectedList: IDappletsList | undefined
  setSelectedList: any
	children?: React.ReactElement
}
