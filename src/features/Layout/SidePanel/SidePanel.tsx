import React, { DetailedHTMLProps, HTMLAttributes, useEffect, useMemo } from 'react';

import { saveListToLocalStorage } from '../../../lib/localStorage';
import DappletsListSidebar from '../../../components/DappletsListSidebar/DappletsListSidebar'
import { DappletsListItemTypes } from '../../../components/DappletsListItem/DappletsListItem'
import { RootDispatch, RootState } from '../../../models';
import { Sort } from '../../../models/sort';
import { connect } from 'react-redux';
import { Modals, ModalsList } from '../../../models/modals';
import { IDapplet } from '../../../models/dapplets';
import styled from 'styled-components';
import { Lists, MyListElement } from '../../../models/myLists';
import { EventPushing, EventType } from "../../../models/dapplets";

const mapState = (state: RootState) => ({
  address: state.user.address,
  provider: state.user.provider,
  isLocked: state.user.isLocked,
  myOldListing: state.myLists[Lists.MyOldListing],
  myListing: state.myLists[Lists.MyListing],
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setModalOpen: (payload: Modals) => dispatch.modals.setModalOpen(payload),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  pushMyListing: (payload: { address: string, events: EventPushing[], provider: any, dappletsNames: { [name: number]: string } }) => dispatch.dapplets.pushMyListing(payload),
  setLocked: (payload: boolean) => dispatch.user.setUser({
    isLocked: payload
  }),
  removeMyDapplet: (payload: { registryUrl: string, moduleName: string }) => dispatch.myLists.removeMyDapplet(payload),
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

// const Footer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   font-size: 12px;

//   & > a {
//     color: inherit;
//     margin-right: 10px;

//     &:hover {
//       text-decoration: underline;
//     }
//   }
// `

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
  myOldListing,
  myListing,
  setSort,
  setModalOpen,
  pushMyListing,
  setLocked,
  removeMyDapplet,
}: SidePanelProps & Props): React.ReactElement => {

  const removeFromLocalList = (name: string) => (e: any) => {
    e.preventDefault();
    const list = localDappletsList
      .filter((dapp) => dapp.name !== name);
    const newLocalDappletsList: MyListElement[] = list;
    saveListToLocalStorage(newLocalDappletsList, Lists.MyDapplets);
    setLocalDappletsList(newLocalDappletsList);
    removeMyDapplet({
      registryUrl: '',
      moduleName: name,
    })
  }

  const removeFromSelectedList = (name: string) => (e: any) => {
    e.preventDefault();
    const dappletListIndex = selectedDappletsList.findIndex((dapplet) => dapplet.name === name);
    let list = selectedDappletsList
    console.log({ sl: selectedDappletsList[dappletListIndex] })

    if (selectedDappletsList[dappletListIndex].type === DappletsListItemTypes.Removing) {
      list[dappletListIndex].type = DappletsListItemTypes.Default
    }

    if (selectedDappletsList[dappletListIndex].type === DappletsListItemTypes.Adding) {
      list = list.filter((dapp) => dapp.name !== name);
    }

    if (selectedDappletsList[dappletListIndex].event !== undefined) {
      if (list[dappletListIndex].eventPrev !== undefined) {
        if (list[dappletListIndex].eventPrev !== 0) {
          const swapId = list.findIndex(({ id }) => id === list[dappletListIndex].eventPrev)
          const swap = list[dappletListIndex]
          console.log({ swap, swapId })
          list[dappletListIndex] = list[swapId];
          list[swapId] = swap;
          list[swapId].event = undefined
          list[swapId].eventPrev = undefined
        } else {
          const swap = list[dappletListIndex]
          list.splice(dappletListIndex, 1)
          list.unshift(swap)
          list[0].event = undefined
          list[0].eventPrev = undefined
        }
      }
    }
    const newSelectedDappletsList: MyListElement[] = list;
    saveListToLocalStorage(newSelectedDappletsList, Lists.MyListing);
    setSelectedDappletsList(newSelectedDappletsList);
  }

  const dappletsStandard = useMemo(() => Object.values(dapplets), [dapplets])

  useEffect(() => {
    console.log({ myOldListing })
  }, [myOldListing])

  useEffect(() => {
    console.log({ myListing })
  }, [myListing])

  const pushSelectedDappletsList = async () => {
    const events: EventPushing[] = []
    const nowDappletsList: MyListElement[] = selectedDappletsList.filter((dapplet) => {
      if (dapplet.type === DappletsListItemTypes.Adding) {
        events.push({
          eventType: EventType.ADD,
          dappletId: dapplet.id,
        })
      }
      return dapplet.type !== DappletsListItemTypes.Adding
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

    const listingOld = {}
    myOldListing.forEach((dapp) => {

    })

    myListing.filter(({ type }) => (
      type !== DappletsListItemTypes.Removing && type !== DappletsListItemTypes.Adding
    )).forEach((dapp, index) => {
      if (dapp.id !== myOldListing[index].id) {
        events.push({
          eventType: EventType.REPLACE,
          dappletId: dapp.id,
          dappletPrevId: index === 0 ? 0 : newDappletsList[index - 1].id,
        })
      }
    })


    try {
      const dappletsNames: { [name: number]: string } = {}

      dappletsStandard.forEach(({ id, name }) => {
        dappletsNames[id] = name
      })
      setLocked(true)
      await pushMyListing({ address: address || '', events, provider, dappletsNames });
      // saveListToLocalStorage(newDappletsList, Lists.MyListing);
      // setSelectedDappletsList(newDappletsList);
    } catch (error) {
      console.error({ error })
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
            id: dapplet.id.toString(),
            onClickRemove: () => removeFromLocalList(dapplet.name),
            isRemoved: true,
          }))}
          title={SideLists.MyDapplets}
          onOpenList={() => {
            setSort({
              selectedList: Lists.MyDapplets,
              addressFilter: "",
              searchQuery: "",
            });
          }}
          isMoreShow={localDappletsList.length > 0}
          isOpen={SideLists.MyDapplets === openedList}
          setIsOpen={setOpenedList}
        />

        <DappletsListSidebar
          dappletsList={
            selectedDappletsList
              .slice(0, 5)
              .map((dapplet) => ({
                title: dapplets.find(({ name }) => dapplet.name === name)?.title || '',
                type: dapplet.type === DappletsListItemTypes.Default
                  && dapplet.event !== undefined
                  ? DappletsListItemTypes.Moved
                  : dapplet.type,
                id: dapplet.id.toString(),
                onClickRemove: () => removeFromSelectedList(dapplet.name),
                isRemoved: dapplet.type !== DappletsListItemTypes.Default
                  || dapplet.event !== undefined,
              }))}
          title={SideLists.MyListing}
          isPushing={isLocked}
          onOpenList={() => {
            if (!address) {
              setModalOpen({ openedModal: ModalsList.Login, settings: null })
              return
            }
            setSort({
              selectedList: Lists.MyListing,
              addressFilter: "",
              searchQuery: "",
            });
          }}
          isMoreShow={selectedDappletsList.length > 0}
          titleButton={selectedDappletsList.find(({ type, event }) => type !== DappletsListItemTypes.Default || event !== undefined) && {
            title: 'Push changes',
            onClick: pushSelectedDappletsList
          }}
          isOpen={SideLists.MyListing === openedList}
          setIsOpen={setOpenedList}
        />
        <DappletsListSidebar
          dappletsList={trustedUsersList.filter((user) => !address || address?.replace('0x000000000000000000000000', '0x') !== user.replace('0x000000000000000000000000', '0x')).map((user) => ({
            title: user.replace('0x000000000000000000000000', '0x'),
            subTitle: `${user.replace('0x000000000000000000000000', '0x').slice(0, 6)}...${user.replace('0x000000000000000000000000', '0x').slice(-4)}`,
            id: user,
            type: DappletsListItemTypes.Default,
            onClickRemove: () => { },
            isRemoved: false,
          }))}
          title={SideLists.MyTrustedUsers}
          onOpenList={() => { }}
          isMoreShow={false}
          onElementClick={(id: string) =>
            setSort({
              addressFilter: id,
              selectedList: undefined,
              searchQuery: "",
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
