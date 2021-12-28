import { SetStateAction } from "react";
import { IDapplet } from './../../config/types';

export interface DraggableProps {
  children: JSX.Element
  id: string
  item: IDapplet
  addressFilter: string
  activeId: SetStateAction<string> | null
  searchQuery: string
}