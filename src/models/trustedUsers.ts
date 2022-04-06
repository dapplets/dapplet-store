import { createModel } from "@rematch/core";

export interface TrustedUsers {
  trustedUsers: string[];
}

type TrustedUsersState = Readonly<TrustedUsers>;
const INITIAL_STATE: TrustedUsersState = {
  trustedUsers: [],
};

const reducers = {
  setTrustedUsers(_: TrustedUsersState, payload: string[]) {
    // window.localStorage.setItem('trustedUsers', JSON.stringify(payload));
    return {
      trustedUsers: payload,
    };
  },
};

const effects = (dispatch: any) => ({
  async getTrustedUsers() {
    // const trustedUsers = window.localStorage.getItem('trustedUsers');
    // if (trustedUsers) dispatch.trustedUsers.setTrustedUsers(JSON.parse(trustedUsers))
    try {
      const trustedUsers = await window.dapplets.getTrustedUsers();
      if (trustedUsers)
        dispatch.trustedUsers.setTrustedUsers(
          trustedUsers.map(({ account }: { account: string }) => account),
        );
    } catch (error) {
      console.error({ error });
    }
  },
  addTrustedUser(payload: string) {
    try {
      window.dapplets.addTrustedUser(payload);
    } catch (error) {
      console.error({ error });
    }
  },
  removeTrustedUser(payload: string) {
    try {
      window.dapplets.removeTrustedUser(payload);
    } catch (error) {
      console.error({ error });
    }
  },
});

export const trustedUsers = createModel()({
  name: "trustedUsers",
  state: INITIAL_STATE,
  reducers,
  effects,
});
