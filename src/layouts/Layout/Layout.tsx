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
}: LayoutProps): React.ReactElement<LayoutProps> {
	return (
		<main className={styles.layout}>
			<Header
        className={styles.header}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />
			<SidePanel
        dappletTitles={dappletTitles}
        className={styles.sidePanel}
        localDappletsList={localDappletsList}
        setLocalDappletsList={setLocalDappletsList}
        setSelectedList={setSelectedList}
        activeTags={activeTags}
        setActiveTags={setActiveTags}
      />

			<div className={styles.content}>
				{children}
			</div>

			<Overlay
        dappletTitles={dappletTitles}
        className={styles.overlay}
        selectedDappletsList={selectedDappletsList}
        setSelectedDappletsList={setSelectedDappletsList}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />
		</main>
	);
}

