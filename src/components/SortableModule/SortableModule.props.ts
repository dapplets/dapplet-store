import { IDapplet, IDappletsList } from "../../config/types";

export interface SortableModuleProps {
  children: JSX.Element[]
  items?: IDappletsList
  setItems: React.Dispatch<React.SetStateAction<IDappletsList>>
}