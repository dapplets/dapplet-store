import { createModel } from "@rematch/core";
import { BigNumber, ethers } from 'ethers';
import types from '../types.json';
import abi from '../abi.json';

const PROVIDER_URL = 'https://rinkeby.infura.io/v3/eda881d858ae4a25b2dfbbd0b4629992';

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
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 4);
    const contract: any = new ethers.Contract('0xb76b02b35ad7cb71e2061056915e521e8f05c130', abi, provider);
    contract.queryFilter('ModuleInfoAdded').then(async (events: any) => {
      const versions: any = {};
      const timestamps: any = {};
      const allModules: any[] = await Promise.all(events.map(async (ev: any) => {
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
