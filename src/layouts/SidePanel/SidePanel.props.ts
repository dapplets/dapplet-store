import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IDappletsList, Lists } from "../../config/types";

export interface SidePanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  dappletTitles?: { [x: string]: string }
  localDappletsList: IDappletsList
  setLocalDappletsList: React.Dispatch<React.SetStateAction<IDappletsList>>
  selectedList?: Lists
  setSelectedList: React.Dispatch<React.SetStateAction<Lists | undefined>>
  activeTags: string[]
  setActiveTags: any
}