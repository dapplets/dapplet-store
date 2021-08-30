import logo from '../images/logo.png';

// TODO: Реализовать ассинхронное получение данных
export interface IDappet {
  id: number | string;
  icon: string;
  title: string;
  shortDescription: string;
  author: string;
  tags: number[];
  rating?: number;
  version?: string;
  authorInformation?: string;
  detailedDescription?: string;
}

export const DAPPLETS: IDappet[] = [
  {
    id: '1234567890',
    icon: logo,
    title: 'Ethereum Contract Example',
    shortDescription: 'Feature adds tweets to Ethereum contract. Together we can give the economy and users new business models that are currently unattainable.',
    author: "bill.sanders@example.com",
    tags: [0, 1, 2, 3, 4],
    version: '1.0',
    detailedDescription: 'Restore the freedom to receive information and expert opinions without censorship and manipulation by social networks and media. Empower users to create their own vision based on many independent sources of information. Deliver web3 technologies to legacy web, especially to visual layer.'
  },
  {
    id: '5798383640547363',
    icon: logo,
    title: 'Ethereum Contract Example',
    shortDescription: 'Feature adds tweets to Ethereum contract. Together we can give the economy and users new business models that are currently unattainable.',
    author: "bill.sanders@example.com",
    tags: [5, 6, 7, 8, 9],
    detailedDescription: 'Restore the freedom to receive information and expert opinions without censorship and manipulation by social networks and media. Empower users to create their own vision based on many independent sources of information. Deliver web3 technologies to legacy web, especially to visual layer.'
  },
  {
    id: '97465393645964',
    icon: logo,
    title: 'Ethereum Contract Example',
    shortDescription: 'Feature adds tweets to Ethereum contract. Together we can give the economy and users new business models that are currently unattainable.',
    author: "bill.sanders@example.com",
    tags: [10, 4, 2, 7, 1],
    detailedDescription: 'Restore the freedom to receive information and expert opinions without censorship and manipulation by social networks and media. Empower users to create their own vision based on many independent sources of information. Deliver web3 technologies to legacy web, especially to visual layer.'
  },
  {
    id: '432425634952346439',
    icon: logo,
    title: 'Ethereum Contract Example',
    shortDescription: 'Feature adds tweets to Ethereum contract. Together we can give the economy and users new business models that are currently unattainable.',
    author: "bill.sanders@example.com",
    tags: [5],
    detailedDescription: 'Restore the freedom to receive information and expert opinions without censorship and manipulation by social networks and media. Empower users to create their own vision based on many independent sources of information. Deliver web3 technologies to legacy web, especially to visual layer.'
  },
];


