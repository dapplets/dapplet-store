import React, { useEffect, useState } from 'react';

import Layout from './../features/Layout/Layout';
import { IDappletsList, IDappletsListElement } from "../config/types";
import { DappletsListItemTypes } from '../components/DappletsListItem/DappletsListItem';
import { Lists } from './../config/types';

import "@fontsource/roboto"
import "@fontsource/montserrat"
import ModalResolver from '../features/Modals/ModalResolver';


import { connect } from "react-redux";
import { RootState, RootDispatch } from "../models";
import { Sort } from './../models/sort';
import { ModalsList } from './../models/modals';

const mapState = (state: RootState) => ({
  dapplets: Object.values(state.dapplets),
  address: state.user.address,
  trustedUsers: state.trustedUsers.trustedUsers
});
const mapDispatch = (dispatch: RootDispatch) => ({
  getDapplets: () => dispatch.dapplets.getDapplets(),
  getSort: () => dispatch.sort.getSort(),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setModalOpen: (payload: ModalsList | null) => dispatch.modals.setModalOpen(payload),
  getTrustedUsers: () => dispatch.trustedUsers.getTrustedUsers(),
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

declare global {
  interface Window { dapplets: any; openModal: any; }
}

const App = ({ 
  dapplets,
  address,
  trustedUsers,
  getDapplets,
  getSort,
  setSort,
  setModalOpen,
  getTrustedUsers,
}: Props) => {
  const [selectedDappletsList, setSelectedDappletsList] = useState<IDappletsList>({ listName: Lists.Selected, dapplets: [] });
  const [localDappletsList, setLocalDappletsList] = useState<IDappletsList>({ listName: Lists.Local, dapplets: [] });
  const [openedList, setOpenedList] = useState(null)
  useEffect(() => {
    getSort()
  }, [getSort])

  useEffect(() => {
    getTrustedUsers()
  }, [getTrustedUsers])

  useEffect(() => {
    getDapplets()
    setLocalDappletsList(getDappletsListFromLocal(Lists.Local))
  }, [getDapplets])

  // TODO: test func to open modals
  useEffect(() => {
    window.openModal = (modal: ModalsList) => {
      setModalOpen(modal)
    }
  }, [setModalOpen])

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

  return (
    <>
      <ModalResolver
        setSelectedDappletsList={setSelectedDappletsList}
      />
      <Layout
        selectedDappletsList={selectedDappletsList}
        setSelectedDappletsList={setSelectedDappletsList}
        localDappletsList={localDappletsList}
        setLocalDappletsList={setLocalDappletsList}
        setSelectedList={(newSelectedList: Lists | undefined) => setSort({ selectedList: newSelectedList})}
        trustedUsersList={trustedUsers}
        setAddressFilter={(newAddressFilter: string | undefined) => setSort({ addressFilter: newAddressFilter})}
        openedList={openedList}
        setOpenedList={setOpenedList}
      />
    </>
  );
};

export default connect(mapState, mapDispatch)(App);
