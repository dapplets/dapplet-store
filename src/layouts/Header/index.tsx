import React, { useState } from 'react';
import { HeaderProps } from './Header.props';
import cn from 'classnames';
import { Menu } from 'semantic-ui-react';
import STORE_LOGO from '../../images/StoreLogo.svg';

import styles from './Header.module.scss';

const MENU = [
	{ id: 0, label: 'Developers' },
	{ id: 1, label: 'Join Us' },
	{ id: 2, label: 'Forum' },
	{ id: 3, label: 'About' },
];

export function Header({ className }: HeaderProps): React.ReactElement {
	const [active, setActive] = useState<string>(MENU[0].label);

	// @ts-ignore
	function handleItemClick(_: React.MouseEvent<HTMLElement>, el): void {
		setActive(el.children);
	}

	return (
		<header className={cn(styles.header, className)}>

      <div className={cn(styles.headerLogo, className)}>
        <img src={STORE_LOGO} alt='logo' style={{ width: 212 }}/>
      </div>

			<Menu text style={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
				<Menu.Menu style={{ width: '100%', justifyContent: 'space-evenly' }}>
					{
						MENU.map(({ id, label }) => {
							return (
								<Menu.Item
									active={label === active}
									key={id}
									className={styles.item}
									onClick={handleItemClick}
								>
									{label}
								</Menu.Item>
							);
						})
					}
				</Menu.Menu>
			</Menu>

      <div id='place-for-overlay-in-header' style={{ width: 430 }}></div>

		</header>
	);
}
