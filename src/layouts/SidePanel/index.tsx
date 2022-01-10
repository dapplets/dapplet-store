import React from 'react';
import { SidePanelProps } from './SidePanel.props';
import cn from 'classnames';

import styles from './SidePanel.module.scss';
// import { TAGS } from '../../config/keywords';
import { Lists, IDappletsList, IDappletsListElement } from '../../config/types';
import { saveListToLocalStorage } from '../../utils';
import DappletsListSidebar from '../../components/molecules/DappletsListSidebar'
import { DappletsListItemTypes } from '../../components/atoms/DappletsListItem'
import { RootDispatch } from '../../models';
import { Sort } from '../../models/sort';
import { connect } from 'react-redux';

const mapDispatch = (dispatch: RootDispatch) => ({
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
});

type Props = ReturnType<typeof mapDispatch>;

export enum SideLists {
  MyDapplets = 'My dapplets',
  MyListing = 'My listing',
  MyTrustedUsers = 'My trusted users',
}

const SidePanel = ({
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
  dapplets,
  setSort,
}: SidePanelProps & Props): React.ReactElement => {

  const removeFromLocalList = (name: string) => (e: any) => {
    e.preventDefault();
    const list = localDappletsList.dapplets
      .filter((dapp) => dapp.name !== name);
    const newLocalDappletsList: IDappletsList = { listName: localDappletsList.listName, dapplets: list };
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
              title: dapplets.find(({ name }) => dapplet.name === name)?.title || '',
              type: dapplet.type,
              onClickRemove: () => removeFromLocalList(dapplet.name),
              isRemoved: true,
            }))}
            title={SideLists.MyDapplets}
            onOpenList={() => {
              setExpandedItems([]);
              setSort({
                selectedList: Lists.Local,
                addressFilter: "",
              });
            }}
            isMoreShow={localDappletsList.dapplets.length > 0}
            isOpen={SideLists.MyDapplets === openedList}
            setIsOpen={setOpenedList}
          />

          <DappletsListSidebar
            dappletsList={selectedDappletsList.dapplets.slice(0, 5).map((dapplet) => ({
              title: dapplets.find(({ name }) => dapplet.name === name)?.title || '',
              type: dapplet.type,
              onClickRemove: () => removeFromSelectedList(dapplet.name),
              isRemoved: dapplet.type !== DappletsListItemTypes.Default,
            }))}
            title={SideLists.MyListing}
            onOpenList={() => {
              setExpandedItems([]);
              setSort({
                selectedList: Lists.Selected,
                addressFilter: "",
              });
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

export default connect(null, mapDispatch)(SidePanel);
