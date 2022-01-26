import { createModel } from "@rematch/core";
import { ethers } from 'ethers';
import abi from '../abi.json';
import abiListing from './abi';
import Parse from "parse";
import { PROVIDER_URL } from "../api/consts";

export enum EventType { REMOVE, ADD }

export interface EventPushing {
  eventType: EventType,
  dappletId: number,
}

export interface IDapplet {
  id: number,
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
  isExpanded: boolean
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
    console.log({payload})
    return {
      ...state,
      [payload.id]: payload,
    }
  },
  addTrustedUserToDapplet(state: DappletsState, {id, address}: {id: number, address: string}) {
    return {
      ...state,
      [id]: {
        ...state[id],
        trustedUsers: [
          ...state[id].trustedUsers,
          address,
        ],
      },
    }
  },
  removeTrustedUserFromDapplet(state: DappletsState, {id, address}: {id: number, address: string}) {
    return {
      ...state,
      [id]: {
        ...state[id],
        trustedUsers: state[id].trustedUsers.filter((nowAddress) => (
          nowAddress !== address
        )),
      },
    }
  },
  setExpanded(state: DappletsState, {id, isExpanded}: {id: number, isExpanded: boolean}) {
    return {
      ...state,
      [id]: {
        ...state[id],
        isExpanded,
      }
    }
  },
}

const effects = (dispatch: any) => ({ //
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
        console.log({module, ev})
        const dapplet = {
          id:i,
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
          isExpanded: false,
        }
        await dispatch.dapplets.addDapplet(dapplet)
      })
      )
    }
    await Promise.all(myPromises)

    
    const contractListing: any = new ethers.Contract('0x3470ab240a774e4D461456D51639F033c0cB5363', abiListing, provider);
    const users = await contractListing.getUsers();
    console.log({users})
    for (let i = 0; i < users.length; i++) {
      const trustedDapplets = await contractListing.getUserList(users[i]);
      console.log({trustedDapplets})
      
      for (let j = 0; j < trustedDapplets.length; j++) {
        try {
          dispatch.dapplets.addTrustedUserToDapplet({id: trustedDapplets[j], address: users[i]});
        } catch (error) {
          console.error(error)
        }
      }
    }

    
    // Parse.serverURL = 'https://parseapi.back4app.com';
    // Parse.initialize(
    //   'WyqwCiBmXDHB7kDdTP3NgjtdAupCRxbdm72VQ6xS',
    //   '3LpyQhNB0KRTOaBAUHR5z6k5L3KAhR0o140A4vHV',
    // );
    // const query = new Parse.Query('dapplets');
    // const results = await query.find();
    // try {
    //   for (const object of results) {
    //     const name = object.get('name');
    //     const address = object.get('address');
    //     // dispatch.dapplets.addTrustedUserToDapplet({name, address});
    //   }
    // } catch (error) {
    //   console.error('Error while fetching MyCustomClassName', error);
    // }
  },
  pushMyListing: async ({events, provider}: {events: EventPushing[], provider: any}) => {
    const ethersProvider= new ethers.providers.Web3Provider(provider);
    const signer = await ethersProvider.getSigner();
    console.log({events})
    // const contractProvider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 0x05);
    const contractListing: any = await new ethers.Contract('0x3470ab240a774e4D461456D51639F033c0cB5363', abiListing, signer);
    await contractListing.changeMyList(events.map(({eventType, dappletId}) => ([eventType, dappletId])))
    // await contractListing.changeMyList([[1, 23]])
    console.log('EVENT')
    // dispatch.dapplets.addTrustedUserToDapplet({name, address});
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
    // dispatch.dapplets.addTrustedUserToDapplet({name, address});
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
          // dispatch.dapplets.removeTrustedUserFromDapplet({name, address});
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
