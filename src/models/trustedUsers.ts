import { createModel } from "@rematch/core";

export interface TrustedUsers {
  trustedUsers: string[]
}

type TrustedUsersState = Readonly<TrustedUsers>
const INITIAL_STATE: TrustedUsersState = {
  trustedUsers: [],
};

const reducers = {
  setTrustedUsers(_: TrustedUsersState, payload: string[]) {
    window.localStorage.setItem('trustedUsers', JSON.stringify(payload));
    return {
      trustedUsers: payload,
    }
  },
}

const effects = (dispatch: any) => ({
  getTrustedUsers() {
    const trustedUsers = window.localStorage.getItem('trustedUsers');
    if (trustedUsers) dispatch.trustedUsers.setTrustedUsers(JSON.parse(trustedUsers))
  }
})

export const trustedUsers = createModel()({
  name: 'trustedUsers',
  state: INITIAL_STATE,
  reducers,
  effects,
});
