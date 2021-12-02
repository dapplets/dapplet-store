import { SetStateAction } from "react";

export interface DraggableProps {
  children: JSX.Element
  id: string
  activeId: SetStateAction<string> | null
}