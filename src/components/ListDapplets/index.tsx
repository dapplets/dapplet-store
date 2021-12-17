import React, { useMemo } from 'react';
import { Header } from 'semantic-ui-react';

import { IDapplet, IDappletsList, IDappletsListElement, Lists } from '../../config/types';
import { saveListToLocalStorage } from '../../utils';

import { ListDappletsProps } from './ListDapplets.props';
import styles from './ListDapplets.module.scss';
import SortableList from '../SortableList';
import ItemDapplet from '../ItemDapplet';
import { DappletsListItemTypes } from '../atoms/DappletsListItem'

import { SortTypes } from '../App'
import ProfileInList from '../../features/ProfileInList/ProfileInList';

function ListDapplets({
  dapplets,
  dappletsVersions,
  setSelectedDapplets,
  selectedDapplets,
  localDapplets,
  setLocalDapplets,
  selectedList,
  setSelectedList,
  dappletsTransactions,
  expandedItems,
  setExpandedItems,
  sortType,
  searchQuery,
  addressFilter,
  setAddressFilter,
  setSortType,
  editSearchQuery,
}: ListDappletsProps): React.ReactElement {

  const collator = useMemo(() => (
    new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'})
  ), []) 

  const editList = (item: IDapplet, dappletsList: IDappletsList, type: DappletsListItemTypes) => {
    const isLocalDapplet = dappletsList.dapplets.some((dapplet) => dapplet.name === item.name);
    const nowDappletsList = isLocalDapplet
      ? dappletsList.dapplets
        .filter((dapplet) => dapplet.name !== item.name)
      : [...dappletsList.dapplets, {name: item.name, type}];
    const newDappletsList: IDappletsList = { listName: dappletsList.listName, dapplets: nowDappletsList };
    return newDappletsList
  } 

  const editLocalDappletsList = (item: IDapplet) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const newLocalDappletsList = editList(item, localDapplets, DappletsListItemTypes.Default)
    saveListToLocalStorage(newLocalDappletsList);
    setLocalDapplets(newLocalDappletsList);
  };

  const editSelectedDappletsList = (item: IDapplet) => (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    let nowDappletsList: IDappletsListElement[] = selectedDapplets.dapplets
    const dappletListIndex = nowDappletsList.findIndex((dapplet) => dapplet.name === item.name);
    if (dappletListIndex >= 0) {
      if (nowDappletsList[dappletListIndex].type === DappletsListItemTypes.Default)
        nowDappletsList[dappletListIndex].type = DappletsListItemTypes.Removing
    } else {
      nowDappletsList = [...nowDappletsList, {name: item.name, type: DappletsListItemTypes.Adding}]
    }
    const newDappletsList: IDappletsList = { listName: selectedDapplets.listName, dapplets: nowDappletsList };
    saveListToLocalStorage(newDappletsList);
    setSelectedDapplets(newDappletsList);
  };

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
        {selectedList ? selectedList : 'Dapplets'}
      </Header>
      {/* {!selectedList && (
        <Dropdown text={`Sort by: ${sortType}`} className="small-link">
          <Dropdown.Menu>
            <Dropdown.Item
              text="A-Z"
              onClick={() => setSortType('A-Z')}
            />
            <Dropdown.Item
              text="Z-A"
              onClick={() => setSortType('Z-A')}
            />
            <Dropdown.Item
              text="Newest"
              onClick={() => setSortType('Newest')}
            />
            <Dropdown.Item
              text="Oldest"
              onClick={() => setSortType('Oldest')}
            />
          </Dropdown.Menu>
        </Dropdown>
      )} */}
      {selectedList && (
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
    console.log({addressFilter})
    const sortedList =  dapplets.sort((a, b) => {
      if (selectedList) return 0;
      switch (sortType) {
        case SortTypes.ABC:
          return collator.compare(a.title, b.title);
        case SortTypes.ABCReverse:
          return collator.compare(b.title, a.title);
        case SortTypes.Newest:
          return collator.compare(dappletsTransactions[b.name], dappletsTransactions[a.name]);
        case SortTypes.Oldest:
          return collator.compare(dappletsTransactions[a.name], dappletsTransactions[b.name]);
        default:
          return 0;
      }
    });
    if (addressFilter === '') 
      return sortedList
    return sortedList.filter(({ owner }) => owner === addressFilter)
  }, [addressFilter, collator, dapplets, dappletsTransactions, selectedList, sortType])

  // const sortedDapplets = dapplets
  //   .sort((a, b) => {
  //     if (selectedList) return 0;
  //     console.log({sortType})
  //     switch (sortType) {
  //       case SortTypes.ABC:
  //         return collator.compare(a.title, b.title);
  //       case SortTypes.ABCReverse:
  //         return collator.compare(b.title, a.title);
  //       case SortTypes.Newest:
  //         return collator.compare(dappletsTransactions[b.name], dappletsTransactions[a.name]);
  //       case SortTypes.Oldest:
  //         return collator.compare(dappletsTransactions[a.name], dappletsTransactions[b.name]);
  //       default:
  //         return 0;
  //     }
  //   });

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
          address='0x000000000000000000000000692a4d7b7be2dc1623155e90b197a82d114a74f3'
          avatar='https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/f3/f3fc836163981fb4517cfc2da30e194e84bcafcd_full.jpg'
          description='description'
          setAddressFilter={setAddressFilter}
          setSortType={setSortType}
          editSearchQuery={editSearchQuery}
        />}
        {selectedList
          ? <SortableList
            dapplets={dapplets}
            items={chooseList[selectedList]}
            setItems={chooseSetMethod[selectedList]}
            dappletsVersions={dappletsVersions}
            selectedDapplets={selectedDapplets}
            localDapplets={localDapplets}
            dappletsTransactions={dappletsTransactions}
            editLocalDappletsList={editLocalDappletsList}
            editSelectedDappletsList={editSelectedDappletsList}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            setAddressFilter={setAddressFilter}
          />
          : sortedDapplets
            .map((item, i) => (
              <section className={styles.item} key={i}>
                <div className={styles.itemContainer}>
                  <ItemDapplet
                    key={item.name}
                    item={item}
                    dappletsVersions={dappletsVersions}
                    selectedDapplets={selectedDapplets}
                    localDapplets={localDapplets}
                    dappletsTransactions={dappletsTransactions}
                    editLocalDappletsList={editLocalDappletsList}
                    editSelectedDappletsList={editSelectedDappletsList}
                    expandedItems={expandedItems}
                    setExpandedItems={setExpandedItems}
                    searchQuery={searchQuery}
                    setAddressFilter={setAddressFilter}
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
