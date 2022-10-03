import { IDapplet } from "../../models/dapplets";
import { Lists, MyListElement } from "../../models/myLists";
import { TrustedUser } from "../../models/trustedUsers";

export interface SortableListProps {
  dapplets: IDapplet[];
  items: MyListElement[];
  setItems: React.Dispatch<React.SetStateAction<MyListElement[]>>;
  selectedDapplets: MyListElement[];
  localDapplets: MyListElement[];
  editLocalDappletsList: (item: IDapplet) => void;
  editSelectedDappletsList: (item: IDapplet) => void;
  setAddressFilter: any;
  addressFilter: string;
  searchQuery: string;
  trustedUsersList: TrustedUser[];
  isTrustedSort: boolean;
  selectedList: Lists;
  isNotDapplet: boolean;
  expandedCards: any;
  setExpandedCards: React.Dispatch<any>;
}
