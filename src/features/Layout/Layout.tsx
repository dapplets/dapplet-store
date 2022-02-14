import React, { useMemo } from 'react';
import { IDapplet } from '../../models/dapplets';
import Header from './Header/Header';
import Overlay from './Overlay/Overlay';
import SidePanel from './SidePanel/SidePanel';

import styled from 'styled-components';
import ListDapplets from './ListDapplets';
import { Sort, SortTypes } from '../../models/sort';
import { RootDispatch, RootState } from '../../models';
import { connect } from 'react-redux';
import { Lists, MyListElement } from '../../models/myLists';
import { ModalsList } from '../../models/modals';

interface WrapperProps {
  isSmall: boolean
}

const Wrapper = styled.div<WrapperProps>`
  display: grid;

  height: 100%;

  grid-template-columns: 430px 1fr 430px;
  grid-template-rows: 51px 1fr;

  grid-template-areas:
    "header header header"
    ${({ isSmall }) => `"sidePanel content ${isSmall ? 'content' : 'overlay'}"`};
`

const StyledHeader = styled(Header)`
  grid-area: header;
`

const StyledSidePanel = styled(SidePanel)`
  background-color: #F5F5F5;
	grid-area: sidePanel;
`

const MainContent = styled.main`
	grid-area: content;

  padding: 0 !important;
  width: 100%;
`

const StyledOverlay = styled(Overlay)`
  grid-area: overlay;
`

const mapState = (state: RootState) => ({
  dapplets: Object.values(state.dapplets),
  sortType: state.sort.sortType,
  addressFilter: state.sort.addressFilter,
  searchQuery: state.sort.searchQuery,
  selectedList: state.sort.selectedList,
  isTrustedSort: state.sort.isTrustedSort,
  trigger: state.sort.trigger,
  address: state.user.address,
  trustedUsers: state.trustedUsers.trustedUsers,
  myLists: state.myLists,
});
const mapDispatch = (dispatch: RootDispatch) => ({
  setModalOpen: (payload: ModalsList | null) => dispatch.modals.setModalOpen(payload),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setTrustedUsers: (payload: string[]) => dispatch.trustedUsers.setTrustedUsers(payload),
  setMyList: (payload: {name: Lists, elements: MyListElement[]}) => dispatch.myLists.setMyList(payload),
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

// const NoneOfTrustedSort = ({setSort}: {setSort: any}) => {
//   useEffect(() => {
//     setSort({isTrustedSort: false})
//   }, [setSort])
//   return <></>
// }

export interface LayoutProps {
  selectedList?: Lists
  setSelectedList: any
  trustedUsersList: string[]
  setAddressFilter: any
  openedList: any
  setOpenedList: any
  windowWidth: number
  isDapplet: boolean
}

const Layout = ({
  setSelectedList,
  trustedUsersList,
  setAddressFilter,
  openedList,
  setOpenedList,
  windowWidth,
  isDapplet,
  
  dapplets,
  sortType,
  addressFilter,
  searchQuery,
  selectedList,
  isTrustedSort,
  trigger,
  address,
  trustedUsers,
  myLists,
  setModalOpen,
  setSort,
  setTrustedUsers,
  setMyList,
}: LayoutProps & Props): React.ReactElement<LayoutProps> => {
  // console.log({isDapplet})

  const localDappletsList = myLists[Lists.MyDapplets]
  const setLocalDappletsList = (elements: MyListElement[]) => setMyList({
    name: Lists.MyDapplets,
    elements,
  })
  const selectedDappletsList = myLists[Lists.MyListing]
  const setSelectedDappletsList = (elements: MyListElement[]) => setMyList({
    name: Lists.MyListing,
    elements,
  })

  const dappletsByList = useMemo(() => {
    if (!dapplets || !selectedList) return dapplets;
    const dapps = myLists[selectedList];
    return dapps
      .map((dapplet) => dapplets.find((dapp) => dapp.name === dapplet.name))
      .filter((dapp): dapp is IDapplet => !!dapp);

  }, [dapplets, myLists, selectedList])
  
  return (
    <Wrapper isSmall={windowWidth <= 1500}>
      <StyledHeader
        selectedList={selectedList}
        isDapplet={isDapplet}
      />
      <StyledSidePanel
        localDappletsList={localDappletsList}
        setLocalDappletsList={setLocalDappletsList}
        selectedDappletsList={selectedDappletsList}
        setSelectedDappletsList={setSelectedDappletsList}
        setSelectedList={setSelectedList}
        trustedUsersList={trustedUsersList}
        setAddressFilter={setAddressFilter}
        openedList={openedList}
        setOpenedList={setOpenedList}
        dapplets={dapplets}
      />

			<MainContent>
        {dappletsByList && <ListDapplets
          dapplets={dappletsByList}
          selectedDapplets={selectedDappletsList}
          setSelectedDapplets={setSelectedDappletsList}
          localDapplets={localDappletsList}
          setLocalDapplets={setLocalDappletsList}
          selectedList={selectedList}
          setSelectedList={(newSelectedList: Lists | undefined) => setSort({ selectedList: newSelectedList, searchQuery: "" })}
          sortType={sortType || SortTypes.ABC}
          searchQuery={searchQuery || ""}
          editSearchQuery={(newtSearchQuery: string) => setSort({ searchQuery: newtSearchQuery })}
          addressFilter={addressFilter || ""}
          setAddressFilter={(newAddressFilter: string) => setSort({ addressFilter: newAddressFilter })}
          trustedUsersList={trustedUsers}
          setTrustedUsersList={setTrustedUsers}
          isTrustedSort={isTrustedSort || false}
          setOpenedList={setOpenedList}
          address={address || ""}
          trigger={trigger || false}
          isDapplet={isDapplet}
          setModalOpen={setModalOpen}
        />}
			</MainContent>

      {
        windowWidth > 1500 && <StyledOverlay isDapplet={isDapplet}/>
      }
		</Wrapper>
	);
}

export default connect(mapState, mapDispatch)(Layout);
