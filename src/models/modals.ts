import { createModel } from "@rematch/core";

export interface Modals {
  isLoginOpen?: boolean
  isUserOpen?: boolean
}

type ModalsState = Readonly<Modals>
const INITIAL_STATE: ModalsState = {
  isLoginOpen: false,
  isUserOpen: false,
};

const reducers = {
  setModalOpen(state: ModalsState, payload: ModalsState) {
    return {
      ...state,
      ...payload,
    }
  }
}

const effects = (dispatch: any) => ({
})

export const modals = createModel()({
  name: 'modals',
  state: INITIAL_STATE,
  reducers,
  effects,
});
