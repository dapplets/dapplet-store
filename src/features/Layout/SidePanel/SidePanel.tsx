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
import { EventPushing, EventType } from "../../../models/dapplets";

const mapState = (state: RootState) => ({
  address: state.user.address,
  provider: state.user.provider,
  isLocked: state.user.isLocked,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setModalOpen: (payload: ModalsList | null) => dispatch.modals.setModalOpen(payload),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  pushMyListing: (payload: {events: EventPushing[], provider: any}) => dispatch.dapplets.pushMyListing(payload),
  setLocked: (payload: boolean) => dispatch.user.setUser({
    isLocked: payload
  }),
});

const Wrapper = styled.aside`
	padding: 0 40px;
  padding-bottom: 50px;

  display: grid;
  grid-template-rows: 1fr max-content;
  /* & > div { */
    /* margin-top: 28px;
  } */
`

const ListWrapper = styled.div`
  display: grid;
  grid-row-gap: 30px;
  grid-template-rows: repeat(4, max-content);
  padding-top: 42px;
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
  provider,
  isLocked,
  setSort,
  setModalOpen,
  pushMyListing,
  setLocked,
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

  const pushSelectedDappletsList = async () => {
    const events: EventPushing[] = []
    const nowDappletsList: MyListElement[] = selectedDappletsList.map((dapplet) => {
      if (dapplet.type === DappletsListItemTypes.Adding) {
        events.push({
          eventType: EventType.ADD,
          dappletId: dapplet.id,
        })
        return {
          ...dapplet,
          type: DappletsListItemTypes.Default
        }
      }
      return dapplet
    })
    const newDappletsList: MyListElement[] = nowDappletsList.filter(({ type, name, id }) => {
      if (type === DappletsListItemTypes.Removing) {
        events.push({
          eventType: EventType.REMOVE,
          dappletId: id,
        })
      }
      return type !== DappletsListItemTypes.Removing
    })
    try {
      setLocked(true)
      await pushMyListing({events, provider});
      saveListToLocalStorage(newDappletsList, Lists.MyListing);
      setSelectedDappletsList(newDappletsList);
    } catch (error) {
      console.error({error})
    }
    setLocked(false)
  };

	return (
		<Wrapper className={className}>
      <ListWrapper>
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
          isPushing={isLocked}
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
      </ListWrapper>

      {/* <Footer>
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
        <p>© 2019—2022 Dapplets Project</p>
      </Footer> */}

		</Wrapper>
	);
}

export default connect(mapState, mapDispatch)(SidePanel);
