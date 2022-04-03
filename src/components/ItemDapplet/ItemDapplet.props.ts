import { IDapplet } from "../../models/dapplets";
import { MyListElement } from "../../models/myLists";

export interface ItemDappletProps {
  item: IDapplet;
  dappletsVersions: any;
  selectedDapplets: MyListElement[];
  localDapplets: MyListElement[];
  dappletsTransactions: any;
  editLocalDappletsList: (item: IDapplet) => (e: any) => void;
  editSelectedDappletsList: (item: IDapplet) => (e: any) => void;
  expandedItems: string[];
  setExpandedItems: React.Dispatch<React.SetStateAction<string[]>>;
}
