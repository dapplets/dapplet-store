import React, { useEffect, useState } from 'react';

import Layout from './../features/Layout/Layout';

import "@fontsource/roboto"
import "@fontsource/montserrat"
import ModalResolver from '../features/Modals/ModalResolver';


import { connect } from "react-redux";
import { RootState, RootDispatch } from "../models";
import { Sort } from './../models/sort';
import { ModalsList } from './../models/modals';
import { Lists, MyListElement } from '../models/myLists';
import { DappletsListItemTypes } from '../components/DappletsListItem/DappletsListItem';
import { useMemo } from 'react';
import { getEnsNamesApi } from '../api/ensName/ensName';

const mapState = (state: RootState) => ({
  dappletsStandard: state.dapplets,
  address: state.user.address,
  trustedUsers: state.trustedUsers.trustedUsers,
});
const mapDispatch = (dispatch: RootDispatch) => ({
  getDapplets: () => dispatch.dapplets.getDapplets(),
  getSort: () => dispatch.sort.getSort(),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setModalOpen: (payload: ModalsList | null) => dispatch.modals.setModalOpen(payload),
  getTrustedUsers: () => dispatch.trustedUsers.getTrustedUsers(),
  getLists: (payload: Lists) => dispatch.myLists.getLists(payload),
  removeMyList: (payload: Lists) => dispatch.myLists.removeMyList(payload),
  setMyList: (payload: {name: Lists, elements: MyListElement[]}) => dispatch.myLists.setMyList(payload),
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

declare global {
  interface Window { dapplets: any; openModal: any; }
}

const App = ({ 
  dappletsStandard,
  address,
  trustedUsers,
  getDapplets,
  getSort,
  setSort,
  setModalOpen,
  getTrustedUsers,
  getLists,
  removeMyList,
  setMyList,
}: Props) => {
  const [dimensions, setDimensions] = useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })

  const f = async () => {
    console.log('')
    const a = await getEnsNamesApi(['0x1c5BB0361a5EE75f190AfB6DC515c478205A5b4C', '0xF64849376812667BDa7D902666229f8b8dd90687'])
    console.log({a})
  }

  useEffect(() => {
    f()
  }, [])
  
  const isDapplet = useMemo(() => {
    return !window.dapplets
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dappletsStandard])

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
    getSort()
    getDapplets()
  }, [getDapplets, getLists, getSort, getTrustedUsers])

  useEffect(() => {
    if (!isDapplet)
    {
      getLists(Lists.MyDapplets)
      getTrustedUsers()
    }
  }, [getLists, getTrustedUsers, isDapplet])

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
        .forEach(({ name }) => {
          list[name] = { name, type: DappletsListItemTypes.Default}
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
    }
  }, [address, dapplets, setMyList])

  return (
    <>
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
