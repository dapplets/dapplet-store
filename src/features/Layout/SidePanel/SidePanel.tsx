import React, { DetailedHTMLProps, HTMLAttributes } from 'react';

import { saveListToLocalStorage } from '../../../lib/localStorage';
import DappletsListSidebar from '../../../components/DappletsListSidebar/DappletsListSidebar'
import { DappletsListItemTypes } from '../../../components/DappletsListItem/DappletsListItem'
import { RootDispatch, RootState } from '../../../models';
import { Sort } from '../../../models/sort';
import { connect } from 'react-redux';
import { ModalsList } from '../../../models/modals';
import { IDapplet } from '../../../models/dapplets';
import styled from 'styled-components';
import { Lists, MyListElement } from '../../../models/myLists';

const mapState = (state: RootState) => ({
  address: state.user.address,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setModalOpen: (payload: ModalsList | null) => dispatch.modals.setModalOpen(payload),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  addTrustedUserToDappletEffect: (payload: {name: string, address: string}) => dispatch.dapplets.addTrustedUserToDappletEffect(payload),
  removeTrustedUserFromDappletEffect: (payload: {name: string, address: string}) => dispatch.dapplets.removeTrustedUserFromDappletEffect(payload),
});

const Wrapper = styled.aside`
  padding-bottom: 50px;
  position: fixed;
  left: 0;
  top: 130px;
  height: 100%;
  width: 430px;
	padding: 0 40px;
  & > div {
    margin-top: 28px;
  }
`

const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;

  & > a {
    color: inherit;
    margin-right: 10px;

    &:hover {
      text-decoration: underline;
    }
  }
`

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

export enum SideLists {
  MyDapplets = 'My dapplets',
  MyListing = 'My listing',
  MyTrustedUsers = 'My trusted users',
}
export interface SidePanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  localDappletsList: MyListElement[]
  setLocalDappletsList: any
  setSelectedList: React.Dispatch<React.SetStateAction<Lists | undefined>>
  selectedDappletsList: MyListElement[]
  setSelectedDappletsList: any
  trustedUsersList: string[]
  setAddressFilter: any
  openedList: any
  setOpenedList: any
  dapplets: IDapplet[]
}

const SidePanel = ({
  className,
  localDappletsList,
  setLocalDappletsList,
  selectedDappletsList,
  setSelectedDappletsList,
  trustedUsersList,
  openedList,
  setOpenedList,
  dapplets,
  address,
  setSort,
  setModalOpen,
  addTrustedUserToDappletEffect,
  removeTrustedUserFromDappletEffect,
}: SidePanelProps & Props): React.ReactElement => {

  const removeFromLocalList = (name: string) => (e: any) => {
    e.preventDefault();
    const list = localDappletsList
      .filter((dapp) => dapp.name !== name);
    const newLocalDappletsList: MyListElement[] = list;
    saveListToLocalStorage(newLocalDappletsList, Lists.MyDapplets);
    setLocalDappletsList(newLocalDappletsList);
  }

  const removeFromSelectedList = (name: string) => (e: any) => {
    e.preventDefault();
    const dappletListIndex = selectedDappletsList.findIndex((dapplet) => dapplet.name === name);
    let list = selectedDappletsList
    if (selectedDappletsList[dappletListIndex].type === DappletsListItemTypes.Removing)
      list[dappletListIndex].type = DappletsListItemTypes.Default
    if (selectedDappletsList[dappletListIndex].type === DappletsListItemTypes.Adding)
      list = list.filter((dapp) => dapp.name !== name);
    const newSelectedDappletsList: MyListElement[] = list;
    saveListToLocalStorage(newSelectedDappletsList, Lists.MyListing);
    setSelectedDappletsList(newSelectedDappletsList);
  }

  const pushSelectedDappletsList = () => {
    const nowDappletsList: MyListElement[] = selectedDappletsList.map((dapplet) => {
      if (dapplet.type === DappletsListItemTypes.Adding) {
        addTrustedUserToDappletEffect({
          name: dapplet.name,
          address: address || "",
        })
        return {
          ...dapplet,
          type: DappletsListItemTypes.Default
        }
      }
      return dapplet
    })
    const newDappletsList: MyListElement[] = nowDappletsList.filter(({ type, name }) => {
      if (type === DappletsListItemTypes.Removing) {
        removeTrustedUserFromDappletEffect({
          name,
          address: address || "",
        })
      }
      return type !== DappletsListItemTypes.Removing
    })
    saveListToLocalStorage(newDappletsList, Lists.MyListing);
    setSelectedDappletsList(newDappletsList);
  };

	return (
		<Wrapper className={className}>
      <DappletsListSidebar
        dappletsList={localDappletsList.slice(0, 5).map((dapplet) => ({
          title: dapplets.find(({ name }) => dapplet.name === name)?.title || '',
          type: dapplet.type,
          onClickRemove: () => removeFromLocalList(dapplet.name),
          isRemoved: true,
        }))}
        title={SideLists.MyDapplets}
        onOpenList={() => {
          setSort({
            selectedList: Lists.MyDapplets,
            addressFilter: "",
          });
        }}
        isMoreShow={localDappletsList.length > 0}
        isOpen={SideLists.MyDapplets === openedList}
        setIsOpen={setOpenedList}
      />

      <DappletsListSidebar
        dappletsList={selectedDappletsList.slice(0, 5).map((dapplet) => ({
          title: dapplets.find(({ name }) => dapplet.name === name)?.title || '',
          type: dapplet.type,
          onClickRemove: () => removeFromSelectedList(dapplet.name),
          isRemoved: dapplet.type !== DappletsListItemTypes.Default,
        }))}
        title={SideLists.MyListing}
        onOpenList={() => {
          if (!address) {
            setModalOpen(ModalsList.Login)
            return
          }
          setSort({
            selectedList: Lists.MyListing,
            addressFilter: "",
          });
        }}
        isMoreShow={selectedDappletsList.length > 0}
        titleButton={selectedDappletsList.find(({ type }) => type !== DappletsListItemTypes.Default) && {
          title: 'Push changes',
          onClick: pushSelectedDappletsList
        }}
        isOpen={SideLists.MyListing === openedList}
        setIsOpen={setOpenedList}
      />
      <DappletsListSidebar
        dappletsList={trustedUsersList.map((user) => ({
          title: user.replace('0x000000000000000000000000', '0x'),
          subTitle: `${user.replace('0x000000000000000000000000', '0x').slice(0, 6)}...${user.replace('0x000000000000000000000000', '0x').slice(-4)}`,
          id: user,
          type: DappletsListItemTypes.Default,
          onClickRemove: () => {},
          isRemoved: false,
        }))}
        title={SideLists.MyTrustedUsers}
        onOpenList={() => {}}
        isMoreShow={false}
        onElementClick={(id: string) => 
          setSort({
            addressFilter: id,
            selectedList: undefined,
          })}
        isOpen={SideLists.MyTrustedUsers === openedList}
        setIsOpen={setOpenedList}
      />

      <DappletsListSidebar
        dappletsList={[]}
        title={`Popular tags`}
        onOpenList={() => {}}
        isMoreShow={false}
        isOpen={false}
        setIsOpen={setOpenedList}
      />

      <Footer>
        <a href='https://dapplets.org/terms-conditions.html'>
          Terms & Conditions
        </a>
        <a href='https://dapplets.org/privacy-policy.html'>
          Privacy Policy
        </a>
        <a href='https://dapplets.org/index.html'>
          About
        </a>
        <a href='https://forum.dapplets.org'>
          Forum
        </a>
        <a href='https://docs.dapplets.org'>
          Docs
        </a>
        <p>© 2019—2021 Dapplets Project</p>
      </Footer>

		</Wrapper>
	);
}

export default connect(mapState, mapDispatch)(SidePanel);