import React, { useMemo } from 'react';
import { Header } from 'semantic-ui-react';

import { IDappletsList, IDappletsListElement, Lists } from '../../config/types';
import { saveListToLocalStorage } from '../../utils';

import { ListDappletsProps } from './ListDapplets.props';
import styles from './ListDapplets.module.scss';
import SortableList from '../SortableList';
import ItemDapplet from '../ItemDapplet';
import { DappletsListItemTypes } from '../atoms/DappletsListItem'

import ProfileInList from '../../features/ProfileInList/ProfileInList';
import { SideLists } from '../../layouts/SidePanel';
import { IDapplet } from '../../models/dapplets';
import { SortTypes } from '../../models/sort';

function ListDapplets({
  dapplets,
  setSelectedDapplets,
  selectedDapplets,
  localDapplets,
  setLocalDapplets,
  selectedList,
  setSelectedList,
  expandedItems,
  setExpandedItems,
  sortType,
  searchQuery,
  addressFilter,
  setAddressFilter,
  setSortType,
  editSearchQuery,
  trustedUsersList,
  setTrustedUsersList,
  isTrustedSort,
  openedList,
  setOpenedList,
}: ListDappletsProps): React.ReactElement {

  const collator = useMemo(() => (
    new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'})
  ), []) 

  const editList = useMemo(() => (
    (item: IDapplet, dappletsList: IDappletsList, type: DappletsListItemTypes) => {
      const isLocalDapplet = dappletsList.dapplets.some((dapplet) => dapplet.name === item.name);
      const nowDappletsList = isLocalDapplet
        ? dappletsList.dapplets
          .filter((dapplet) => dapplet.name !== item.name)
        : [{name: item.name, type}, ...dappletsList.dapplets];
      const newDappletsList: IDappletsList = { listName: dappletsList.listName, dapplets: nowDappletsList };
      return newDappletsList
    } 
  ), [])

  const editLocalDappletsList = useMemo(() => (
    (item: IDapplet) => {
      setOpenedList(SideLists.MyDapplets)
      const newLocalDappletsList = editList(item, localDapplets, DappletsListItemTypes.Default)
      saveListToLocalStorage(newLocalDappletsList);
      setLocalDapplets(newLocalDappletsList);
    }
  ), [editList, localDapplets, setLocalDapplets, setOpenedList]);

  const editSelectedDappletsList = useMemo(() => (
    (item: IDapplet) => {
      setOpenedList(SideLists.MyListing)
      
      let nowDappletsList: IDappletsListElement[] = selectedDapplets.dapplets
      const dappletListIndex = nowDappletsList.findIndex((dapplet) => dapplet.name === item.name);
      if (dappletListIndex >= 0) {
        const nowDapplet = nowDappletsList[dappletListIndex]
        
        nowDappletsList.splice(dappletListIndex, 1)
        switch (nowDapplet.type) {
          case DappletsListItemTypes.Default:
            nowDapplet.type = DappletsListItemTypes.Removing
            nowDappletsList = [nowDapplet, ...nowDappletsList]
            break;
          case DappletsListItemTypes.Removing:
            nowDapplet.type = DappletsListItemTypes.Default
            nowDappletsList = [nowDapplet, ...nowDappletsList]
            break;
          default:
            break;
        }
      } else {
        nowDappletsList = [{name: item.name, type: DappletsListItemTypes.Adding}, ...nowDappletsList]
      }
      const newDappletsList: IDappletsList = { listName: selectedDapplets.listName, dapplets: nowDappletsList };
      saveListToLocalStorage(newDappletsList);
      setSelectedDapplets(newDappletsList);
    }
  ), [selectedDapplets.dapplets, selectedDapplets.listName, setOpenedList, setSelectedDapplets]);

  const titleText = useMemo(() => {
    if (selectedList) {
      switch (selectedList) {
        case Lists.Local:
          return 'My Dapplets'
        case Lists.Selected:
          return 'My Listing'
        default:
          return ''
      }
    }
    if (searchQuery) return 'Search Result'
    if (addressFilter) return 'User'
    if (isTrustedSort) return 'User Listing'
    return 'All Dapplets'
  }, [addressFilter, isTrustedSort, searchQuery, selectedList])

  const listDappletsHeader = (
    <div
      style={{
        display: 'flex',
        margin: '30px 35px 15px',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        height: 30,
      }}
    >
      <Header
        as="h2"
        className="infoTitle"
        size="medium"
        style={{
          flexGrow: 1,
        }}
      >
        {titleText}
      </Header>
      {addressFilter === '' && selectedList && (
        <button className="small-link" onClick={() => {
          setExpandedItems([]);
          setSelectedList(undefined);
        }}>
          Show all
        </button>
      )}
    </div>
  );

  const sortedDapplets = useMemo(() => {
    let sortedList =  dapplets.sort((a, b) => {
      if (selectedList) return 0;
      switch (sortType) {
        case SortTypes.ABC:
          return collator.compare(a.title, b.title);
        case SortTypes.ABCReverse:
          return collator.compare(b.title, a.title);
        case SortTypes.Newest:
          return collator.compare(b.timestamp, a.timestamp);
        case SortTypes.Oldest:
          return collator.compare(a.timestamp, b.timestamp);
        default:
          return 0;
      }
    });
    if (addressFilter !== '') 
      sortedList = sortedList.filter(({ trustedUsers }) => trustedUsers.includes(addressFilter))
    if (isTrustedSort)
      sortedList = sortedList.filter(({ trustedUsers }) => trustedUsersList.some((user) => trustedUsers.includes(user)))
    return sortedList
  }, [addressFilter, collator, dapplets, isTrustedSort, selectedList, sortType, trustedUsersList])

  const chooseList = {
    [Lists.Selected]: selectedDapplets,
    [Lists.Local]: localDapplets,
  }

  const chooseSetMethod = {
    [Lists.Selected]: setSelectedDapplets,
    [Lists.Local]: setLocalDapplets,
  }

  return (
    <article
      style={{
        position: 'static',
        padding: '0 !important',
        margin: '0 !important',
      }}
    >
      <div
        style={{
          height: 'calc(100vh - 206px)',
          overflow: 'auto',
          padding: '0 !important',
          margin: '0 !important',
        }}



      >
        {listDappletsHeader}
        {addressFilter !== '' && <ProfileInList
          title='title'
          address={addressFilter}
          avatar='https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/f3/f3fc836163981fb4517cfc2da30e194e84bcafcd_full.jpg'
          description='description'
          setAddressFilter={setAddressFilter}
          setSortType={setSortType}
          editSearchQuery={editSearchQuery}
          setSelectedList={setSelectedList}
          trustedUsersList={trustedUsersList}
          setTrustedUsersList={setTrustedUsersList}
        />}
        {selectedList 
          // ? <></>
          ? <SortableList
            dapplets={dapplets}
            items={chooseList[selectedList]}
            setItems={chooseSetMethod[selectedList]}
            selectedDapplets={selectedDapplets}
            localDapplets={localDapplets}
            editLocalDappletsList={editLocalDappletsList}
            editSelectedDappletsList={editSelectedDappletsList}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            setAddressFilter={setAddressFilter}
            addressFilter={addressFilter}
            setOpenedList={setOpenedList}
            searchQuery={searchQuery}
            trustedUsersList={trustedUsersList}
          />
          : sortedDapplets
            .map((item, i) => (
              <section className={styles.item} key={i}>
                <div className={styles.itemContainer}>
                  <ItemDapplet
                    key={item.name}
                    item={item}
                    selectedDapplets={selectedDapplets}
                    localDapplets={localDapplets}
                    editLocalDappletsList={editLocalDappletsList}
                    editSelectedDappletsList={editSelectedDappletsList}
                    expandedItems={expandedItems}
                    setExpandedItems={setExpandedItems}
                    searchQuery={searchQuery}
                    setAddressFilter={setAddressFilter}
                    setOpenedList={setOpenedList}
                    trustedUsersList={trustedUsersList}
                  />
                </div>
              </section>
            )
          )}
      </div>
    </article>
  );
}

export default ListDapplets;
