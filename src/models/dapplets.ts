import { createModel } from "@rematch/core";
import { BigNumber, ethers } from 'ethers';
import types from '../types.json';
import abi from '../abi.json';

const id = 'dd596d06e4284273a30004fd22e2af80';
const net = 'goerli';

const PROVIDER_URL = `https://${net}.infura.io/v3/${id}`;

export interface IDapplet {
  description: string
  icon: {
    hash: string
    uris: string[]
  }
  interfaces: any[]
  name: string
  owner: string
  title: string
  version: any
  versionToShow: string
  timestamp: any
  timestampToShow: string
}

interface DappletsList {
  [name: string]: IDapplet
}

type DappletsState = Readonly<DappletsList>
const INITIAL_STATE: DappletsState = {};

const reducers = {
  setDapplets(_: DappletsState, payload: DappletsList) {
    return payload
  },
  addDapplet(state: DappletsState, payload: IDapplet) {
    return {
      ...state,
      [payload.name]: payload,
    }
  },
}

const effects = (dispatch: any) => ({
  getDapplets: async (): Promise<void> => {
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 0x05);
    const contract: any = new ethers.Contract('0x55627158187582228031eD8DF9893d76318D084E', abi, provider);
    const events = await contract.queryFilter('ModuleInfoAdded');


    async function getVersions(name: string) {
      const hex: string = await contract.getVersionNumbers(name, 'default');
        const result = (hex.replace('0x', '')
          .match(/.{1,8}/g) ?? [])
          .map(x => `${parseInt('0x' + x[0] + x[1])}.${parseInt('0x' + x[2] + x[3])}.${parseInt('0x' + x[4] + x[5])}`);
          return result;
    }

    for (let i = 1; i <= events.length; i++) {
      contract.modules(i).then(async (module: any) => {
        if (module.moduleType !== 1) return;
        const ev = events[i - 1];
        const block = await ev.getBlock();
        const versions = await getVersions(module.name);
        const dapplet = {
          description: module.description,
          icon: module.icon,
          name: module.name,
          owner: module.owner,
          title: module.title,
          versionToShow: versions[versions.length - 1],
          version: versions,
          timestampToShow: new Date(block.timestamp * 1000).toString(),
          timestamp: block.timestamp,
        }
        dispatch.dapplets.addDapplet(dapplet)
      })
    }
  },
})

export const dapplets = createModel()({
  name: 'dapplets',
  state: INITIAL_STATE,
  reducers,
  effects,
});
