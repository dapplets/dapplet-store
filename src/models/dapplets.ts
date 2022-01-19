import { createModel } from "@rematch/core";
import { ethers } from 'ethers';
import abi from '../abi.json';
import Parse from "parse";

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
  trustedUsers: string[]
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
  addTrustedUserToDapplet(state: DappletsState, {name, address}: {name: string, address: string}) {
    return {
      ...state,
      [name]: {
        ...state[name],
        trustedUsers: [
          ...state[name].trustedUsers,
          address,
        ],
      },
    }
  },
  removeTrustedUserFromDapplet(state: DappletsState, {name, address}: {name: string, address: string}) {
    return {
      ...state,
      [name]: {
        ...state[name],
        trustedUsers: state[name].trustedUsers.filter((nowAddress) => (
          nowAddress !== address
        )),
      },
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

    const myPromises = []
    for (let i = 1; i <= events.length; i++) {
      myPromises.push(contract.modules(i).then(async (module: any) => {
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
          trustedUsers: [module.owner],
        }
        await dispatch.dapplets.addDapplet(dapplet)
      })
      )
    }
    await Promise.all(myPromises)
    
    Parse.serverURL = 'https://parseapi.back4app.com';
    Parse.initialize(
      'WyqwCiBmXDHB7kDdTP3NgjtdAupCRxbdm72VQ6xS',
      '3LpyQhNB0KRTOaBAUHR5z6k5L3KAhR0o140A4vHV',
    );
    const query = new Parse.Query('dapplets');
    const results = await query.find();
    try {
      for (const object of results) {
        const name = object.get('name');
        const address = object.get('address');
        dispatch.dapplets.addTrustedUserToDapplet({name, address});
        console.log({name, address})
      }
    } catch (error) {
      console.error('Error while fetching MyCustomClassName', error);
    }
  },
  addTrustedUserToDappletEffect: async ({name, address}: {name: string, address: string}) => {
    Parse.serverURL = 'https://parseapi.back4app.com';
    Parse.initialize(
      'WyqwCiBmXDHB7kDdTP3NgjtdAupCRxbdm72VQ6xS',
      '3LpyQhNB0KRTOaBAUHR5z6k5L3KAhR0o140A4vHV',
    );
    const Dapplet = Parse.Object.extend("dapplets");
    const dapplet = new Dapplet();
    dapplet.set("name", name);
    dapplet.set("address", address);
    await dapplet.save();
    dispatch.dapplets.addTrustedUserToDapplet({name, address});
  },
  removeTrustedUserFromDappletEffect: async ({name, address}: {name: string, address: string}) => {
    Parse.serverURL = 'https://parseapi.back4app.com';
    Parse.initialize(
      'WyqwCiBmXDHB7kDdTP3NgjtdAupCRxbdm72VQ6xS',
      '3LpyQhNB0KRTOaBAUHR5z6k5L3KAhR0o140A4vHV',
    );
    const query = new Parse.Query('dapplets');
    const results = await query.find();
    
    try {
      for (const object of results) {
        const myName = object.get('name');
        const myAddress = object.get('address');
        if (myName === name && myAddress === address)
          await object.destroy();
          dispatch.dapplets.removeTrustedUserFromDapplet({name, address});
      }
    } catch (error) {
      console.error('Error while fetching MyCustomClassName', error);
    }
  },
})

export const dapplets = createModel()({
  name: 'dapplets',
  state: INITIAL_STATE,
  reducers,
  effects,
});
