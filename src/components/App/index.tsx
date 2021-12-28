import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { Layout } from '../../layouts/Layout/Layout';
import Input from '../Input';
import ListDapplets from '../ListDapplets';
import abi from '../../abi.json';
import types from '../../types.json';
import { IDapplet, IDappletsList, IDappletVersions, IDappletsListElement } from "../../config/types";
import { Lists } from '../../config/types';
import styled from "styled-components";

import "@fontsource/roboto"
import "@fontsource/montserrat"
import Dropdown from '../Dropdown/Dropdown';

// import Web3 from "web3";
// import Web3Modal from "web3modal";
// @ts-ignore
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import LoginModal from '../LoginModal/LoginModal';
import { getAnchorParams, setAnchorParams } from '../../lib/anchorLink';


const PROVIDER_URL = 'https://rinkeby.infura.io/v3/eda881d858ae4a25b2dfbbd0b4629992';

const getDappletsListFromLocal = (listName: Lists) => {
  const dappletsListStringified = window.localStorage.getItem(listName);
  if (dappletsListStringified) {
    const dappletsListParsed: IDappletsListElement[] = JSON.parse(dappletsListStringified);
    return({ listName, dapplets: dappletsListParsed });
  } else {
    return({ listName, dapplets: [] });
  }

}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content max-content;
  grid-column-gap: 20px;
  align-items: center;
  border-bottom: 1px solid rgb(227, 227, 227);
`

const CheckboxWrapper = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  grid-column-gap: 8px;
  padding-right: 15px;
  cursor: pointer;
  user-select: none;

  & > div {
    width: 16px;
    height: 16px;
    background: #D9304F;
    border-radius: 50%;
    margin-top: 2px;
  }

  & > div > div {
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
    margin: 5px;
  }
`

const ModalWrapperBg = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99999;
  display: grid;
  justify-items: center;
  align-items: center;
`

const ModalWrapper = styled.div`
  background-color: white;
`

export enum SortTypes {
  ABC = 'Sort A-Z',
  ABCReverse = 'Sort Z-A',
  Newest = 'Sort by newest',
  Oldest = 'Sort by oldest',
}

declare global {
  interface Window { ethereum: any; }
}

const App = (): React.ReactElement => {
  const [sortType, setSortType] = useState(SortTypes.ABC);
  const [addressFilter, setAddressFilter] = useState('');
  const [searchQuery, editSearchQuery] = useState<string>('');
  const [dapplets, updateDapplets] = useState<IDapplet[]>([]);
  const [dappletsVersions, updateDappletsVersions] = useState<IDappletVersions>();
  const [dappletsTransactions, updateDappletsTransactions] = useState<any>();
  const [selectedDappletsList, setSelectedDappletsList] = useState<IDappletsList>({ listName: Lists.Selected, dapplets: [] });
  const [localDappletsList, setLocalDappletsList] = useState<IDappletsList>({ listName: Lists.Local, dapplets: [] });
  const [trustedUsersList, setTrustedUsersList] = useState<string[]>([]);
  const [selectedList, setSelectedList] = useState<Lists>();
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isTrustedSort, setIsTrustedSort] = useState<boolean>(false);
  const [openedModal, setOpenedModal] = useState<any>(null);
  const [openedList, setOpenedList] = useState(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loginInfo, setLoginInfo] = useState('');


  useEffect(() => {
    const params = getAnchorParams()
    if (!params) return;
    setSortType(params.sortType)
    setAddressFilter(params.addressFilter)
    editSearchQuery(params.searchQuery)
    setIsTrustedSort(params.isTrustedSort)
    if (!!params.selectedList) setSelectedList(params.selectedList)
  }, [])

  // const firstUpdate = useRef(true);
  useEffect(() => {    
    // if (firstUpdate.current) {
    //   firstUpdate.current = false;
    //   return;
    // }
    setAnchorParams({
      sortType,
      addressFilter,
      searchQuery,
      isTrustedSort,
      selectedList,
    })
  }, [addressFilter, isTrustedSort, searchQuery, selectedList, sortType])

  // const web3Init = async () => {
  //   const providerOptions = {
  //     walletconnect: {
  //       package: WalletConnectProvider,
  //     },
  //   };
    
  //   const web3Modal = new Web3Modal({
  //     network: "goerli", // optional
  //     cacheProvider: true, // optional
  //     providerOptions // required
  //   });
    
  //   const provider = await web3Modal.connect();

  //   provider.on("accountsChanged", (accounts: string[]) => {
  //     setLoginInfo(accounts[0])
  //   });
    
  //   const web3 = new Web3(provider);
  //   const address = await web3.eth.getAccounts()
  //   setLoginInfo(address[0])
  //   setOpenedModal(null)
    
  //   console.log({address})
  //   return web3
  // }

  useEffect(() => {
    // setOpenedModal(<LoginModal onMetamask={web3Init} />)
  }, [])

  console.log({dapplets, searchQuery})
  const dropdownItems = [
    {
      id: 1,
      text: SortTypes.ABC,
      onClick: () => setSortType(SortTypes.ABC),
    },
    {
      id: 2,
      text: SortTypes.ABCReverse,
      onClick: () => setSortType(SortTypes.ABCReverse),
    },
    {
      id: 3,
      text: SortTypes.Newest,
      onClick: () => setSortType(SortTypes.Newest),
    },
    {
      id: 4,
      text: SortTypes.Oldest,
      onClick: () => setSortType(SortTypes.Oldest),
    }
  ];
  // console.log('dapplets', dapplets)
  // console.log('dappletsVersions', dappletsVersions)
  // console.log('dappletsTransactions', dappletsTransactions)
  // console.log('selectedDapplets', selectedDappletsList)
  // console.log('localDapplets', localDappletsList)
  // console.log('selectedList', selectedList)

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL, 4);
    const contract: any = new ethers.Contract('0xb76b02b35ad7cb71e2061056915e521e8f05c130', abi, provider);
    contract.queryFilter('ModuleInfoAdded').then(async (events: any) => {
      // console.log('events', events)
      const versions: any = {};
      const timestamps: any = {};
      const allModules: any[] = await Promise.all(events.map(async (ev: any) => {
        const tx: any = await provider.getTransaction(ev.transactionHash);
        const t: any = types;
        const decoded = ethers.utils.defaultAbiCoder.decode(t, ethers.utils.hexDataSlice(tx.data, 4));
        const module = await contract.getModuleInfoByName(decoded.mInfo.name);

        const hex: string = await contract.getVersionNumbers(module.name, 'default');
        const result = (hex.replace('0x', '')
          .match(/.{1,8}/g) ?? [])
          .map(x => `${parseInt('0x' + x[0] + x[1])}.${parseInt('0x' + x[2] + x[3])}.${parseInt('0x' + x[4] + x[5])}`);
        versions[module.name] = result;

        const block = await ev.getBlock();
        timestamps[module.name] = block.timestamp;

        return module;
      }));

      const allDapplets = allModules.filter((module: any) => module.moduleType === 1);
      updateDapplets(allDapplets);
      updateDappletsVersions(versions);
      updateDappletsTransactions(timestamps);
    });

    setSelectedDappletsList(getDappletsListFromLocal(Lists.Selected))
    setLocalDappletsList(getDappletsListFromLocal(Lists.Local))
  }, []);

  useEffect(() => {
    const trustedUsers = window.localStorage.getItem('trustedUsers');
    if (trustedUsers) setTrustedUsersList(JSON.parse(trustedUsers))
  }, [])

  useEffect(() => {
    window.localStorage.setItem('trustedUsers', JSON.stringify(trustedUsersList));
  }, [trustedUsersList])

  const formDappletsList = (selectedList?: Lists) => {
    if (dapplets === undefined || selectedList === undefined) return dapplets;
    const chooseDappletsList = {
      [Lists.Local]: localDappletsList,
      [Lists.Selected]: selectedDappletsList,
    };
    // console.log('selectedList', selectedList)
    const dapps = chooseDappletsList[selectedList];
    // console.log('dapps', dapps)
    return dapps.dapplets
      .map((dapplet) => dapplets.find((dapp) => dapp.name === dapplet.name))
      .filter((dapp): dapp is IDapplet => !!dapp);
  }

  // const [filteredDapplets, setFilteredDapplets] = useState()

  const dappletsByList = formDappletsList(selectedList);

  const reg1 = new RegExp(`${searchQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'gi');
  const regs = activeTags.map((activeTag) => new RegExp(activeTag, 'gi'));
  regs.push(reg1);
  const filteredDapplets = dappletsByList && dappletsByList.filter((dapplet) => {
    try {
      const res = regs.map((reg) => (
        reg.exec(dapplet.name) ||
        reg.exec(dapplet.title) ||
        reg.exec(dapplet.owner.replace('0x000000000000000000000000', '0x')) ||
        reg.exec(dapplet.description) ||
        reg.exec(dappletsVersions![dapplet.name][dappletsVersions![dapplet.name].length - 1])
      ));
      return  !res.includes(null);
    } catch (error) {
      console.error(error)
    }
    return false
  })

  

  /** 
   *  The feature makes the header hidden when scrilling down the page and visible when scrolling up the page.
   * */
  
  useEffect(() => {
    let lastKnownScrollPosition = 0;
    let ticking = false;
    document.addEventListener('scroll', function(e) {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          showOrHideHeader(window.scrollY, lastKnownScrollPosition);
          ticking = false;
          lastKnownScrollPosition = window.scrollY;
        });
        ticking = true;
      }
    });
  }, []);
    
  const showOrHideHeader = (currentScrollPos: number, prevScrollPos: number ) => {
    const el: HTMLElement | null = document.querySelector('main header');
    if (el) {
      if (currentScrollPos > 70 && currentScrollPos - prevScrollPos > 0) {
        el.style.transition = 'all .2s ease-in';
        el.style.opacity = '0';
      } else {
        el.style.transition = 'all .2s ease-out';
        el.style.opacity = '1';
      }
    };
  };

  return (
    <>
      {openedModal &&
        <ModalWrapperBg onClick={() => setOpenedModal(null)}>
          <ModalWrapper onClick={(e) => e.stopPropagation()}>
            {openedModal}
          </ModalWrapper>
        </ModalWrapperBg>
      }
      <Layout
        dappletTitles={dapplets?.reduce((acc, dapp) => ({ ...acc, [dapp.name]: dapp.title }), {})}
        selectedDappletsList={selectedDappletsList}
        setSelectedDappletsList={setSelectedDappletsList}
        localDappletsList={localDappletsList}
        setLocalDappletsList={setLocalDappletsList}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
        activeTags={activeTags}
        setActiveTags={setActiveTags}
        setExpandedItems={setExpandedItems}
        trustedUsersList={trustedUsersList}
        setAddressFilter={setAddressFilter}
        openedList={openedList}
        setOpenedList={setOpenedList}
        loginInfo={loginInfo}
        dapplets={dapplets}
      >
        <>
          <Wrapper>
            <Input 
              searchQuery={searchQuery}
              editSearchQuery={editSearchQuery}
            />
            <Dropdown 
              items={dropdownItems}
              active={sortType}
              setActive={setSortType}
            />
            <CheckboxWrapper onClick={() => setIsTrustedSort(!isTrustedSort)}>
              <div>{isTrustedSort && <div></div>}</div>
              <span>From trusted users</span>
            </CheckboxWrapper>
          </Wrapper>
          {filteredDapplets && <ListDapplets
            dapplets={filteredDapplets}
            dappletsVersions={dappletsVersions}
            selectedDapplets={selectedDappletsList}
            setSelectedDapplets={setSelectedDappletsList}
            localDapplets={localDappletsList}
            setLocalDapplets={setLocalDappletsList}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            dappletsTransactions={dappletsTransactions}
            updateDappletsTransactions={updateDappletsTransactions}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            sortType={sortType}
            setSortType={setSortType}
            searchQuery={searchQuery}
            editSearchQuery={editSearchQuery}
            addressFilter={addressFilter}
            setAddressFilter={setAddressFilter}
            trustedUsersList={trustedUsersList}
            setTrustedUsersList={setTrustedUsersList}
            isTrustedSort={isTrustedSort}
            openedList={openedList}
            setOpenedList={setOpenedList}
          />}
        </>
      </Layout>
    </>
  );
};

export default App;
