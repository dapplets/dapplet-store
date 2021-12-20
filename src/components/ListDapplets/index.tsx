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
  trustedUsersList,
  setTrustedUsersList,
  isTrustedSort,
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
      switch (nowDappletsList[dappletListIndex].type) {
        default:
        case DappletsListItemTypes.Default:
          nowDappletsList[dappletListIndex].type = DappletsListItemTypes.Removing
          break;
        case DappletsListItemTypes.Removing:
          nowDappletsList[dappletListIndex].type = DappletsListItemTypes.Default
          break;
        case DappletsListItemTypes.Adding:
          nowDappletsList.splice(dappletListIndex, 1)
          break;
      }
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
          return collator.compare(dappletsTransactions[b.name], dappletsTransactions[a.name]);
        case SortTypes.Oldest:
          return collator.compare(dappletsTransactions[a.name], dappletsTransactions[b.name]);
        default:
          return 0;
      }
    });
    if (addressFilter !== '') 
      sortedList = sortedList.filter(({ owner }) => owner === addressFilter)
    if (isTrustedSort)
      sortedList = sortedList.filter(({ owner }) => trustedUsersList.includes(owner))
    return sortedList
  }, [addressFilter, collator, dapplets, dappletsTransactions, isTrustedSort, selectedList, sortType, trustedUsersList])

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
            addressFilter={addressFilter}
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
