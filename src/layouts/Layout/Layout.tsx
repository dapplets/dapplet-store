import React from 'react';
import { Header } from '../Header';
import { Overlay } from '../Overlay';
import { SidePanel } from '../SidePanel';

import styles from './Layout.module.scss';
import { LayoutProps } from './Layout.props';


export function Layout({
  dappletTitles,
  selectedDappletsList,
  setSelectedDappletsList,
  localDappletsList,
  setLocalDappletsList,
  selectedList,
  setSelectedList,
  children,
  activeTags,
  setActiveTags,
  setExpandedItems,
  trustedUsersList,
  setAddressFilter,
  openedList,
  setOpenedList,
}: LayoutProps): React.ReactElement<LayoutProps> {
	return (
		<div className={styles.layout}>
			<Header
        className={styles.header}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
        setExpandedItems={setExpandedItems}
      />
			<SidePanel
        dappletTitles={dappletTitles}
        className={styles.sidePanel}
        localDappletsList={localDappletsList}
        setLocalDappletsList={setLocalDappletsList}
        selectedDappletsList={selectedDappletsList}
        setSelectedDappletsList={setSelectedDappletsList}
        setSelectedList={setSelectedList}
        activeTags={activeTags}
        setActiveTags={setActiveTags}
        setExpandedItems={setExpandedItems}
        trustedUsersList={trustedUsersList}
        setAddressFilter={setAddressFilter}
        openedList={openedList}
        setOpenedList={setOpenedList}
      />

			<main className={styles.content}>
				{children}
			</main>

			<Overlay
        dappletTitles={dappletTitles}
        className={styles.overlay}
        selectedDappletsList={selectedDappletsList}
        setSelectedDappletsList={setSelectedDappletsList}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
        setExpandedItems={setExpandedItems}
      />
		</div>
	);
}

