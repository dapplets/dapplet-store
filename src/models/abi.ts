// eslint-disable-next-line import/no-anonymous-default-export
export default [
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "enum UsersListing.EventType",
						"name": "eventType",
						"type": "uint8"
					},
					{
						"internalType": "uint32",
						"name": "dappletId",
						"type": "uint32"
					}
				],
				"internalType": "struct UsersListing.Event[]",
				"name": "events",
				"type": "tuple[]"
			}
		],
		"name": "changeMyList",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyList",
		"outputs": [
			{
				"internalType": "uint32[]",
				"name": "",
				"type": "uint32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "addres",
				"type": "address"
			}
		],
		"name": "getUserList",
		"outputs": [
			{
				"internalType": "uint32[]",
				"name": "",
				"type": "uint32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUsers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]