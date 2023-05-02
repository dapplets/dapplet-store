/* API */

// const DAPPLET_REGISTRY_ADDRESS = '0xa9ADbD86d055c70ce9A91bB7e7151A1424F00CA3'
const DAPPLET_REGISTRY_ADDRESS = '0xa0D2FB6f71F09E60aF1eD7344D4BB8Bb4c83C9af'
const REGISTRY_BRANCHES = {
  DEFAULT: 'default',
}

const MODULE_TYPES = {
  DAPPLET: 1,
}

const PUBLIC_LIST = {
  HEADER: 'H',
  TAIL: 'T',
}

const DEFAULT_CHAIN_ID = 0x05

const MAX_MODULES_COUNTER = 150

/* TEXT */

const DAPPLET_BUTTON_TEXT = {
  local: {
    add: {
      initial: 'Add to local list',
      hover: 'Add to local list',
    },
    adding: {
      initial: 'Add to local list',
      hover: 'Cancel',
    },
    removing: {
      initial: 'Removing from local list',
      hover: 'Cancel',
    },
    presented: {
      initial: 'In local list',
      hover: 'Remove from local list',
    },
    remove: {
      initial: 'Remove from local list',
      hover: 'Remove from local list',
    },
  },
  public: {
    add: {
      initial: 'Add to public list',
      hover: 'Add to public list',
    },
    adding: {
      initial: 'Adding to public list',
      hover: 'Cancel',
    },
    removing: {
      initial: 'Removing from public list',
      hover: 'Cancel',
    },
    presented: {
      initial: 'In public list',
      hover: 'Remove from public list',
    },
    remove: {
      initial: 'Remove from public list',
      hover: 'Remove from public list',
    },
  },
}

const DAPPLET_LISTING_STAGES = {
  ADD: 'add',
  PENIDNG_ADD: 'adding',
  PENDING_REMOVE: 'removing',
  PRESENTED: 'presented',
} as const

const DAPPLET_LISTINGS_NAMES = {
  LOCAL: 'local',
  PUBLIC: 'public',
} as const

export {
  DAPPLET_REGISTRY_ADDRESS,
  REGISTRY_BRANCHES,
  MODULE_TYPES,
  PUBLIC_LIST,
  DEFAULT_CHAIN_ID,
  MAX_MODULES_COUNTER,
  DAPPLET_BUTTON_TEXT,
  DAPPLET_LISTING_STAGES,
  DAPPLET_LISTINGS_NAMES,
}
