import { SetStateAction } from "react";
import { IDapplet } from "../../models/dapplets";
import { MyListElement } from "../../models/myLists";
import { TrustedUser } from "../../models/trustedUsers";

export interface DraggableProps {
  children: JSX.Element;
  id: string;
  item: IDapplet;
  addressFilter: string;
  activeId: SetStateAction<string> | null;
  trustedUsersList: TrustedUser[];
  isTrustedSort: boolean;
  selectedDapplets: MyListElement[];
}
