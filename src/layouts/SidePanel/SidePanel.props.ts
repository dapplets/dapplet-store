import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IDappletsList } from "../../config/types";

export interface SidePanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  localDapplets: IDappletsList
  setLocalDapplets: any
  selectedList: IDappletsList | undefined
  setSelectedList: any
  activeTags: string[]
  setActiveTags: any
}