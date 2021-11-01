import React, { useState } from 'react';
import { HeaderProps } from './Header.props';
import cn from 'classnames';
import { Menu } from 'semantic-ui-react';
import STORE_LOGO from '../../images/StoreLogo.svg';

import styles from './Header.module.scss';

const MENU = [
	{ id: 0, label: 'Dapplets' },
	{ id: 1, label: 'Lists' },
];

export function Header({
  className,
  selectedList,
  setSelectedList,
  setExpandedItems,
}: HeaderProps): React.ReactElement {
	const [active, setActive] = useState<string>(MENU[0].label);

	function handleItemClick(_: React.MouseEvent<HTMLElement>, el: any): void {
    if (el.children === 'Dapplets') {
      setSelectedList()
    } else {
      setSelectedList(selectedList)
    }
		setActive(el.children);
	}

	return (
		<header className={cn(styles.header, className)}>

      <div className={styles.headerLogo}>
        <button onClick={() => {
          setExpandedItems([]);
          setSelectedList();
        }}>
          <img src={STORE_LOGO} alt='logo' />
        </button>
      </div>

      <div className={styles.headerMainMenu}>
        <Menu text style={{ flexGrow: 2, margin: '1em 0' }}>
          <Menu.Menu style={{ width: '100%', justifyContent: 'space-around' }}>
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
        <a href='https://dapplets.org/index.html'>
          About
        </a>
        <a href='https://forum.dapplets.org'>
          Forum
        </a>
        <a href='https://docs.dapplets.org'>
          Docs
        </a>
      </div>

      <div id='place-for-overlay-in-header' style={{ width: 390 }}>
      </div>

		</header>
	);
}
