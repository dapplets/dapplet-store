import { SetStateAction } from "react";
import { IDapplet } from "../../models/dapplets";

export interface DraggableProps {
  children: JSX.Element
  id: string
  item: IDapplet
  addressFilter: string
  activeId: SetStateAction<string> | null
  trustedUsersList: string[]
  isTrustedSort: boolean
}