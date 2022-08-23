import { createModel } from "@rematch/core";
import { ethers } from "ethers";
import dappletsRegistryABI from "../dappletsRegistryABI.json";
// import abiListing from './abi';
import { PROVIDER_URL } from "../api/constants";
import { customPromiseToast } from "../components/Notification";
import { ModalsList } from "./modals";
import { Lists } from "./myLists";
import {
  DAPPLET_REGISTRY_ADDRESS,
  MODULE_TYPES,
  REGISTRY_BRANCHES,
} from "../constants";

const BZZ_ENDPOINT = "https://swarmgateway.mooo.com";
const IPFS_ENDPOINT = "https://ipfs.kaleido.art";
const SIA_ENDPOINT = "https://siasky.net";
const S3_ENDPOINT = "https://dapplet-api.s3.nl-ams.scw.cloud";

const MAX_MODULES_COUNTER = 99;

type StorageRef = {
  hash: string;
  uris: string[];
};

function formatVersion(hex: string) {
  const result = (hex.replace("0x", "").match(/.{1,8}/g) ?? []).map(
    (x) =>
      `${parseInt("0x" + x[0] + x[1])}.${parseInt(
        "0x" + x[2] + x[3],
      )}.${parseInt("0x" + x[4] + x[5])}`,
  );
  return result;
}

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

export interface IRawDapplet {
  description: string;
  flags: any; // {_hex: '0x00', _isBigNumber: true}
  fullDescription: { hash: string; uris: any[] };
  icon: { hash: string; uris: any[] };
  interfaces: [];
  moduleType: 3;
  name: string;
  title: string;
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
  getDapplets: async (payload: number, rootState: any): Promise<void> => {
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 0x05);

    const dappletsRegistry = new ethers.Contract(
      DAPPLET_REGISTRY_ADDRESS,
      dappletsRegistryABI,
      provider,
    );

    const data = await dappletsRegistry.getModules(0, MAX_MODULES_COUNTER);

    const rawDapplets = data.modules.filter(
      (module: IRawDapplet) => module.moduleType === MODULE_TYPES.DAPPLET,
    );

    const dapplets = rawDapplets.map((module: IRawDapplet, i: number) => {
      return {
        id: i + 1,
        description: module.description,
        icon: "",
        name: module.name,
        owner: data.owners[i],
        title: module.title,
        versionToShow: "unknown",
        version: "unknown",
        /* TODO: timestamp to be implemented */
        timestampToShow: "no info",
        timestamp: "no info",
        trustedUsers: [data.owners[i]],
        isExpanded: false,
        interfaces: [],
      };
    });

    const versionatedDapplets = await Promise.all(
      dapplets.map(async (dapplet: IDapplet) => {
        const version = await dappletsRegistry.getVersionNumbers(
          dapplet.name,
          REGISTRY_BRANCHES.DEFAULT,
        );

        const formattedVersions = formatVersion(version);

        return {
          ...dapplet,
          versionToShow: formattedVersions[formattedVersions.length - 1],
          version: formattedVersions,
        };
      }),
    );

    await dispatch.dapplets.setDapplets(versionatedDapplets);

    rawDapplets.forEach(async (dapplet: IRawDapplet, i: number) => {
      const icon = {
        hash: dapplet.icon.hash,
        uris: dapplet.icon.uris.map((u: any) => ethers.utils.toUtf8String(u)),
      };

      const url = await _getResource(icon);
      dispatch.dapplets.setBlobUrl({ id: i, blobUrl: url });
    });

    const listers = await dappletsRegistry.getListers();

    listers.forEach(async (lister: any, listerIndex: number) => {
      if (listers[listerIndex]) {
        const listersDapplets = await dappletsRegistry.getModulesOfListing(
          listers[listerIndex],
        );

        listersDapplets.forEach((dapplet: any, dappletIndex: number) => {
          if (listersDapplets[dappletIndex]) {
            const { id } = versionatedDapplets.find(
              (dapplet) => (dapplet.name = listersDapplets[dappletIndex]),
            );

            dispatch.dapplets.addTrustedUserToDapplet({
              id: id,
              address: listers[listerIndex],
            });
          }
        });
      }
    });
  },

  pushMyListing: async ({
    address,
    provider,
    dappletsNames,
    links,
  }: {
    address: string;
    provider: any;
    dappletsNames: { [name: number]: string };
    links: { prev: string; next: string }[];
  }) => {
    dispatch.user.setUser({
      isLocked: true,
    });
    if (provider.chainId !== "0x5") {
      dispatch.modals.setModalOpen({
        openedModal: ModalsList.Warning,
        settings: {
          onRetry: async () => {
            try {
              dispatch.modals.setModalOpen({
                openedModal: null,
                settings: null,
              });
              await dispatch.dapplets.pushMyListing({
                address,
                provider,
                dappletsNames,
                links,
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
      DAPPLET_REGISTRY_ADDRESS,
      dappletsRegistryABI,
      signer,
    );

    const req = await contractListing.changeMyListing(links);

    try {
      const transaction = req.wait();
      await customPromiseToast(transaction, req.hash);
      await window.localStorage.setItem(Lists.MyListing, JSON.stringify([]));
      await dispatch.myLists.getMyListing({ address, provider, dappletsNames });
    } catch (error) {
      console.error({ error });
    }
    dispatch.user.setUser({
      isLocked: false,
    });
  },
});

export const dapplets = createModel()({
  name: "dapplets",
  state: INITIAL_STATE,
  reducers,
  effects,
});
