export default [
  {
    inputs: [
      { internalType: "uint256", name: "dappletId", type: "uint256" },
      { internalType: "uint256", name: "prevDappletId", type: "uint256" },
      { internalType: "address", name: "addres", type: "address" },
    ],
    name: "changeDirection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "enum UsersListing.EventType",
            name: "eventType",
            type: "uint8",
          },
          { internalType: "uint32", name: "dappletId", type: "uint32" },
          { internalType: "uint32", name: "dappletPrevId", type: "uint32" },
        ],
        internalType: "struct UsersListing.Event[]",
        name: "events",
        type: "tuple[]",
      },
    ],
    name: "changeMyList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "addres", type: "address" }],
    name: "getLinkedList",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "addres", type: "address" }],
    name: "getLinkedListSize",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyList",
    outputs: [{ internalType: "uint32[]", name: "", type: "uint32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "addres", type: "address" }],
    name: "getUserList",
    outputs: [{ internalType: "uint32[]", name: "", type: "uint32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUsers",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
];
