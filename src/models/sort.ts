import { createModel } from "@rematch/core";
import { getAnchorParams, setAnchorParams } from "../lib/anchorLink";
import { Lists } from "./myLists";

export enum SortTypes {
  ABC = "Sort A-Z",
  ABCReverse = "Sort Z-A",
  Newest = "Sort by newest",
  Oldest = "Sort by oldest",
}

export interface Sort {
  sortType?: SortTypes;
  addressFilter?: string;
  searchQuery?: string;
  selectedList?: Lists;
  isTrustedSort?: boolean;
  trigger?: boolean;
}

type SortState = Readonly<Sort>;
export const INITIAL_STATE: SortState = {
  sortType: SortTypes.ABC,
  addressFilter: "",
  searchQuery: "",
  selectedList: undefined,
  isTrustedSort: false,
};

const reducers = {
  setSort(state: SortState, payload: Sort) {
    const newSort = {
      ...state,
      ...payload,
    };
    console.log("[setSort]:", { state, newSort });
    setAnchorParams(newSort);
    return newSort;
  },
};

const effects = (dispatch: any) => ({
  getSort: (address = "") => {
    const params = getAnchorParams(address);
    if (!params) return;
    dispatch.sort.setSort(params);
  },
});

export const sort = createModel()({
  name: "sort",
  state: INITIAL_STATE,
  reducers,
  effects,
});
