import React from 'react';
import { useState } from 'react';
import { SidePanelProps } from './SidePanel.props';
import cn from 'classnames';

import styles from './SidePanel.module.scss';
// import { TAGS } from '../../config/keywords';
import { Lists, IDappletsList, IDappletsListElement } from '../../config/types';
import { saveListToLocalStorage } from '../../utils';
import DappletsListSidebar from '../../components/molecules/DappletsListSidebar'
import { DappletsListItemTypes } from '../../components/atoms/DappletsListItem'

export enum SideLists {
  MyDapplets = 'My dapplets',
  MyListing = 'My listing',
  MyTrustedUsers = 'My trusted users',
}

export function SidePanel({
  dappletTitles,
  className,
  localDappletsList,
  setLocalDappletsList,
  selectedDappletsList,
  setSelectedDappletsList,
  setSelectedList,
  activeTags,
  setActiveTags,
  setExpandedItems,
  trustedUsersList,
  setAddressFilter,
  openedList,
  setOpenedList,
}: SidePanelProps): React.ReactElement {

  const removeFromLocalList = (name: string) => (e: any) => {
    e.preventDefault();
    const list = localDappletsList.dapplets
      .filter((dapp) => dapp.name !== name);
    // console.log('localDappletsList', localDappletsList)
    const newLocalDappletsList: IDappletsList = { listName: localDappletsList.listName, dapplets: list };
    // console.log('newLocalDappletsList', newLocalDappletsList)
    saveListToLocalStorage(newLocalDappletsList);
    setLocalDappletsList(newLocalDappletsList);
  }

  const removeFromSelectedList = (name: string) => (e: any) => {
    e.preventDefault();
    const dappletListIndex = selectedDappletsList.dapplets.findIndex((dapplet) => dapplet.name === name);
    let list = selectedDappletsList.dapplets
    if (selectedDappletsList.dapplets[dappletListIndex].type === DappletsListItemTypes.Adding)
      list = list.filter((dapp) => dapp.name !== name);
    if (selectedDappletsList.dapplets[dappletListIndex].type === DappletsListItemTypes.Removing)
      list[dappletListIndex].type = DappletsListItemTypes.Default
    const newSelectedDappletsList: IDappletsList = { listName: selectedDappletsList.listName, dapplets: list };
    saveListToLocalStorage(newSelectedDappletsList);
    setSelectedDappletsList(newSelectedDappletsList);
  }

  const pushSelectedDappletsList = () => {
    const nowDappletsList: IDappletsListElement[] = selectedDappletsList.dapplets.map((dapplet) => {
      if (dapplet.type === DappletsListItemTypes.Adding)
        return {
          ...dapplet,
          type: DappletsListItemTypes.Default
        }
      return dapplet
    })
    const newDappletsList: IDappletsList = { listName: selectedDappletsList.listName, dapplets: nowDappletsList.filter(({ type }) => type !== DappletsListItemTypes.Removing) };
    saveListToLocalStorage(newDappletsList);
    setSelectedDappletsList(newDappletsList);
  };

  // const handleSwitchTag = (label: string) => (e: any) => {
  //   e.preventDefault();
  //   if (activeTags.includes(label)) {
  //     setActiveTags(activeTags.filter((tag) => tag !== label));
  //   } else {
  //     setActiveTags([...activeTags, label]);
  //   }
  // }


	return (
		<aside className={cn(styles.sidePanel, className)}>
      <div style={{
        height: 'calc(100vh - 70px)',
        overflow: 'auto',
        paddingBottom: '20px'
      }}>
        <div className={styles.content}>
          <DappletsListSidebar
            dappletsList={localDappletsList.dapplets.slice(0, 5).map((dapplet) => ({
              title: dapplet.name,
              type: dapplet.type,
              onClickRemove: () => removeFromLocalList(dapplet.name),
              isRemoved: true,
            }))}
            title={SideLists.MyDapplets}
            onOpenList={() => {
              setExpandedItems([]);
              setSelectedList(Lists.Local);
            }}
            isMoreShow={localDappletsList.dapplets.length > 0}
            isOpen={SideLists.MyDapplets === openedList}
            setIsOpen={setOpenedList}
          />

          <DappletsListSidebar
            dappletsList={selectedDappletsList.dapplets.slice(0, 5).map((dapplet) => ({
              title: dapplet.name,
              type: dapplet.type,
              onClickRemove: () => removeFromSelectedList(dapplet.name),
              isRemoved: dapplet.type !== DappletsListItemTypes.Default,
            }))}
            title={SideLists.MyListing}
            onOpenList={() => {
              setExpandedItems([]);
              setSelectedList(Lists.Selected);
            }}
            isMoreShow={selectedDappletsList.dapplets.length > 0}
            titleButton={selectedDappletsList.dapplets.find(({ type }) => type !== DappletsListItemTypes.Default) && {
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
            onElementClick={(id: string) => setAddressFilter(id)}
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

          {/* <div>
            <Header as="h4" className='infoTitle' size="medium">Keywords:</Header>
            <List horizontal>
              {
                TAGS.map(({ id, label }) => {
                  return (
                    <List.Item key={id} style={{ marginLeft: 0, marginRight: 10 }}>
                      <Button
                        size="tiny"
                        color={activeTags.includes(label) ? 'orange' : 'green'}
                        style={{ padding: '3px', margin: 0 }}
                        onClick={handleSwitchTag(label)}
                      >
                        {label}
                      </Button>
                    </List.Item>
                  );
                })
              }
            </List>
          </div> */}

          <div className={styles.footer}>
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
          </div>

        </div>
      </div>
		</aside>
	);
}
