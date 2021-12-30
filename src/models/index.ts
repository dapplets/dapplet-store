// import { Models } from "@rematch/core";
// import { count } from "./count";
// export interface RootModel extends Models<RootModel> {
//   count: typeof count;
// }
// export const models: RootModel = { count };

import { init, RematchRootState } from '@rematch/core';
import { dapplets } from "./dapplets";

const models = {
  dapplets,
};

const store = init({
  models,
});

export default store;

export type RootState = RematchRootState<typeof models>;
export type RootDispatch = typeof store.dispatch;
export type Store = typeof store;