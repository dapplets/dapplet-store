import { IDappletsList } from "./config/types";

export const saveListToLocalStorage = (dappletsList: IDappletsList) => {
  const { listName: name, dapplets } = dappletsList;
  const dappletsListStringified = JSON.stringify(dapplets);
  window.localStorage.setItem(name, dappletsListStringified);
};
