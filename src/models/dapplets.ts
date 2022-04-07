import { createModel } from "@rematch/core";
import { ethers } from "ethers";
import abi from "../abi.json";
// import abiListing from './abi';
import abiListing2 from "./abi2";
import { PROVIDER_URL } from "../api/consts";
import { customPromiseToast } from "../components/Notification";
import { ModalsList } from "./modals";
import { Lists } from "./myLists";

const BZZ_ENDPOINT = "https://swarmgateway.mooo.com";
const IPFS_ENDPOINT = "https://ipfs.kaleido.art";
const SIA_ENDPOINT = "https://siasky.net";
const S3_ENDPOINT = "https://dapplet-api.s3.nl-ams.scw.cloud";

type StorageRef = {
  hash: string;
  uris: string[];
};

const _fetchAndCheckHash = async (
  url: string,
  controller: AbortController,
  expectedHash?: string,
) => {
  const response = await fetch(url, { signal: controller.signal });
  if (!response.ok) throw new Error("Cannot fetch " + url);

  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const recievedHash = ethers.utils.keccak256(new Uint8Array(buffer));

  if (expectedHash && expectedHash !== recievedHash) {
    throw new Error("Hash mismatch " + url);
  }

  return blob;
};
const _getResource = async (storageRef: StorageRef) => {
  const promises: Promise<Blob>[] = [];
  const controller = new AbortController();

  for (const uri of storageRef.uris) {
    const protocol = uri.substring(0, uri.indexOf("://"));
    const reference = uri.substring(uri.indexOf("://") + 3);

    if (protocol === "bzz") {
      promises.push(
        _fetchAndCheckHash(
          BZZ_ENDPOINT + "/bzz/" + reference,
          controller,
          storageRef.hash,
        ),
      );
    } else if (protocol === "ipfs") {
      promises.push(
        _fetchAndCheckHash(
          IPFS_ENDPOINT + "/ipfs/" + reference,
          controller,
          storageRef.hash,
        ),
      );
    } else if (protocol === "sia") {
      promises.push(
        _fetchAndCheckHash(
          SIA_ENDPOINT + "/" + reference,
          controller,
          storageRef.hash,
        ),
      );
    } else {
      console.warn("Unsupported protocol " + uri);
    }
  }

  if (storageRef.hash) {
    const hash = storageRef.hash.replace("0x", "");
    if (hash.match(/^0*$/) === null)
      promises.push(
        _fetchAndCheckHash(
          S3_ENDPOINT + "/" + hash,
          controller,
          storageRef.hash,
        ),
      );
  }

  const blob = await Promise.any(promises);
  const blobUrl = URL.createObjectURL(blob);

  // cancel all request
  controller.abort();

  return blobUrl;
};

export enum EventType {
  REMOVE,
  ADD,
  REPLACE,
}

export interface EventPushing {
  eventType: EventType;
  dappletId: number;
  dappletPrevId?: number;
}

export interface EventOrderChange {
  dappletId: number;
  dappletPrevId: number;
}

export interface IDapplet {
  id: number;
  description: string;
  icon: string;
  interfaces: any[];
  name: string;
  owner: string;
  title: string;
  version: any;
  versionToShow: string;
  timestamp: any;
  timestampToShow: string;
  trustedUsers: string[];
  isExpanded: boolean;
}

interface DappletsList {
  [name: string]: IDapplet;
}

type DappletsState = Readonly<DappletsList>;
const INITIAL_STATE: DappletsState = {};

const reducers = {
  setDapplets(_: DappletsState, payload: DappletsList) {
    return payload;
  },
  addDapplet(state: DappletsState, payload: IDapplet) {
    return {
      ...state,
      [payload.id]: payload,
    };
  },
  addTrustedUserToDapplet(
    state: DappletsState,
    { id, address }: { id: number; address: string },
  ) {
    return {
      ...state,
      [id]: {
        ...state[id],
        trustedUsers: [...state[id].trustedUsers, address],
      },
    };
  },
  removeTrustedUserFromDapplet(
    state: DappletsState,
    { id, address }: { id: number; address: string },
  ) {
    return {
      ...state,
      [id]: {
        ...state[id],
        trustedUsers: state[id].trustedUsers.filter(
          (nowAddress) => nowAddress !== address,
        ),
      },
    };
  },
  setExpanded(
    state: DappletsState,
    { id, isExpanded }: { id: number; isExpanded: boolean },
  ) {
    return {
      ...state,
      [id]: {
        ...state[id],
        isExpanded,
      },
    };
  },
  setBlobUrl(
    state: DappletsState,
    { id, blobUrl }: { id: number; blobUrl: string },
  ) {
    return {
      ...state,
      [id]: {
        ...state[id],
        icon: blobUrl,
      },
    };
  },
};

const effects = (dispatch: any) => ({
  //
  getDapplets: async (): Promise<void> => {
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 0x05);
    const contract: any = new ethers.Contract(
      "registry.dapplet-base.eth",
      abi,
      provider,
    );
    const events = await contract.queryFilter("ModuleInfoAdded");

    async function getVersions(name: string) {
      const hex: string = await contract.getVersionNumbers(name, "default");
      const result = (hex.replace("0x", "").match(/.{1,8}/g) ?? []).map(
        (x) =>
          `${parseInt("0x" + x[0] + x[1])}.${parseInt(
            "0x" + x[2] + x[3],
          )}.${parseInt("0x" + x[4] + x[5])}`,
      );
      return result;
    }
    const dapplets: DappletsList = {};
    const myPromises = [];
    for (let i = 1; i <= events.length; i++) {
      myPromises.push(
        contract.modules(i).then(async (module: any) => {
          if (module.moduleType !== 1) return;
          const ev = events[i - 1];
          const block = await ev.getBlock();
          const versions = await getVersions(module.name);
          const date = new Date(block.timestamp * 1000);
          const pad = (n: number, s = 2) =>
            `${new Array(s).fill(0)}${n}`.slice(-s);
          const icon = {
            hash: module.icon.hash,
            uris: module.icon.uris.map((u: any) =>
              ethers.utils.toUtf8String(u),
            ),
          };
          // const url: string = await _getResource(icon)
          const dapplet: IDapplet = {
            id: i,
            description: module.description,
            icon: "",
            name: module.name,
            owner: module.owner,
            title: module.title,
            versionToShow: versions[versions.length - 1],
            version: versions,
            timestampToShow: `${pad(date.getDay())}.${pad(
              date.getMonth() + 1,
            )}.${pad(date.getFullYear(), 4)}`,
            timestamp: block.timestamp,
            trustedUsers: [module.owner],
            isExpanded: false,
            interfaces: [],
          };
          await dispatch.dapplets.addDapplet(dapplet);
          _getResource(icon).then((url) => {
            dispatch.dapplets.setBlobUrl({ id: i, blobUrl: url });
          });
          dapplets[`${dapplet.id}`] = dapplet;
        }),
      );
    }
    await Promise.all(myPromises);
    const contractListing: any = new ethers.Contract(
      "0x626Ef3D84A9b0a0b79d4CF0ee353e6F6e0F51426",
      abiListing2,
      provider,
    );
    const users = await contractListing.getListers();
    for (let i = 0; i < users.length; i++) {
      const trustedDapplets = await contractListing.getLinkedList(users[i]);

      for (let j = 0; j < trustedDapplets.length; j++) {
        try {
          dispatch.dapplets.addTrustedUserToDapplet({
            id: trustedDapplets[j],
            address: users[i],
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  },
  pushMyListing: async ({
    address,
    events,
    provider,
    dappletsNames,
    links,
  }: {
    address: string;
    events: EventPushing[];
    provider: any;
    dappletsNames: { [name: number]: string };
    links: { currentDappletId: number; nextDappletId: number }[];
  }) => {
    if (provider.chainId !== "0x5") {
      dispatch.modals.setModalOpen({
        openedModal: ModalsList.Warning,
        settings: {
          onRetry: async () => {
            try {
              await dispatch.dapplets.pushMyListing({
                address,
                events,
                provider,
                dappletsNames,
                links,
              });
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
      "0x626Ef3D84A9b0a0b79d4CF0ee353e6F6e0F51426",
      abiListing2,
      signer,
    ); //0xc8B80C2509e7fc553929C86Eb54c41CC20Bb05fB //0x3470ab240a774e4D461456D51639F033c0cB5363
    const req = await contractListing.changeMyList(links);
    try {
      const transaction = req.wait();
      await customPromiseToast(transaction, req.hash);
      await window.localStorage.setItem(Lists.MyListing, JSON.stringify([]));
      await dispatch.myLists.getMyListing({ address, provider, dappletsNames });
    } catch (error) {
      console.error({ error });
    }
  },
});

export const dapplets = createModel()({
  name: "dapplets",
  state: INITIAL_STATE,
  reducers,
  effects,
});
