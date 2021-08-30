import React from 'react';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { Overlay } from '../Overlay';
import { SidePanel } from '../SidePanel';

import styles from './Layout.module.scss';
import { LayoutProps } from './Layout.props';


export function Layout({ children }: LayoutProps): React.ReactElement<LayoutProps> {
	return (
		<main className={styles.layout}>
			<Header className={styles.header} />
			<SidePanel className={styles.sidePanel} />

			<div className={styles.content}>
				{children}
			</div>

			<Overlay className={styles.overlay} />
			<Footer className={styles.footer} />
		</main>
	);
}

