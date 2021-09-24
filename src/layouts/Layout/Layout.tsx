import React from 'react';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { Overlay } from '../Overlay';
import { SidePanel } from '../SidePanel';

import styles from './Layout.module.scss';
import { LayoutProps } from './Layout.props';


export function Layout({
  selectedDapplets,
  setSelectedDapplets,
  localDapplets,
  setLocalDapplets,
  selectedList,
  setSelectedList,
  children
}: LayoutProps): React.ReactElement<LayoutProps> {
	return (
		<main className={styles.layout}>
			<Header className={styles.header} />
			<SidePanel
        className={styles.sidePanel}
        localDapplets={localDapplets}
        setLocalDapplets={setLocalDapplets}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />

			<div className={styles.content}>
				{children}
			</div>

			<Overlay
        className={styles.overlay}
        selectedDapplets={selectedDapplets}
        setSelectedDapplets={setSelectedDapplets}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />
		</main>
	);
}

