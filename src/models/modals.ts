import { createModel } from "@rematch/core";

export enum ModalsList {
  Login = "login",
  Install="install",
  User = "user",
  Warning = "warning",
}

export interface Modals {
  openedModal: ModalsList | null
}

type ModalsState = Readonly<Modals>
const INITIAL_STATE: ModalsState = {
  openedModal: null,
};

const reducers = {
  setModalOpen(_: ModalsState, payload: ModalsList | null) {
    return {
      openedModal: payload,
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
