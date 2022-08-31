import { IDapplet } from "../../models/dapplets";
import { Lists, MyListElement } from "../../models/myLists";

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
  setOpenedList: any;
  searchQuery: string;
  trustedUsersList: string[];
  isTrustedSort: boolean;
  selectedList: Lists;
  isNotDapplet: boolean;
}
