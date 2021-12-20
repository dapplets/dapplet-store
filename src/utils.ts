import { IDappletsList } from "./config/types";

export const saveListToLocalStorage = (dappletsList: IDappletsList) => {
  const { listName: name, dapplets } = dappletsList;
  const dappletsListStringified = JSON.stringify(dapplets);
  window.localStorage.setItem(name, dappletsListStringified);
};

export const saveUsersListToLocalStorage = (usersList: string[]) => {
  window.localStorage.setItem('trustedUsers', JSON.stringify(usersList));
};
