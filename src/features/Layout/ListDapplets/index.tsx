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
import { Sort, SortTypes } from '../../../models/sort';
import { Lists, MyListElement } from '../../../models/myLists';
import { RootDispatch, RootState } from '../../../models';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Dropdown from '../Dropdown/Dropdown';
import Input from '../Input';



const MainContentWrapper = styled.div`
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
    background: ${({ isTrustedSort }) => isTrustedSort ?  '#ffffff' : '#ffffff'};
    border-radius: 50%;
    margin-top: 2px;
    border:  ${({ isTrustedSort }) => isTrustedSort ?  '5px solid #D9304F' : '1px solid #919191'};
    position: relative;
  }
`

const ButtonAll = styled.div`
  grid-area: all;
  justify-self: end;
  align-self: end;
  background: none;

  & button {
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0em;
    text-align: center;
    padding: 10px;
    cursor: pointer;
    border: none;
    background: none;
  }

`

const dropdownItems = [
  {
    id: 1,
    text: SortTypes.ABC,
  },
  {
    id: 2,
    text: SortTypes.ABCReverse,
  },
  {
    id: 3,
    text: SortTypes.Newest,
  },
  {
    id: 4,
    text: SortTypes.Oldest,
  }
];

const mapState = (state: RootState) => ({
  ensNames: state.ensNames,
  trustedUsers: state.trustedUsers.trustedUsers,
  isLocked: state.user.isLocked,
});
const mapDispatch = (dispatch: RootDispatch) => ({
  getEnsNames: (addresses: string[]) => dispatch.ensNames.getEnsNames(addresses),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  addTrustedUser: (payload: string) => dispatch.trustedUsers.addTrustedUser(payload),
  removeTrustedUser: (payload: string) => dispatch.trustedUsers.removeTrustedUser(payload),
  addMyDapplet: (payload: {registryUrl: string, moduleName: string}) => dispatch.myLists.addMyDapplet(payload),
  removeMyDapplet: (payload: {registryUrl: string, moduleName: string}) => dispatch.myLists.removeMyDapplet(payload),
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
  isNotDapplet: boolean
  setModalOpen: any,
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
  isNotDapplet,
  setModalOpen,

  ensNames,
  trustedUsers,
  isLocked,
  getEnsNames,
  setSort,
  addTrustedUser,
  removeTrustedUser,
  addMyDapplet,
  removeMyDapplet,
}: ListDappletsProps & Props): React.ReactElement => {
  const ref = useRef<HTMLDivElement>(null)

  const collator = useMemo(() => (
    new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'})
  ), []) 

  const editList = useMemo(() => (
    (item: IDapplet, dappletsList: MyListElement[], type: DappletsListItemTypes) => {
      const isLocalDapplet = dappletsList.some((dapplet) => dapplet.name === item.name);
      let nowDappletsList;
      if (isLocalDapplet) {
        nowDappletsList = dappletsList.filter((dapplet) => dapplet.name !== item.name)
        removeMyDapplet({
          registryUrl: '',
          moduleName: item.name,
        })
      } else {
        nowDappletsList = [{name: item.name, type, id: item.id}, ...dappletsList]
        addMyDapplet({
          registryUrl: '',
          moduleName: item.name,
        })
      }
      const newDappletsList: MyListElement[] = nowDappletsList;
      return newDappletsList
    } 
  ), [addMyDapplet, removeMyDapplet])

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
        nowDappletsList = [{name: item.name, type: DappletsListItemTypes.Adding, id: item.id}, ...nowDappletsList]
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

  const listDappletsHeader = useMemo(() => (
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
      {
        titleText === 'My Dapplets' && (
          <ButtonAll>
            <button onClick={() => {
              setAddressFilter('')
              editSearchQuery('')
              setSelectedList(undefined)
            }}>
              Show All
            </button>
          </ButtonAll>
        )
      }
    </div>
  ), [editSearchQuery, setAddressFilter, setSelectedList, titleText]);

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
    if (searchQuery !== '')
      sortedList = sortedList.filter((dapplet) => (
        dapplet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dapplet.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dapplet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dapplet.description.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    if (addressFilter !== '') 
      sortedList = sortedList.filter(({ trustedUsers }) => trustedUsers.includes(addressFilter))
    if (isTrustedSort && !isNotDapplet)
      sortedList = sortedList.filter(({ trustedUsers }) => trustedUsersList.some((user) => trustedUsers.includes(user)))
    // console.debug('sortedDapplets', sortedList)
    return sortedList
  }, [addressFilter, collator, dapplets, isNotDapplet, isTrustedSort, searchQuery, selectedList, sortType, trustedUsersList])

  useEffect(() => {
    console.debug({dapplets})
  }, [dapplets])

  const chooseList = useMemo(() => ({
    [Lists.MyListing]: selectedDapplets,
    [Lists.MyDapplets]: localDapplets,
  }), [localDapplets, selectedDapplets])

  const chooseSetMethod = useMemo(() => ({
    [Lists.MyListing]: setSelectedDapplets,
    [Lists.MyDapplets]: setLocalDapplets,
  }), [setLocalDapplets, setSelectedDapplets])

  useEffect(() => {
    // console.log({r: ref})//  ref!.current!.scrollTop = 0;
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
          height: 'calc(100vh - 51px)',
          overflow: 'auto',
          padding: '0 !important',
          margin: '0 !important',
        }}

      >
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
            isNotDapplet={isNotDapplet}
            setModalOpen={setModalOpen}
            title={titleText}
            addTrustedUser={addTrustedUser}
            removeTrustedUser={removeTrustedUser}
          />
        }
        <MainContentWrapper>
          <Input 
            searchQuery={searchQuery || ""}
            editSearchQuery={(newSearchQuery: string | undefined) => setSort({ searchQuery: newSearchQuery})}
          />
          {
            !selectedList &&
            <Dropdown 
              items={dropdownItems}
              active={sortType || SortTypes.ABC}
              setActive={(newSortType: SortTypes) => setSort({ sortType: newSortType})}
            />
          }
          {
            !isNotDapplet && !trustedUsers.includes(addressFilter || "") &&
            <CheckboxWrapper isTrustedSort={isTrustedSort || false} onClick={() => setSort({isTrustedSort: !isTrustedSort})}>
              <div></div>
              <span>From trusted users</span>
            </CheckboxWrapper>
          }
        </MainContentWrapper>
        {!((addressFilter !== '' || selectedList) && selectedList !== Lists.MyDapplets) && listDappletsHeader}
        {selectedList && !isLocked
          // ? <></>
          ? <SortableList
            dapplets={sortedDapplets}
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
            isNotDapplet={isNotDapplet}
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
                    isNotDapplet={isNotDapplet}
                  />
                </div>
              </section>
            )
          )}
      </div>
    </article>
  );
}

export default connect(mapState, mapDispatch)(React.memo(ListDapplets));
