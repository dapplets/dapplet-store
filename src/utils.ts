import { DappletsListItemTypes } from "./components/atoms/DappletsListItem";
import { IDappletsList, Lists } from "./config/types";

export const saveListToLocalStorage = (dappletsList: IDappletsList) => {
  const { listName: name, dapplets } = dappletsList;
  const dappletsListStringified = JSON.stringify(dapplets.filter((dapp) => name !== Lists.Selected || dapp.type !== DappletsListItemTypes.Default));
  window.localStorage.setItem(name, dappletsListStringified);
};

export const saveUsersListToLocalStorage = (usersList: string[]) => {
  window.localStorage.setItem('trustedUsers', JSON.stringify(usersList));
};
