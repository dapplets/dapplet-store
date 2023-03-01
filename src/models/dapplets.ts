import { createModel } from '@rematch/core'
import { ethers } from 'ethers'
import dappletsRegistryABI from '../dappletsRegistryABI.json'
import { customPromiseToast } from '../components/Notification'
import { ModalsList } from './modals'
import { Lists } from './myLists'
import {
  DAPPLET_REGISTRY_ADDRESS,
  MAX_MODULES_COUNTER,
  MODULE_TYPES,
  REGISTRY_BRANCHES,
} from '../constants'
import getIconUrl from '../api/getIconUrl'
import parseRawDappletVersion from '../lib/parseRawDappletVersion'
import dappletRegistry from '../api/dappletRegistry'

export enum EventType {
  REMOVE,
  ADD,
  REPLACE,
}

export interface EventPushing {
  eventType: EventType
  dappletId: number
  dappletPrevId?: number
}

export interface EventOrderChange {
  dappletId: number
  dappletPrevId: number
}

export interface IRawDapplet {
  description: string
  flags: any // {_hex: '0x00', _isBigNumber: true}
  fullDescription: { hash: string; uris: any[] }
  icon: { hash: string; uris: any[] }
  interfaces: []
  moduleType: 3
  name: string
  title: string
}

export interface IDapplet {
  id: number
  description: string
  icon: string
  interfaces: any[]
  name: string
  owner: string
  title: string
  version: any
  versionToShow: any
  timestamp: any
  timestampToShow: string
  listers: string[]
  isExpanded: boolean
}

interface DappletsList {
  [name: string]: IDapplet
}

type DappletsState = Readonly<DappletsList>
const INITIAL_STATE: DappletsState = {}

export type LinkedListDiff = { prev: string; next: string }

const reducers = {
  setDapplets(_: DappletsState, payload: DappletsList) {
    return payload
  },
  addDapplet(state: DappletsState, payload: IDapplet) {
    return {
      ...state,
      [payload.id]: payload,
    }
  },
  addListerToDapplet(state: DappletsState, { id, address }: { id: number; address: string }) {
    const dapIndex = Object.values(state).findIndex((dapp) => dapp.id === id)
    return {
      ...state,
      [dapIndex]: {
        ...state[dapIndex],
        listers: [...state[dapIndex].listers, address],
      },
    }
  },
  removeListerFromDapplet(state: DappletsState, { id, address }: { id: number; address: string }) {
    return {
      ...state,
      [id]: {
        ...state[id],
        trustedUsers: state[id].listers.filter((nowAddress) => nowAddress !== address),
      },
    }
  },
  setExpanded(state: DappletsState, { id, isExpanded }: { id: number; isExpanded: boolean }) {
    const dapp = Object.values(state).find((dapp: IDapplet) => dapp.id === id)
    const index = Object.values(state).findIndex((dapp: IDapplet) => dapp.id === id)

    if (!dapp) return state

    return {
      ...state,
      [index]: {
        ...state[index],
        isExpanded,
      },
    }
  },
  setBlobUrl(state: DappletsState, { id, blobUrl }: { id: number; blobUrl: string }) {
    return {
      ...state,
      [id]: {
        ...state[id],
        icon: blobUrl,
      },
    }
  },
}

const effects = (dispatch: any) => ({
  getDapplets: async (): Promise<void> => {
    const offset = 0
    const limit = MAX_MODULES_COUNTER
    const data = await dappletRegistry.getModules(REGISTRY_BRANCHES.DEFAULT, offset, limit, false)

    const rawDapplets = data.modules.filter(
      (module: IRawDapplet) => module.moduleType === MODULE_TYPES.DAPPLET
    )

    const dapplets: IDapplet[] = rawDapplets.flatMap((module: IRawDapplet, i: number) => {
      const icon = {
        hash: module.icon.hash,
        uris: module.icon.uris,
      }

      const timeStamp = new Date(Number.parseInt(data.lastVersions[i].createdAt._hex, 16) * 1000)

      if (module.moduleType === MODULE_TYPES.DAPPLET) {
        return {
          id: i + 1,
          description: module.description,
          icon: icon,
          name: module.name,
          owner: data.owners[i],
          title: module.title,
          versionToShow: parseRawDappletVersion(data.lastVersions[i].version),
          version: parseRawDappletVersion(data.lastVersions[i].version),
          /* TODO: timestamp to be implemented */
          timestampToShow: 'no info',
          timestamp: 'no info',
          listers: [],
          isExpanded: false,
          interfaces: [],
        }
      } else {
        return []
      }
    })

    await dispatch.dapplets.setDapplets(dapplets)

    rawDapplets.forEach(async (dapplet: IRawDapplet, i: number) => {
      const icon = {
        hash: dapplet.icon.hash,
        uris: dapplet.icon.uris,
      }

      const url = await getIconUrl(icon)
      dispatch.dapplets.setBlobUrl({ id: i, blobUrl: url })
    })

    dapplets.forEach(async (dapp: any) => {
      const dappListers = await dappletRegistry.getListersByModule(dapp.name, offset, limit)

      dappListers.forEach((lister: any) => {
        dispatch.dapplets.addListerToDapplet({
          id: dapp.id,
          address: lister,
        })
      })
    })
  },

  pushMyListing: async ({
    address,
    provider,
    dappletsNames,
    links,
  }: {
    address: string
    provider: any
    dappletsNames: { [name: number]: string }
    links: LinkedListDiff[]
  }) => {
    dispatch.user.setUser({
      isLocked: true,
    })
    if (provider.chainId !== '0x5') {
      dispatch.modals.setModalOpen({
        openedModal: ModalsList.Warning,
        settings: {
          onRetry: async () => {
            try {
              dispatch.modals.setModalOpen({
                openedModal: null,
                settings: null,
              })
              await dispatch.dapplets.pushMyListing({
                address,
                provider,
                dappletsNames,
                links,
              })
            } catch (error) {
              console.error(error)
            }
          },
        },
      })
      throw new Error('Change network to Goerli')
    }
    const ethersProvider = new ethers.providers.Web3Provider(provider)
    const signer = await ethersProvider.getSigner()

    const contractListing: any = await new ethers.Contract(
      DAPPLET_REGISTRY_ADDRESS,
      dappletsRegistryABI,
      signer
    )

    const req = await contractListing.changeMyListing(links)

    try {
      const transaction = req.wait()
      await customPromiseToast(transaction, req.hash)
      await window.localStorage.setItem(Lists.MyListing, JSON.stringify([]))
      await dispatch.myLists.getMyListing({ address, provider, dappletsNames })
    } catch (error) {
      console.error({ error })
    }
    dispatch.user.setUser({
      isLocked: false,
    })
  },
})

export const dapplets = createModel()({
  name: 'dapplets',
  state: INITIAL_STATE,
  reducers,
  effects,
})
