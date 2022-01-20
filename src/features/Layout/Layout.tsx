import React, { useMemo } from 'react';
import { IDappletsList, Lists } from '../../config/types';
import { IDapplet } from '../../models/dapplets';
import Header from './Header/Header';
import Overlay from './Overlay/Overlay';
import SidePanel from './SidePanel/SidePanel';

import styled from 'styled-components';
import ListDapplets from './ListDapplets';
import { Sort, SortTypes } from '../../models/sort';
import Input from './Input';
import Dropdown from './Dropdown/Dropdown';
import { RootDispatch, RootState } from '../../models';
import { connect } from 'react-redux';

const Wrapper = styled.div`
  display: grid;

  min-height: 100vh;

  grid-template-columns: 430px 1fr 430px;
  grid-template-rows: 130px 1fr;

  grid-template-areas:
    "header header header"
    "sidePanel content overlay";
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
  dapplets: Object.values(state.dapplets),
  sortType: state.sort.sortType,
  addressFilter: state.sort.addressFilter,
  searchQuery: state.sort.searchQuery,
  selectedList: state.sort.selectedList,
  isTrustedSort: state.sort.isTrustedSort,
  address: state.user.address,
  trustedUsers: state.trustedUsers.trustedUsers
});
const mapDispatch = (dispatch: RootDispatch) => ({
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setTrustedUsers: (payload: string[]) => dispatch.trustedUsers.setTrustedUsers(payload),
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

export interface LayoutProps {
  selectedDappletsList: IDappletsList
  setSelectedDappletsList: any
  localDappletsList: IDappletsList
  setLocalDappletsList: React.Dispatch<React.SetStateAction<IDappletsList>>
  selectedList?: Lists
  setSelectedList: any
  trustedUsersList: string[]
  setAddressFilter: any
  openedList: any
  setOpenedList: any
}

const Layout = ({
  selectedDappletsList,
  setSelectedDappletsList,
  localDappletsList,
  setLocalDappletsList,
  setSelectedList,
  trustedUsersList,
  setAddressFilter,
  openedList,
  setOpenedList,
  
  dapplets,
  sortType,
  addressFilter,
  searchQuery,
  selectedList,
  isTrustedSort,
  address,
  trustedUsers,
  setSort,
  setTrustedUsers,
}: LayoutProps & Props): React.ReactElement<LayoutProps> => {

  

  const dappletsByList = useMemo(() => {
    if (!dapplets || !selectedList) return dapplets;
    const chooseDappletsList = {
      [Lists.Local]: localDappletsList,
      [Lists.Selected]: selectedDappletsList,
    };
    const dapps = chooseDappletsList[selectedList];
    return dapps.dapplets
      .map((dapplet) => dapplets.find((dapp) => dapp.name === dapplet.name))
      .filter((dapp): dapp is IDapplet => !!dapp);

  }, [dapplets, localDappletsList, selectedDappletsList, selectedList])
  
  return (
    <Wrapper>
      <StyledHeader
        selectedList={selectedList}
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
          <CheckboxWrapper isTrustedSort={isTrustedSort || false} onClick={() => setSort({isTrustedSort: !isTrustedSort})}>
            <div>{isTrustedSort && <div></div>}</div>
            <span>From trusted users</span>
          </CheckboxWrapper>
        </MainContentWrapper>
        {dappletsByList && <ListDapplets
          dapplets={dappletsByList}
          selectedDapplets={selectedDappletsList}
          setSelectedDapplets={setSelectedDappletsList}
          localDapplets={localDappletsList}
          setLocalDapplets={setLocalDappletsList}
          selectedList={selectedList}
          setSelectedList={(newSelectedList: Lists | undefined) => setSort({ selectedList: newSelectedList })}
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
        />}
			</MainContent>

			<StyledOverlay/>
		</Wrapper>
	);
}

export default connect(mapState, mapDispatch)(Layout);
