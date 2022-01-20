import { DappletsListItemTypes } from "../components/DappletsListItem/DappletsListItem";
import { Lists, MyListElement } from "../models/myLists";

export const saveListToLocalStorage = (dapplets: MyListElement[], name: Lists) => {
  const dappletsListStringified = JSON.stringify(dapplets.filter((dapp) => name !== Lists.MyListing || dapp.type !== DappletsListItemTypes.Default));
  window.localStorage.setItem(name, dappletsListStringified);
};

export const saveUsersListToLocalStorage = (usersList: string[]) => {
  window.localStorage.setItem('trustedUsers', JSON.stringify(usersList));
};