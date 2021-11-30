import { IDapplet, IDappletsList } from "./config/types";

export const saveListToLocalStorage = (dappletsList: IDappletsList) => {
  const { listName: name, dappletsNames: dapplets } = dappletsList;
  const dappletsListStringified = JSON.stringify(dapplets);
  window.localStorage.setItem(name, dappletsListStringified);
};
