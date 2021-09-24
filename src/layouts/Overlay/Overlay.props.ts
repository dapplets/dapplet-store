import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IDappletsList } from "../../config/types";

export interface OverlayProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  selectedDapplets: IDappletsList
  setSelectedDapplets: any
  selectedList: IDappletsList | undefined
  setSelectedList: any
}