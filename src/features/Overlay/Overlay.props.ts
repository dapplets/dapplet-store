import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IDappletsList, Lists } from "../../config/types";

export interface OverlayProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  dappletTitles?: { [x: string]: string }
  selectedDappletsList: IDappletsList
  setSelectedDappletsList: any
  selectedList?: Lists
  setSelectedList: React.Dispatch<React.SetStateAction<Lists | undefined>>
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>
}