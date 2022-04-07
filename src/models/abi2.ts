export default [
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "currentModuleIdx",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "nextModuleIdx",
            type: "uint32",
          },
        ],
        internalType: "struct ListLink[]",
        name: "links",
        type: "tuple[]",
      },
    ],
    name: "changeMyList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "lister",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "moduleIdx",
        type: "uint32",
      },
    ],
    name: "containsModuleInListing",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "lister",
        type: "address",
      },
    ],
    name: "getLinkedList",
    outputs: [
      {
        internalType: "uint32[]",
        name: "",
        type: "uint32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "lister",
        type: "address",
      },
    ],
    name: "getLinkedListSize",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getListers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
