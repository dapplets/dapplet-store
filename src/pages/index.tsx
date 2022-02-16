import React, { useEffect, useState } from 'react';

import Layout from './../features/Layout/Layout';

import "@fontsource/roboto"
import "@fontsource/montserrat"
import "@fontsource/montserrat/900.css"
import ModalResolver from '../features/Modals/ModalResolver';
import { Toaster } from "react-hot-toast";


import { connect } from "react-redux";
import { RootState, RootDispatch } from "../models";
import { Sort } from './../models/sort';
import { ModalsList } from './../models/modals';
import { Lists, MyListElement } from '../models/myLists';
import { DappletsListItemTypes } from '../components/DappletsListItem/DappletsListItem';
import { useMemo } from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import Web3Modal from "web3modal";

// import { getEnsNamesApi } from '../api/ensName/ensName';

const mapState = (state: RootState) => ({
  dappletsStandard: state.dapplets,
  address: state.user.address,
  trustedUsers: state.trustedUsers.trustedUsers,
  addressFilter: state.sort.addressFilter
});
const mapDispatch = (dispatch: RootDispatch) => ({
  getDapplets: () => dispatch.dapplets.getDapplets(),
  getSort: (address: string) => dispatch.sort.getSort(address),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setModalOpen: (payload: ModalsList | null) => dispatch.modals.setModalOpen(payload),
  getTrustedUsers: () => dispatch.trustedUsers.getTrustedUsers(),
  getLists: (payload: Lists) => dispatch.myLists.getLists(payload),
  removeMyList: (payload: Lists) => dispatch.myLists.removeMyList(payload),
  setMyList: (payload: {name: Lists, elements: MyListElement[]}) => dispatch.myLists.setMyList(payload),
  getMyDapplets: () => dispatch.myLists.getMyDapplets(),
  setUser: (payload: string) => dispatch.user.setUser({
    address: payload
  }),
  setProvider: (payload: any) => dispatch.user.setUser({
    provider: payload
  }),
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

declare global {
  interface Window { dapplets: any; openModal: any; }
}

const App = ({ 
  dappletsStandard,
  address,
  trustedUsers,
  addressFilter,
  getDapplets,
  getSort,
  setSort,
  setModalOpen,
  getTrustedUsers,
  getLists,
  removeMyList,
  setMyList,
  getMyDapplets,
  setUser,
  setProvider,
}: Props) => {
  const [dimensions, setDimensions] = useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })
  const [isDapplet, setIsDapplet] = useState(true)

  useEffect(() => {
    window.addEventListener('dapplets#initialized', () => {
      setIsDapplet(false)
    })
  }, [])
  
  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }
    window.addEventListener('resize', handleResize)
  }, [])
  
  const [openedList, setOpenedList] = useState(null)

  const dapplets = useMemo(() => Object.values(dappletsStandard), [dappletsStandard])

  useEffect(() => {
    getDapplets()
  }, [getDapplets, getLists, getSort, getTrustedUsers])

  useEffect(() => {
    if (!isDapplet)
    {
      getMyDapplets()
      getTrustedUsers()
    }
  }, [getLists, getMyDapplets, getTrustedUsers, isDapplet])

  // TODO: test func to open modals
  useEffect(() => {
    window.openModal = (modal: ModalsList) => {
      setModalOpen(modal)
    }
  }, [setModalOpen])

  useEffect(() => {
    if (!address)
      removeMyList(Lists.MyListing)
  }, [address, removeMyList])

  useEffect(() => {
    const getDappletsListFromLocal = (payload: Lists) => {
      const dappletsListStringified = window.localStorage.getItem(payload);
      if (dappletsListStringified) {
        const dappletsListParsed: MyListElement[] = JSON.parse(dappletsListStringified);
        return dappletsListParsed;
      }
      return []
    }
    if (address) {
      const list: {
        [key: string]: MyListElement
      } = {}
      dapplets.filter((dapp) => dapp.trustedUsers.includes(address) && dapp.owner !== address)
        .forEach(({ name, id }) => {
          list[name] = { name, type: DappletsListItemTypes.Default, id}
        })
      getDappletsListFromLocal(Lists.MyListing).forEach((dapp) => {
        list[dapp.name] = dapp
      })
      const sortedList: MyListElement[] = Object.values(list)
      sortedList.sort(({type: typeA}, {type: typeB}) => {
        if (typeA === DappletsListItemTypes.Default && typeB !== DappletsListItemTypes.Default) 
          return 1
        if (typeB === DappletsListItemTypes.Default && typeA !== DappletsListItemTypes.Default) 
          return -1
        return 0
      })
      setMyList({
        name: Lists.MyListing,
        elements: sortedList,
      })
      if (addressFilter === address)
      {
        setSort({
          selectedList: Lists.MyListing,
        })
      }
    }
  }, [address, addressFilter, dapplets, setMyList, setSort])

  const [url, setUrl] = useState('')

  useEffect(() => {
    getSort(address || '')
  }, [address, getSort, url])
  
  useEffect(() => {
    window.onpopstate = () => {
      // console.log(document.URL, getAnchorParams())
      setUrl(document.URL as string)
    };
  }, [])

  useEffect(() => {
    

    let urls = [
      `https://bee.dapplets.org/bzz/5067359fb612cc8f083ab35fc7e5c0f3f98fc0ef57856731d6ae6e0b498ee37f/`,
      `https://bee.dapplets.org/bzz/5067359fb612cc8f083ab35fc7e5c0f3f98fc0ef57856731d6ae6e0b498ee37d/`,
      // 'https://api.github.com/users/jeresig'
    ];
    
    // Преобразуем каждый URL в промис, возвращённый fetch
    let requests = urls.map(url => fetch(url));
    
    // Promise.all будет ожидать выполнения всех промисов
    Promise.any(requests)
      .then(response => { 
        console.log({response})
      });
    const imageUrl = "https://bee.dapplets.org/bzz/5067359fb612cc8f083ab35fc7e5c0f3f98fc0ef57856731d6ae6e0b498ee37f/";

    fetch(imageUrl)
      .then(response => response.blob())
      .then(imageBlob => {
          // Then create a local URL for that image and print it 
          const imageObjectURL = URL.createObjectURL(imageBlob);
          console.log({imageObjectURL});
      });
  }, [])

  useEffect(() => {
    const web3Init = async () => {
      const providerOptions = {};
  
      const web3Modal = new Web3Modal({
        network: "goerli", // optional
        cacheProvider: true, // optional
        providerOptions // required
      });
  
      const provider = await web3Modal.connect();
      
      if (localStorage['metamask_disabled'] === 'true') {
        await provider.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
        localStorage['metamask_disabled'] = '';
      }
      
      provider.on("accountsChanged", (accounts: string[]) => {
        setUser(accounts[0])
      });
      
      const web3 = new Web3(provider);
      const address = await web3.eth.getAccounts()
      setUser(address[0])
      
      setProvider(provider)
      setModalOpen(null)
      localStorage['login'] = 'metamask';
      return web3
    }
    const walletConnect = async () => {
      try {
        const provider: any = new WalletConnectProvider({
          infuraId: "eda881d858ae4a25b2dfbbd0b4629992",
        });

        
        
        //  Enable session (triggers QR Code modal)
        await provider.enable();
        const web3 = new Web3(provider);
        const address = await web3.eth.getAccounts()
        setUser(address[0])
        setModalOpen(null)
        
        setProvider(provider)
        
        localStorage['login'] = 'walletConnect';
      } catch (error) {
        console.error(error)
      }
    }
    if (localStorage['login'] === 'walletConnect') {
      walletConnect()
      return;
    }
    if (localStorage['login'] === 'metamask') {
      web3Init()
      return;
    }

  }, [setModalOpen, setProvider, setUser])

  return (
    <>
      <Toaster position="bottom-left" />
      <ModalResolver/>
      <Layout
        setSelectedList={(newSelectedList: Lists | undefined) => setSort({ selectedList: newSelectedList })}
        trustedUsersList={trustedUsers}
        setAddressFilter={(newAddressFilter: string | undefined) => {
          setSort({ addressFilter: newAddressFilter })
        }}
        openedList={openedList}
        setOpenedList={setOpenedList}
        windowWidth={dimensions.width}
        isDapplet={isDapplet}
      />
    </>
  );
};

export default connect(mapState, mapDispatch)(App);
