import { createModel } from "@rematch/core";
import { DappletsListItemTypes } from "../components/DappletsListItem/DappletsListItem";

export enum Lists {
  MyListing = 'Selected dapplets',
  MyDapplets = 'My dapplets',
}

export interface MyListElement {
  id: number
  name: string
  type: DappletsListItemTypes
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
      // console.log({dappletsListParsed})
      dispatch.myLists.setMyList({
        name: payload,
        elements: dappletsListParsed,
      });
    }
  },
  async getMyDapplets() {
    const dapps = await window.dapplets.getMyDapplets()
    dispatch.myLists.setMyList({
      name: Lists.MyDapplets,
      elements: dapps.map(({name}: {name: string}) => ({
        name,
        type: DappletsListItemTypes.Default,
      })),
    });
    // console.log({dapps})
  },
  async addMyDapplet({registryUrl, moduleName}: {registryUrl: string, moduleName: string}) {
    await window.dapplets.addMyDapplet('0x55627158187582228031eD8DF9893d76318D084E', moduleName)
    // console.log({dapps})
  },
  async removeMyDapplet({registryUrl, moduleName}: {registryUrl: string, moduleName: string}) {
    await window.dapplets.removeMyDapplet('0x55627158187582228031eD8DF9893d76318D084E', moduleName)
    // console.log({removed: moduleName})
  },
})

export const myLists = createModel()({
  name: 'myLists',
  state: INITIAL_STATE,
  reducers,
  effects,
});
