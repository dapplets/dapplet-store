import { DappletsListItemTypes } from "./components/atoms/DappletsListItem";
import { IDappletsList } from "./config/types";

export const saveListToLocalStorage = (dappletsList: IDappletsList) => {
  const { listName: name, dapplets } = dappletsList;
  console.log({test: dapplets.filter((dapp) => dapp.type !== DappletsListItemTypes.Default)})
  const dappletsListStringified = JSON.stringify(dapplets.filter((dapp) => dapp.type !== DappletsListItemTypes.Default));
  window.localStorage.setItem(name, dappletsListStringified);
};

export const saveUsersListToLocalStorage = (usersList: string[]) => {
  window.localStorage.setItem('trustedUsers', JSON.stringify(usersList));
};
