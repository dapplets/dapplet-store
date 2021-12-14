import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IDappletsList, Lists } from "../../config/types";

export interface SidePanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  dappletTitles?: { [x: string]: string }
  localDappletsList: IDappletsList
  setLocalDappletsList: React.Dispatch<React.SetStateAction<IDappletsList>>
  setSelectedList: React.Dispatch<React.SetStateAction<Lists | undefined>>
  selectedDappletsList: IDappletsList
  setSelectedDappletsList: any
  activeTags: string[]
  setActiveTags: any
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>
}