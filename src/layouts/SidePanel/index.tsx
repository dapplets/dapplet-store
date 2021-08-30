import React from 'react';
import { SidePanelProps } from './SidePanel.props';
import cn from 'classnames';

import styles from './SidePanel.module.scss';
import { Button, Header, List, Message } from 'semantic-ui-react';
import { TAGS } from '../../config/TAGS';

export function SidePanel({ className }: SidePanelProps): React.ReactElement {
	return (
		<div className={cn(styles.sidePanel, className)}>
			<header className={styles.header}>
				<div className={styles.headerContent}>
					<Header as="h1" className={styles.headerTitle} size="huge">LOGO</Header>
					<Header as="h2" className={styles.headerSubtitle} size="medium">Store</Header>
				</div>
			</header>

			<div className={styles.content}>
				<div className={styles.info}>
					<div className={styles.infoContent}>
						<Header as="h4" className={cn(styles.infoTitle, styles.title)} size="medium">Personal:</Header>
						<a href="#" className={styles.intoLink}>Personal Dapplets List</a>
					</div>

					<div className={styles.infoContent}>
						<Header as="h4" className={cn(styles.infoTitle, styles.title)} size="medium">You Are Folowing:</Header>
						<a href="#" className={styles.intoLink}>Essential Dapplets <span>(Dapplets Team)</span></a>
					</div>
				</div>
			</div>

			<Message negative size="large"
				className={styles.message}
				style={{
					borderRadius: 0,
					boxShadow: 'none',
					backgroundColor: '#F00',
				}}
			>
				<p className={styles.messageContent}>
					You need to install the main
					application for using dapplets
					functionality on other sites.
				</p>
				<Button basic size="large"
					className={cn(styles.messageButton, 'message-button')}
					style={{
						display: 'block',
						marginLeft: 'auto',
						padding: '10px 30px'
					}}
				>
					INSTALL
				</Button>
			</Message>

			<div className={cn(styles.tags, styles.content)}>
				<Header as="h4" className={styles.title} size="medium">Tags:</Header>

				<List horizontal>
					{
						TAGS.map(({ id, label }) => {
							return (
								<List.Item key={id} style={{ marginLeft: 0, marginRight: 10 }}>
									<Button size="mini" color="green"
										style={{ padding: '3px', margin: 0 }}
									>
										{label}
									</Button>
								</List.Item>
							);
						})
					}
				</List>
			</div>
		</div>
	);
}
