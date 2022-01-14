import { createModel } from "@rematch/core";

export interface User {
  address?: string
}

type UserState = Readonly<User>
const INITIAL_STATE: UserState = {
  address: "",
};

const reducers = {
  setUser (state: UserState, payload: UserState) {
    return payload
  }
}

const effects = (dispatch: any) => ({
})

export const user = createModel()({
  name: 'user',
  state: INITIAL_STATE,
  reducers,
  effects,
});
