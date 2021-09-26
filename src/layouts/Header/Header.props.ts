import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IDappletsList } from "../../config/types";

export interface HeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  selectedList: IDappletsList | undefined
  setSelectedList: any
}