import { init, RematchRootState } from '@rematch/core';
import { dapplets } from "./dapplets";
import { sort } from './sort';

const models = {
  dapplets,
  sort,
};

const store = init({
  models,
});

export default store;

export type RootState = RematchRootState<typeof models>;
export type RootDispatch = typeof store.dispatch;
export type Store = typeof store;