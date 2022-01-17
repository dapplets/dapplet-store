import { createModel } from "@rematch/core";
import { BigNumber, ethers } from 'ethers';
import types from '../types.json';
import abi from '../abi.json';

const PROVIDER_URL = 'https://goerli.infura.io/v3/dd596d06e4284273a30004fd22e2af80';

export interface IDapplet {
  description: string
  flags: BigNumber
  icon: {
    hash: string
    uris: string[]
  }
  interfaces: any[]
  moduleType: 1
  name: string
  owner: string
  title: string
  version: any
  versionToShow: string
  timestamp: any
  timestampToShow: string
}

type DappletsState = Readonly<IDapplet[]>
const INITIAL_STATE: DappletsState = [];

const reducers = {
  setDapplets(_: DappletsState, payload: IDapplet[]) {
    return payload
  }
}

const effects = (dispatch: any) => ({
  getDapplets: async (): Promise<void> => {
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 0x05);
    const contract: any = new ethers.Contract('0x55627158187582228031eD8DF9893d76318D084E', abi, provider);
    contract.queryFilter('ModuleInfoAdded').then((e: any) => {
      console.log(e)
    })
    contract.queryFilter('ModuleInfoAdded').then(async (events: any) => {
      const versions: any = {};
      const timestamps: any = {};
      const allModules: any[] = await Promise.all(events.map(async (ev: any) => {
        console.log({ev})
        const tx: any = await provider.getTransaction(ev.transactionHash);
        const t: any = types;
        const decoded = ethers.utils.defaultAbiCoder.decode(t, ethers.utils.hexDataSlice(tx.data, 4));
        const module = await contract.getModuleInfoByName(decoded.mInfo.name);

        const hex: string = await contract.getVersionNumbers(module.name, 'default');
        const result = (hex.replace('0x', '')
          .match(/.{1,8}/g) ?? [])
          .map(x => `${parseInt('0x' + x[0] + x[1])}.${parseInt('0x' + x[2] + x[3])}.${parseInt('0x' + x[4] + x[5])}`);
        versions[module.name] = result;

        const block = await ev.getBlock();
        timestamps[module.name] = block.timestamp;

        console.log({module})
        return module;
      }));

      const allDapplets = allModules.filter((module: any) => module.moduleType === 1).map((dapp) => ({
        ...dapp,
        versionToShow: versions[dapp.name][versions[dapp.name].length - 1],
        version: versions[dapp.name],
        timestampToShow: new Date(timestamps[dapp.name] * 1000).toString(),
        timestamp: timestamps[dapp.name],
      }));

      dispatch.dapplets.setDapplets(allDapplets);
    });
  },
})

export const dapplets = createModel()({
  name: 'dapplets',
  state: INITIAL_STATE,
  reducers,
  effects,
});
