import React, { useEffect, useMemo, useRef } from 'react';
import { Header } from 'semantic-ui-react';

import { saveListToLocalStorage } from '../../../lib/localStorage';

import styles from './ListDapplets.module.scss';
import SortableList from '../../../components/SortableList';
import ItemDapplet from '../../../components/ItemDapplet';
import { DappletsListItemTypes } from '../../../components/DappletsListItem/DappletsListItem'

import ProfileInList from '../../ProfileInList/ProfileInList';
import { SideLists } from '../SidePanel/SidePanel';
import { IDapplet } from '../../../models/dapplets';
import { SortTypes } from '../../../models/sort';
import { Lists, MyListElement } from '../../../models/myLists';
import { RootDispatch, RootState } from '../../../models';
import { connect } from 'react-redux';



const mapState = (state: RootState) => ({
  ensNames: state.ensNames
});
const mapDispatch = (dispatch: RootDispatch) => ({
  getEnsNames: (addresses: string[]) => dispatch.ensNames.getEnsNames(addresses)
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;
export interface ListDappletsProps {
  dapplets: IDapplet[]
  selectedDapplets: MyListElement[]
  setSelectedDapplets: any
  localDapplets: MyListElement[]
  setLocalDapplets: any
  selectedList?: Lists
  setSelectedList: any
  sortType: string
  searchQuery: string
  addressFilter: string
  setAddressFilter: any
  editSearchQuery: any
  trustedUsersList: string[]
  setTrustedUsersList: any
  isTrustedSort: boolean
  setOpenedList: any
  address: string
  trigger: boolean
  isDapplet: boolean
}

const ListDapplets = ({
  dapplets,
  setSelectedDapplets,
  selectedDapplets,
  localDapplets,
  setLocalDapplets,
  selectedList,
  setSelectedList,
  sortType,
  searchQuery,
  addressFilter,
  setAddressFilter,
  editSearchQuery,
  trustedUsersList,
  setTrustedUsersList,
  isTrustedSort,
  setOpenedList,
  address,
  trigger,
  isDapplet,

  ensNames,
  getEnsNames,
}: ListDappletsProps & Props): React.ReactElement => {
  const ref = useRef<HTMLDivElement>(null)

  const collator = useMemo(() => (
    new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'})
  ), []) 

  const editList = useMemo(() => (
    (item: IDapplet, dappletsList: MyListElement[], type: DappletsListItemTypes) => {
      const isLocalDapplet = dappletsList.some((dapplet) => dapplet.name === item.name);
      const nowDappletsList = isLocalDapplet
        ? dappletsList
          .filter((dapplet) => dapplet.name !== item.name)
        : [{name: item.name, type}, ...dappletsList];
      const newDappletsList: MyListElement[] = nowDappletsList;
      return newDappletsList
    } 
  ), [])

  const editLocalDappletsList = useMemo(() => (
    (item: IDapplet) => {
      setOpenedList(SideLists.MyDapplets)
      const newLocalDappletsList = editList(item, localDapplets, DappletsListItemTypes.Default)
      setLocalDapplets(newLocalDappletsList);
      saveListToLocalStorage(newLocalDappletsList, Lists.MyDapplets);
    }
  ), [editList, localDapplets, setLocalDapplets, setOpenedList]);

  const editSelectedDappletsList = useMemo(() => (
    (item: IDapplet) => {
      setOpenedList(SideLists.MyListing)
      
      let nowDappletsList: MyListElement[] = selectedDapplets
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
      const newDappletsList: MyListElement[] = nowDappletsList;
      saveListToLocalStorage(newDappletsList, Lists.MyListing);
      setSelectedDapplets(newDappletsList);
    }
  ), [selectedDapplets, setOpenedList, setSelectedDapplets]);

  const titleText = useMemo(() => {
    if (selectedList) {
      switch (selectedList) {
        case Lists.MyDapplets:
          return 'My Dapplets'
        case Lists.MyListing:
          return 'My Listing'
        default:
          return ''
      }
    }
    if (searchQuery) return 'Search Result'
    if (addressFilter) {
      if (!ensNames[addressFilter]) getEnsNames([addressFilter])
      return ensNames[addressFilter] || 'User Listing'
    }
    if (isTrustedSort) return 'Dapplets from my trusted users'
    return 'All Dapplets'
  }, [addressFilter, ensNames, getEnsNames, isTrustedSort, searchQuery, selectedList])

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
    if (isTrustedSort && !isDapplet)
      sortedList = sortedList.filter(({ trustedUsers }) => trustedUsersList.some((user) => trustedUsers.includes(user)))
    return sortedList
  }, [addressFilter, collator, dapplets, isDapplet, isTrustedSort, selectedList, sortType, trustedUsersList])

  const chooseList = {
    [Lists.MyListing]: selectedDapplets,
    [Lists.MyDapplets]: localDapplets,
  }

  const chooseSetMethod = {
    [Lists.MyListing]: setSelectedDapplets,
    [Lists.MyDapplets]: setLocalDapplets,
  }

  useEffect(() => {
    console.log({r: ref})//  ref!.current!.scrollTop = 0;
    ref?.current?.scrollTo(0, 0);
  }, [
    searchQuery,
    addressFilter,
    isTrustedSort,
    selectedList,
    sortType,
    trigger,
    ref,
  ])

  return (
    <article
      style={{
        position: 'static',
        padding: '0 !important',
        margin: '0 !important',
      }}
    >
      <div
        ref={ref}
        style={{
          height: 'calc(100vh - 206px)',
          overflow: 'auto',
          padding: '0 !important',
          margin: '0 !important',
        }}

      >
        {listDappletsHeader}
        {
          (addressFilter !== '' || selectedList) && selectedList !== Lists.MyDapplets &&
          <ProfileInList
            myAddress={address}
            address={addressFilter !== '' ? addressFilter : address}
            setAddressFilter={setAddressFilter}
            editSearchQuery={editSearchQuery}
            setSelectedList={setSelectedList}
            trustedUsersList={trustedUsersList}
            setTrustedUsersList={setTrustedUsersList}
          />
        }
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
            setAddressFilter={setAddressFilter}
            addressFilter={addressFilter}
            setOpenedList={setOpenedList}
            searchQuery={searchQuery}
            trustedUsersList={trustedUsersList}
            isTrustedSort={isTrustedSort}
            selectedList={selectedList}
            isDapplet={isDapplet}
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
                    searchQuery={searchQuery}
                    setAddressFilter={setAddressFilter}
                    setOpenedList={setOpenedList}
                    trustedUsersList={trustedUsersList}
                    isDapplet={isDapplet}
                  />
                </div>
              </section>
            )
          )}
      </div>
    </article>
  );
}

export default connect(mapState, mapDispatch)(ListDapplets);
