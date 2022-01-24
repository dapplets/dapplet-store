import { createModel } from "@rematch/core";

export enum Lists {
  MyListing = 'Selected dapplets',
  MyDapplets = 'My dapplets',
}

export interface MyListElement {
  name: string
  type: string
}

export interface MyLists {
  [key: string]: MyListElement[],
}

type MyListsState = Readonly<MyLists>
const INITIAL_STATE: MyListsState = {
  [Lists.MyListing]: [],
  [Lists.MyDapplets]: [],
};

const reducers = {
  setMyList(state: MyListsState, {name, elements}: {name: Lists, elements: MyListElement[]}) {
    return {
      ...state,
      [name]: elements,
    }
  },
  removeMyList(state: MyListsState, name: Lists) {
    return {
      ...state,
      [name]: [],
    }
  },
}

const effects = (dispatch: any) => ({
  getLists(payload: Lists) {
    const dappletsListStringified = window.localStorage.getItem(payload);
    if (dappletsListStringified) {
      const dappletsListParsed: MyListElement[] = JSON.parse(dappletsListStringified);
      console.log({dappletsListParsed})
      dispatch.myLists.setMyList({
        name: payload,
        elements: dappletsListParsed,
      });
    }
  },
})

export const myLists = createModel()({
  name: 'myLists',
  state: INITIAL_STATE,
  reducers,
  effects,
});
