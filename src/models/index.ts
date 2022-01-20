import { init, RematchRootState } from '@rematch/core';
import { dapplets } from "./dapplets";
import { modals } from './modals';
import { sort } from './sort';
import { trustedUsers } from './trustedUsers';
import { user } from './user';

const models = {
  dapplets,
  sort,
  modals,
  user,
  trustedUsers,
};

const store = init({
  models,
});

export default store;

export type RootState = RematchRootState<typeof models>;
export type RootDispatch = typeof store.dispatch;
export type Store = typeof store;