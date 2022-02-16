import { createModel } from "@rematch/core";
import { getEnsNamesApi } from "../api/ensName/ensName";

interface EnsNamesList {
  [name: string]: string
}

type DappletsState = Readonly<EnsNamesList>
const INITIAL_STATE: DappletsState = {};

interface EnsNameRequest {
  address: string
  ensName: string
}

const reducers = {
  setDapplets(_: DappletsState, payload: EnsNamesList) {
    return payload
  },
  addEnsNames(state: DappletsState, payload: EnsNameRequest) {
    return {
      ...state,
      [payload.address]: payload.ensName,
    }
  },
}

const effects = (dispatch: any) => ({
  getEnsNames: async (addresses: string[]): Promise<void> => {
    // console.log('STARTIT')
    const ensNames = await getEnsNamesApi(addresses)
    // console.log({ensNames})
    ensNames?.forEach((ensName, index) => {
      dispatch.ensNames.addEnsNames({
        ensName: ensName || 'User Listing',
        address: addresses[index],
      })
    });
  },
})

export const ensNames = createModel()({
  name: 'ensNames',
  state: INITIAL_STATE,
  reducers,
  effects,
});
