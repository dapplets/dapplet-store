import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IDappletsList, Lists } from "../../config/types";

export interface HeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  selectedList?: Lists
  setSelectedList: any
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>
  loginInfo: string | null
}