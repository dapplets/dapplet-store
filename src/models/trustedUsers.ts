import { createModel } from "@rematch/core";
import dappletRegistry from "../api/dappletRegistry";

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
      const nearNamingPatterns = [".testnet", ".near", "dev-"];
      const trustedUsers = await window.dapplets.getTrustedUsers();

      const ethOnlyTrustedUsers = trustedUsers
        .map(({ account }: { account: string }) => account)
        .filter((account: string) => {
          const isNearPattern = nearNamingPatterns.some((pattern) =>
            account.includes(pattern),
          );
          return !isNearPattern;
        });

      for (const user of ethOnlyTrustedUsers) {
        if (!user.startsWith("0x")) {
          const hex = await dappletRegistry.provider.resolveName(user);
          const hexIndex = ethOnlyTrustedUsers.findIndex(
            (user: any) => user === hex,
          );
          if (hexIndex !== -1) {
            ethOnlyTrustedUsers.splice(hexIndex, 1);
          }
        }
      }

      if (trustedUsers)
        dispatch.trustedUsers.setTrustedUsers(ethOnlyTrustedUsers);
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
