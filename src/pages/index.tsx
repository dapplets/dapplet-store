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

const mapState = (state: RootState) => ({
  dappletsStandard: state.dapplets,
  address: state.user.address,
  trustedUsers: state.trustedUsers.trustedUsers,
  myLists: state.myLists,
});
const mapDispatch = (dispatch: RootDispatch) => ({
  getDapplets: () => dispatch.dapplets.getDapplets(),
  getSort: () => dispatch.sort.getSort(),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setModalOpen: (payload: ModalsList | null) => dispatch.modals.setModalOpen(payload),
  getTrustedUsers: () => dispatch.trustedUsers.getTrustedUsers(),
  getLists: (payload: Lists) => dispatch.myLists.getLists(payload),
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
  myLists,
  getDapplets,
  getSort,
  setSort,
  setModalOpen,
  getTrustedUsers,
  getLists,
  setMyList,
}: Props) => {
  // const [selectedDappletsList, setSelectedDappletsList] = useState<MyListElement[]>({ listName: Lists.MyListing, dapplets: [] });
  // const [localDappletsList, setLocalDappletsList] = useState<MyListElement[]>({ listName: Lists.MyDapplets, dapplets: [] });
  const [openedList, setOpenedList] = useState(null)

  const dapplets = useMemo(() => Object.values(dappletsStandard), [dappletsStandard])

  useEffect(() => {
    getSort()
    getDapplets()
    getTrustedUsers()
    getLists(Lists.MyDapplets)
  }, [getDapplets, getLists, getSort, getTrustedUsers])

  // TODO: test func to open modals
  useEffect(() => {
    window.openModal = (modal: ModalsList) => {
      setModalOpen(modal)
    }
  }, [setModalOpen])



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
        setAddressFilter={(newAddressFilter: string | undefined) => setSort({ addressFilter: newAddressFilter })}
        openedList={openedList}
        setOpenedList={setOpenedList}
        />
    </>
  );
};

export default connect(mapState, mapDispatch)(App);
