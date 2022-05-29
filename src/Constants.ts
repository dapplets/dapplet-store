const DAPPLET_BUTTON_TEXT = {
  local: {
    add: {
      base: "Add to local list",
      hover: "Add to local list",
    },
    adding: {
      base: "Add to local list",
      hover: "Cancel",
    },
    removing: {
      base: "Removing from local list",
      hover: "Cancel",
    },
    presented: {
      base: "In local list",
      hover: "Remove from local list",
    },
    remove: {
      base: "Remove from local list",
      hover: "Remove from local list",
    },
  },
  public: {
    add: {
      base: "Add to public list",
      hover: "Add to public list",
    },
    adding: {
      base: "Adding to public list",
      hover: "Cancel",
    },
    removing: {
      base: "Removing from public list",
      hover: "Cancel",
    },
    presented: {
      base: "In public list",
      hover: "Remove from public list",
    },
    remove: {
      base: "Remove from public list",
      hover: "Remove from public list",
    },
  },
};

const DAPPLET_LISTING_STAGES = {
  ADD: "add",
  PENIDNG_ADD: "adding",
  PENDING_REMOVE: "removing",
  PRESENTED: "presented",
} as const;

const DAPPLET_LISTINGS_NAMES = {
  LOCAL: "local",
  PUBLIC: "public",
} as const;

export { DAPPLET_BUTTON_TEXT, DAPPLET_LISTING_STAGES, DAPPLET_LISTINGS_NAMES };
