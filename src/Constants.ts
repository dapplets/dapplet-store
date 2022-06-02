const DAPPLET_BUTTON_TEXT = {
  local: {
    add: {
      initial: "Add to local list",
      hover: "Add to local list",
    },
    adding: {
      initial: "Add to local list",
      hover: "Cancel",
    },
    removing: {
      initial: "Removing from local list",
      hover: "Cancel",
    },
    presented: {
      initial: "In local list",
      hover: "Remove from local list",
    },
    remove: {
      initial: "Remove from local list",
      hover: "Remove from local list",
    },
  },
  public: {
    add: {
      initial: "Add to public list",
      hover: "Add to public list",
    },
    adding: {
      initial: "Adding to public list",
      hover: "Cancel",
    },
    removing: {
      initial: "Removing from public list",
      hover: "Cancel",
    },
    presented: {
      initial: "In public list",
      hover: "Remove from public list",
    },
    remove: {
      initial: "Remove from public list",
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
