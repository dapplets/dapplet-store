import { createModel } from "@rematch/core";

export interface User {
  address?: string;
  provider?: any;
  isLocked?: boolean;
}

type UserState = Readonly<User>;
const INITIAL_STATE: UserState = {
  address: "",
  isLocked: false,
};

const reducers = {
  setUser(state: UserState, payload: UserState) {
    return {
      ...state,
      ...payload,
    };
  },
};

const effects = (dispatch: any) => ({});

export const user = createModel()({
  name: "user",
  state: INITIAL_STATE,
  reducers,
  effects,
});
