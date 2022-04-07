export default [
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "currentDappletId",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "nextDappletId",
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
        name: "addres",
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
        name: "addres",
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
