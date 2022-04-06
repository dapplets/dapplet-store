import { MyListElement } from "../models/myLists";

export const updateDappletItem = (
  dapplet: MyListElement,
  field: string,
  value: unknown,
) => {
  return {
    ...dapplet,
    [field]: value,
  };
};

export const removeDappletItem = (dapplets: MyListElement[], index: number) => {
  return [...dapplets.slice(0, index), ...dapplets.slice(index + 1)];
};
