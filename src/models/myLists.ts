import { createModel } from "@rematch/core";
import { BigNumber, ethers } from "ethers";
import { DappletsListItemTypes } from "../components/DappletsListItem/DappletsListItem";
import { ModalsList } from "./modals";
import abiListing2 from "./abi2";

export enum Lists {
  MyListing = "Selected dapplets",
  MyOldListing = "Selected Old dapplets",
  MyDapplets = "My dapplets",
}

export interface MyListElement {
  id: number;
  name: string;
  type: DappletsListItemTypes;
  event?: number;
  eventPrev?: number;
}

export interface MyLists {
  [key: string]: MyListElement[];
}

type MyListsState = Readonly<MyLists>;
const INITIAL_STATE: MyListsState = {
  [Lists.MyListing]: [],
  [Lists.MyOldListing]: [],
  [Lists.MyDapplets]: [],
};

const reducers = {
  setMyList(
    state: MyListsState,
    { name, elements }: { name: Lists; elements: MyListElement[] },
  ) {
    return {
      ...state,
      [name]: elements,
    };
  },
  removeMyList(state: MyListsState, name: Lists) {
    return {
      ...state,
      [name]: [],
    };
  },
};

const effects = (dispatch: any) => ({
  getLists(payload: Lists) {
    const dappletsListStringified = window.localStorage.getItem(payload);
    if (dappletsListStringified) {
      const dappletsListParsed: MyListElement[] = JSON.parse(
        dappletsListStringified,
      );
      dispatch.myLists.setMyList({
        name: payload,
        elements: dappletsListParsed,
      });
    }
  },
  async getMyListing({
    address,
    provider,
    dappletsNames,
  }: {
    address: string;
    provider: any;
    dappletsNames: { [name: number]: string };
  }) {
    if (provider.chainId !== "0x5") {
      dispatch.modals.setModalOpen({
        openedModal: ModalsList.Warning,
        settings: {
          onRetry: async () => {
            try {
              await dispatch.myLists.getMyListing({ address, provider });
              dispatch.modals.setModalOpen({
                openedModal: ModalsList.Warning,
                settings: null,
              });
            } catch (error) {
              console.error(error);
            }
          },
        },
      });
      throw new Error("Change network to Goerli");
    }
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = await ethersProvider.getSigner();
    const contractListing: any = await new ethers.Contract(
      "0x2446a2d38c99e22ea47b02a38d2afa41001618ca",
      abiListing2,
      signer,
    ); //0xc8B80C2509e7fc553929C86Eb54c41CC20Bb05fB //0x3470ab240a774e4D461456D51639F033c0cB5363
    const req = await contractListing.getLinkedList(address);

    const localListing: { [name: string]: MyListElement } = {};
    const dappsFromLocal = window.localStorage.getItem(Lists.MyListing);
    if (dappsFromLocal) {
      const dappletsListParsed: MyListElement[] = JSON.parse(dappsFromLocal);
      dappletsListParsed.forEach((dapp) => {
        localListing[dapp.name] = dapp;
      });
    }

    const listing: MyListElement[] = req
      .map((id: number) => {
        const dapp = {
          id: id,
          name: dappletsNames[id],
          type: DappletsListItemTypes.Default,
        };
        if (localListing && localListing[dapp.name]) {
          dapp.type = localListing[dapp.name].type;
        }
        return dapp;
      })
      .filter((dapp: MyListElement) => !!dapp.name);
    dispatch.myLists.setMyList({
      name: Lists.MyOldListing,
      elements: listing,
    });

    // TODO: wouldn't "unshift" be faster?
    const reversedListing = listing.reverse();

    const addingListing: MyListElement[] = Object.values(localListing).filter(
      ({ type }) => type === DappletsListItemTypes.Adding,
    );
    addingListing.forEach((dapp) => {
      reversedListing.push(dapp);
    });
    dispatch.myLists.setMyList({
      name: Lists.MyListing,
      elements: reversedListing.reverse(),
    });
    // TODO: wouldn't "unshift" be faster?
  },
  async getMyDapplets() {
    const dapps = await window.dapplets.getMyDapplets();
    dispatch.myLists.setMyList({
      name: Lists.MyDapplets,
      elements: dapps.map(({ name }: { name: string }) => ({
        name,
        type: DappletsListItemTypes.Default,
      })),
    });
  },
  async addMyDapplet({
    registryUrl,
    moduleName,
  }: {
    registryUrl: string;
    moduleName: string;
  }) {
    await window.dapplets.addMyDapplet("registry.dapplet-base.eth", moduleName);
  },
  async removeMyDapplet({
    registryUrl,
    moduleName,
  }: {
    registryUrl: string;
    moduleName: string;
  }) {
    await window.dapplets.removeMyDapplet(
      "registry.dapplet-base.eth",
      moduleName,
    );
  },
});

export const myLists = createModel()({
  name: "myLists",
  state: INITIAL_STATE,
  reducers,
  effects,
});
