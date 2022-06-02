import { createModel } from "@rematch/core";

export enum ModalsList {
  Login = "login",
  Install = "install",
  User = "user",
  Warning = "warning",
  FirstLocalDapplet = "firstlocaldapplet",
  FirstPublicDapplet = "firstpublicdapplet",
  FirstTrustedUser = "firstTrustedUser",
}

export interface Modals {
  openedModal: ModalsList | null;
  settings: any;
}

type ModalsState = Readonly<Modals>;
const INITIAL_STATE: ModalsState = {
  openedModal: null,
  settings: null,
};

const reducers = {
  setModalOpen(
    _: ModalsState,
    {
      openedModal,
      settings = null,
    }: { openedModal: ModalsList | null; settings: any },
  ) {
    return {
      openedModal,
      settings,
    };
  },
};

const effects = (dispatch: any) => ({});

export const modals = createModel()({
  name: "modals",
  state: INITIAL_STATE,
  reducers,
  effects,
});
