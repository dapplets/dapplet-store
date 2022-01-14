import React, { useEffect, useState, FC } from 'react';

import { Layout } from '../../layouts/Layout/Layout';
import Input from '../Input';
import ListDapplets from '../ListDapplets';
import { IDappletsList, IDappletsListElement } from "../../config/types";
import { Lists } from '../../config/types';
import styled from "styled-components";

import "@fontsource/roboto"
import "@fontsource/montserrat"
import Dropdown from '../Dropdown/Dropdown';

import Web3 from "web3";
import Web3Modal from "web3modal";
// @ts-ignore
import WalletConnectProvider from "@walletconnect/web3-provider";
import LoginModal from '../LoginModal/LoginModal';
import UserModal from './../UserModal/UserModal';

import { connect } from "react-redux";
import { RootState, RootDispatch } from "../../models";
import { IDapplet } from '../../models/dapplets';
import { Sort, SortTypes } from '../../models/sort';
import { Modals } from '../../models/modals';

const mapState = (state: RootState) => ({
  dapplets: state.dapplets,
  sortType: state.sort.sortType,
  addressFilter: state.sort.addressFilter,
  searchQuery: state.sort.searchQuery,
  selectedList: state.sort.selectedList,
  isTrustedSort: state.sort.isTrustedSort,
  isLoginOpen: !!state.modals.isLoginOpen,
  isUserOpen: !!state.modals.isUserOpen,
  address: state.user.address,
});
const mapDispatch = (dispatch: RootDispatch) => ({
  getDapplets: () => dispatch.dapplets.getDapplets(),
  getSort: () => dispatch.sort.getSort(),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setModalOpen: (payload: Modals) => dispatch.modals.setModalOpen(payload),
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
  background-color: white;
`

declare global {
  interface Window { dapplets: any; }
}

const App: FC<Props> = ({ 
  dapplets,
  sortType,
  addressFilter,
  searchQuery,
  selectedList,
  isTrustedSort,
  isLoginOpen,
  isUserOpen,
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
  const [openedModal, setOpenedModal] = useState<any>(null);
  const [openedList, setOpenedList] = useState(null)
  const [provider, setProvider] = useState()

  useEffect(() => {
    console.log({localDappletsList})
  }, [localDappletsList])

  useEffect(() => {
    getSort()
  }, [getSort])

  const web3Init = async () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
      },
    };

    const web3Modal = new Web3Modal({
      network: "goerli", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });

    const provider = await web3Modal.connect();

    provider.on("accountsChanged", (accounts: string[]) => {
      setUser(accounts[0])
    });
    
    const web3 = new Web3(provider);
    const address = await web3.eth.getAccounts()
    setUser(address[0])
    
    console.log({address})
    setProvider(provider)
    setModalOpen({
      isLoginOpen: false,
    })
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
      setOpenedModal(null)
      
      console.log({address})
      setProvider(provider)
      setModalOpen({
        isLoginOpen: false,
      })

    } catch (error) {
      console.error(error)
    }
  }

  const onDapplet = async () => {
    try {
      const addressDapps = await window.dapplets.getAccounts()
      if (addressDapps.length > 0) {
        console.log({addressDapps})
        setUser(addressDapps[0].account)
        setModalOpen({
          isLoginOpen: false,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  // useEffect(() => {
  //   setModalOpen({
  //     isLoginOpen: true,
  //   })
  // }, [setModalOpen])

  useEffect(() => {
    // console.log({ eth: window.dapplets, window})
    if (isLoginOpen)
      setOpenedModal(<LoginModal 
        isDappletInstall={!window.dapplets} 
        onDapplet={onDapplet} 
        onMetamask={web3Init} 
        onWalletConnect={walletConnect} 
        onClose={() => setModalOpen({
          isLoginOpen: false,
        })} />)
    else
      setOpenedModal(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoginOpen])

    useEffect(() => {
      // console.log({ eth: window.dapplets, window})
      if (isUserOpen)
        setOpenedModal(<UserModal 
          address={address || ""} 
          onLogout={async () => {
            try {
              const prov: any = provider
              await prov.disconnect()
            } catch (error) {
              console.error(error)
            }
            setUser("")
            setModalOpen({
              isUserOpen: false,
            })
          }}
          />)
      else
        setOpenedModal(null)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isUserOpen])

  useEffect(() => {
    //  Create WalletConnect Provider
  }, [])

  const dropdownItems = [
    {
      id: 1,
      text: SortTypes.ABC,
      onClick: () => setSort({ searchQuery: SortTypes.ABC }),
    },
    {
      id: 2,
      text: SortTypes.ABCReverse,
      onClick: () => setSort({ searchQuery: SortTypes.ABCReverse }),
    },
    {
      id: 3,
      text: SortTypes.Newest,
      onClick: () => setSort({ searchQuery: SortTypes.Newest }),
    },
    {
      id: 4,
      text: SortTypes.Oldest,
      onClick: () => setSort({ searchQuery: SortTypes.Oldest }),
    }
  ];

  useEffect(() => {
    getDapplets()
    setSelectedDappletsList(getDappletsListFromLocal(Lists.Selected))
    setLocalDappletsList(getDappletsListFromLocal(Lists.Local))
  }, [getDapplets])

  // useEffect(() => {
  //   console.log({dapplets})
  // }, [dapplets])

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
        <ModalWrapperBg onClick={() => setModalOpen({
          isUserOpen: false,
          isLoginOpen: false,
        })}>
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
        setSelectedList={(newSelectedList: Lists | undefined) => setSort({ selectedList: newSelectedList})}
        activeTags={activeTags}
        setActiveTags={setActiveTags}
        setExpandedItems={setExpandedItems}
        trustedUsersList={trustedUsersList}
        setAddressFilter={(newAddressFilter: string | undefined) => setSort({ addressFilter: newAddressFilter})}
        openedList={openedList}
        setOpenedList={setOpenedList}
        loginInfo={address || ""}
        dapplets={[...dapplets]}
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
