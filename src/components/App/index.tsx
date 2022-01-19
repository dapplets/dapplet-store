import React, { useEffect, useState, FC, useMemo } from 'react';

import { Layout } from '../../layouts/Layout/Layout';
import Input from '../Input';
import ListDapplets from '../ListDapplets';
import { IDappletsList, IDappletsListElement } from "../../config/types";
import { DappletsListItemTypes } from '../atoms/DappletsListItem';
import { Lists } from '../../config/types';
import styled from "styled-components";

import "@fontsource/roboto"
import "@fontsource/montserrat"
import Dropdown from '../Dropdown/Dropdown';

import Web3 from "web3";
import Web3Modal from "web3modal";
// @ts-ignore
import WalletConnectProvider from "@walletconnect/web3-provider";
import LoginModal from '../../features/Modals/LoginModal/LoginModal';
import UserModal from '../../features/Modals/UserModal/UserModal';

// import Parse from "parse";

import { connect } from "react-redux";
import { RootState, RootDispatch } from "../../models";
import { IDapplet } from '../../models/dapplets';
import { Sort, SortTypes } from '../../models/sort';
import { ModalsList } from '../../models/modals';
import WarningModal from '../../features/Modals/WarningModal/WarningModal';

const mapState = (state: RootState) => ({
  dapplets: Object.values(state.dapplets),
  sortType: state.sort.sortType,
  addressFilter: state.sort.addressFilter,
  searchQuery: state.sort.searchQuery,
  selectedList: state.sort.selectedList,
  isTrustedSort: state.sort.isTrustedSort,
  openedModal: state.modals.openedModal,
  address: state.user.address,
});
const mapDispatch = (dispatch: RootDispatch) => ({
  getDapplets: () => dispatch.dapplets.getDapplets(),
  getSort: () => dispatch.sort.getSort(),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setModalOpen: (payload: ModalsList | null) => dispatch.modals.setModalOpen(payload),
  setUser: (payload: string) => dispatch.user.setUser({
    address: payload
  }),
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

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

interface CheckboxWrapperProps {
  isTrustedSort: boolean
}

const CheckboxWrapper = styled.div<CheckboxWrapperProps>`
  display: grid;
  grid-template-columns: max-content max-content;
  grid-column-gap: 8px;
  padding-right: 15px;
  cursor: pointer;
  user-select: none;

  & > div {
    width: 16px;
    height: 16px;
    background: ${({ isTrustedSort }) => isTrustedSort ?  '#D9304F' : '#ffffff'};
    border-radius: 50%;
    margin-top: 2px;
    border:  ${({ isTrustedSort }) => isTrustedSort ?  'none' : '1px solid #919191'};
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
  background: none;
`

declare global {
  interface Window { dapplets: any; openModal: any; }
}

const App: FC<Props> = ({ 
  dapplets,
  sortType,
  addressFilter,
  searchQuery,
  selectedList,
  isTrustedSort,
  openedModal,
  address,
  getDapplets,
  getSort,
  setSort,
  setModalOpen,
  setUser,
}): React.ReactElement => {
  const [selectedDappletsList, setSelectedDappletsList] = useState<IDappletsList>({ listName: Lists.Selected, dapplets: [] });
  const [localDappletsList, setLocalDappletsList] = useState<IDappletsList>({ listName: Lists.Local, dapplets: [] });
  const [trustedUsersList, setTrustedUsersList] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [openedList, setOpenedList] = useState(null)
  const [provider, setProvider] = useState()

  useEffect(() => {
    getSort()
  }, [getSort])

  // TODO: test func to open modals
  useEffect(() => {
    window.openModal = (modal: ModalsList) => {
      setModalOpen(modal)
    }
  }, [setModalOpen])

  const nowModal = useMemo(() => {
    const web3Init = async () => {
      const providerOptions = {};
  
      const web3Modal = new Web3Modal({
        network: "goerli", // optional
        cacheProvider: true, // optional
        providerOptions // required
      });
  
      const provider = await web3Modal.connect();
      
      if (localStorage['metamask_disabled'] === 'true') {
        localStorage['metamask_disabled'] = '';
        await provider.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
      }
      
      provider.on("accountsChanged", (accounts: string[]) => {
        setUser(accounts[0])
      });
      
      const web3 = new Web3(provider);
      const address = await web3.eth.getAccounts()
      setUser(address[0])
      
      setProvider(provider)
      setModalOpen(null)
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
      } catch (error) {
        console.error(error)
      }
    }
  
    const onDapplet = async () => {
      try {
        const addressDapps = await window.dapplets.getAccounts()
        if (addressDapps.length > 0) {
          setUser(addressDapps[0].account)
          setModalOpen(null)
        }
      } catch (error) {
        console.error(error)
      }
    }
    switch (openedModal) {
      case ModalsList.Login:
        return (
          <LoginModal 
            isDappletInstall={!window.dapplets}
            onDapplet={onDapplet}
            onMetamask={web3Init}
            onWalletConnect={walletConnect}
            onClose={() => setModalOpen(null)}
          />
        )
      case ModalsList.User:
        return (
          <UserModal 
            address={address || ""} 
            onLogout={async () => {
              try {
                localStorage['metamask_disabled'] = 'true'
                const prov: any = provider
                prov.disconnect()
              } catch (error) {
                console.error(error)
              }
              setUser("")
              setModalOpen(null)
            }}
          />
        )
        case ModalsList.Warning:
          return (
            <WarningModal
              onClose={() => setModalOpen(null)}
            />
          )
      default:
        return null
    }
  }, [address, openedModal, provider, setModalOpen, setUser])

  const dropdownItems = [
    {
      id: 1,
      text: SortTypes.ABC,
      onClick: () => setSort({ sortType: SortTypes.ABC }),
    },
    {
      id: 2,
      text: SortTypes.ABCReverse,
      onClick: () => setSort({ sortType: SortTypes.ABCReverse }),
    },
    {
      id: 3,
      text: SortTypes.Newest,
      onClick: () => setSort({ sortType: SortTypes.Newest }),
    },
    {
      id: 4,
      text: SortTypes.Oldest,
      onClick: () => setSort({ sortType: SortTypes.Oldest }),
    }
  ];

  

  // const f = async () => {
  //   Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
  //   // Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
  //   Parse.initialize(
  //     'WyqwCiBmXDHB7kDdTP3NgjtdAupCRxbdm72VQ6xS', // This is your Application ID
  //     '3LpyQhNB0KRTOaBAUHR5z6k5L3KAhR0o140A4vHV', // This is your Javascript key
  //   );
  //   const query = new Parse.Query('dapplets');

  //   // const Dapplet = Parse.Object.extend("dapplets");
  //   // const dapplet = new Dapplet();
  //   // dapplet.set("name", "11");
  //   // dapplet.set("address", "qwerty");
  //   // await dapplet.save();
    
  //   const results = await query.find();
  //   try {
  //     for (const object of results) {
  //       // Access the Parse Object attributes using the .GET method
  //       const name = object.get('name');
  //       console.log(name);
  //     }
  //   } catch (error) {
  //     console.error('Error while fetching MyCustomClassName', error);
  //   }
  //   try {
  //     // here you put the objectId that you want to delete
  //     const object = await query.get('y133E3nUI7');
  //     try {
  //       const response = await object.destroy();
  //       console.log('Deleted ParseObject', response);
  //     } catch (error) {
  //       console.error('Error while deleting ParseObject', error);
  //     }
  //   } catch (error) {
  //     console.error('Error while retrieving ParseObject', error);
  //   }
  // }
  // useEffect(() => {
  //   f()
  // }, [])

  useEffect(() => {
    getDapplets()
    setLocalDappletsList(getDappletsListFromLocal(Lists.Local))
  }, [getDapplets])

  useEffect(() => {
    if (address) {
      const list: {
        [key: string]: IDappletsListElement
      } = {}
      dapplets.filter((dapp) => dapp.trustedUsers.includes(address) && dapp.owner !== address)
        .forEach(({ name }) => {
          list[name] = { name, type: DappletsListItemTypes.Default}
        })
      getDappletsListFromLocal(Lists.Selected).dapplets.forEach((dapp) => {
        list[dapp.name] = dapp
      })
      const sortedList: IDappletsListElement[] = Object.values(list)
      sortedList.sort(({type: typeA}, {type: typeB}) => {
        if (typeA === DappletsListItemTypes.Default && typeB !== DappletsListItemTypes.Default) 
          return 1
        if (typeB === DappletsListItemTypes.Default && typeA !== DappletsListItemTypes.Default) 
          return -1
        return 0
      })
      setSelectedDappletsList({
        listName: Lists.Selected,
        dapplets: sortedList,
      })
    }
  }, [address, dapplets])

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
    const dapps = chooseDappletsList[selectedList];
    return dapps.dapplets
      .map((dapplet) => dapplets.find((dapp) => dapp.name === dapplet.name))
      .filter((dapp): dapp is IDapplet => !!dapp);
  }

  const dappletsByList = formDappletsList(selectedList);

  const reg1 = new RegExp(`${searchQuery?.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'gi');
  const regs = activeTags.map((activeTag) => new RegExp(activeTag, 'gi'));
  regs.push(reg1);
  const filteredDapplets = dappletsByList && dappletsByList.filter((dapplet) => {
    try {
      const res = regs.map((reg) => (
        reg.exec(dapplet.name) ||
        reg.exec(dapplet.title) ||
        reg.exec(dapplet.owner.replace('0x000000000000000000000000', '0x')) ||
        reg.exec(dapplet.description) ||
        reg.exec(dapplet.timestamp)
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
        <ModalWrapperBg onClick={() => setModalOpen(null)}>
          <ModalWrapper onClick={(e) => e.stopPropagation()}>
            {nowModal}
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
        setSelectedList={(newSelectedList: Lists | undefined) => setSort({ selectedList: newSelectedList})}
        activeTags={activeTags}
        setActiveTags={setActiveTags}
        setExpandedItems={setExpandedItems}
        trustedUsersList={trustedUsersList}
        setAddressFilter={(newAddressFilter: string | undefined) => setSort({ addressFilter: newAddressFilter})}
        openedList={openedList}
        setOpenedList={setOpenedList}
        loginInfo={address || ""}
        dapplets={dapplets}
      >
        <>
          <Wrapper>
            <Input 
              searchQuery={searchQuery || ""}
              editSearchQuery={(newSearchQuery: string | undefined) => setSort({ searchQuery: newSearchQuery})}
            />
            <Dropdown 
              items={dropdownItems}
              active={sortType || SortTypes.ABC}
              setActive={(newSortType: SortTypes) => setSort({ sortType: newSortType})}
            />
            <CheckboxWrapper isTrustedSort={isTrustedSort || false} onClick={() => setSort({isTrustedSort: !isTrustedSort})}>
              <div>{isTrustedSort && <div></div>}</div>
              <span>From trusted users</span>
            </CheckboxWrapper>
          </Wrapper>
          {filteredDapplets && <ListDapplets
            dapplets={filteredDapplets}
            selectedDapplets={selectedDappletsList}
            setSelectedDapplets={setSelectedDappletsList}
            localDapplets={localDappletsList}
            setLocalDapplets={setLocalDappletsList}
            selectedList={selectedList}
            setSelectedList={(newSelectedList: Lists | undefined) => setSort({ selectedList: newSelectedList })}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            sortType={sortType || SortTypes.ABC}
            setSortType={(newSortType: SortTypes) => setSort({ sortType: newSortType })}
            searchQuery={searchQuery || ""}
            editSearchQuery={(newtSearchQuery: string) => setSort({ searchQuery: newtSearchQuery })}
            addressFilter={addressFilter || ""}
            setAddressFilter={(newAddressFilter: string) => setSort({ addressFilter: newAddressFilter })}
            trustedUsersList={trustedUsersList}
            setTrustedUsersList={setTrustedUsersList}
            isTrustedSort={isTrustedSort || false}
            openedList={openedList}
            setOpenedList={setOpenedList}
          />}
        </>
      </Layout>
    </>
  );
};

export default connect(mapState, mapDispatch)(App);
