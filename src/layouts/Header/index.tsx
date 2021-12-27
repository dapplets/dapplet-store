import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HeaderProps } from './Header.props';
import cn from 'classnames';
import STORE_LOGO from '../../images/StoreLogo.svg';
import { Lists } from '../../config/types';
import jazzicon from '@metamask/jazzicon';
import styles from './Header.module.scss';

interface VanillaChildrenProps {
	children: HTMLElement | HTMLDivElement
}

const VanillaChildren = ({ children }: VanillaChildrenProps): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
    while (ref.current?.firstChild) {
      ref.current?.removeChild(ref.current?.firstChild);
    }
		ref.current?.appendChild(children);
	}, [children, ref]);

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} ref={ref}/>
	);
};


const MENU = [
	{ id: 0, label: 'Home' },
	{ id: 1, label: 'Store' },
	{ id: 2, label: 'My List' },
	{ id: 3, label: 'My Dapplets' },
];

const MENU2 = [
	{ id: 0, label: 'Developers', href:'https://dapplets.org/index.html' },
	{ id: 1, label: 'Join Us', href:'https://dapplets.org/index.html' },
	{ id: 2, label: 'Blog', href:'https://dapplets.org/index.html' },
	{ id: 3, label: 'About', href:'https://dapplets.org/index.html' },
	{ id: 4, label: 'Docs', href:'https://docs.dapplets.org' },
	{ id: 5, label: 'Forum', href:'https://forum.dapplets.org' },
];

export function Header({
  className,
  selectedList,
  setSelectedList,
  setExpandedItems,
  loginInfo,
}: HeaderProps): React.ReactElement {
	const [active, setActive] = useState<number>(MENU[0].id);
  const getAvatar = (loggedIn: string): HTMLDivElement => jazzicon(50, parseInt(loggedIn.slice(2, 10), 16));
  const address = useMemo(() => loginInfo ? loginInfo.replace('0x000000000000000000000000', '0x') : '', [loginInfo])

	function handleItemClick(id: number): void {
    switch (id) {
      case 1:
        setSelectedList();
        break;
      case 2:
        setSelectedList(Lists.Selected);
        break;
      case 3:
        setSelectedList(Lists.Local);
        break;
      default:
        setSelectedList(selectedList);
        break;
    }
	}

  useEffect(() => {
    switch (selectedList) {
      case Lists.Local:
        setActive(3);
        break;
      case Lists.Selected:
        setActive(2);
        break;
      default:
        setActive(1);
        break;
    }
  }, [selectedList])

	return (
		<header className={cn(styles.header, className)}>
      <div className={cn(styles.headerTop)}>
        <div className={styles.headerLogo}>
          {/* Localization */}
        </div>

        <div className={styles.menu}>
          {
            MENU2.map(({ id, label, href }) => {
              if (href) {
                return (
                  <a
                    key={id}
                    className={styles.headerTopItem}
                    href={href}
                  >
                    {label}
                  </a>

                )
              }
              return (
                <div
                  key={id}
                  className={styles.headerTopItem}
                >
                  {label}
                </div>
              );
            })
          }
        </div>

        <div id='place-for-overlay-in-header'>
          <a
            className={styles.buttonItem}
            href="https://github.com/dapplets"
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="#919191" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30ZM2.99998 15C2.99998 8.37001 8.36998 3.00001 15 3.00001C21.63 3.00001 27 8.37001 27 15C26.9993 17.5143 26.2101 19.9651 24.7436 22.0074C23.2772 24.0497 21.2072 25.5807 18.825 26.385C18.225 26.505 18 26.13 18 25.815C18 25.6796 18.0017 25.4452 18.0039 25.1332C18.0083 24.5121 18.015 23.5833 18.015 22.515C18.015 21.39 17.64 20.67 17.205 20.295C19.875 19.995 22.68 18.975 22.68 14.37C22.68 13.05 22.215 11.985 21.45 11.145C21.57 10.845 21.99 9.61501 21.33 7.96501C21.33 7.96501 20.325 7.63501 18.03 9.19501C17.07 8.92501 16.05 8.79001 15.03 8.79001C14.01 8.79001 12.99 8.92501 12.03 9.19501C9.73497 7.65001 8.72998 7.96501 8.72998 7.96501C8.06998 9.61501 8.48998 10.845 8.60998 11.145C7.84498 11.985 7.37998 13.065 7.37998 14.37C7.37998 18.96 10.17 19.995 12.84 20.295C12.495 20.595 12.18 21.12 12.075 21.9C11.385 22.215 9.65998 22.725 8.57998 20.91C8.35498 20.55 7.67998 19.665 6.73498 19.68C5.72998 19.695 6.32998 20.25 6.74998 20.475C7.25998 20.76 7.84498 21.825 7.97998 22.17C8.21998 22.845 8.99998 24.135 12.015 23.58C12.015 24.2358 12.0214 24.866 12.0258 25.304C12.0282 25.5373 12.03 25.716 12.03 25.815C12.03 26.13 11.805 26.49 11.205 26.385C6.43498 24.795 2.99998 20.31 2.99998 15Z"/>
            </svg>
          </a>
          <a
            className={styles.buttonItem}
            href="https://discord.com/invite/YcxbkcyjMV"
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="#919191" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30ZM18.146 6.75183C19.7181 7.01766 21.2215 7.48516 22.624 8.11766C22.6362 8.12254 22.6463 8.13165 22.6524 8.14333C25.1375 11.7385 26.364 15.7957 25.9056 20.4652C25.9045 20.475 25.9014 20.4845 25.8963 20.4931C25.8912 20.5016 25.8844 20.509 25.8763 20.5147C24.2094 21.729 22.3493 22.6529 20.3745 23.2472C20.3605 23.2514 20.3457 23.2512 20.3319 23.2466C20.3181 23.242 20.3061 23.2333 20.2975 23.2216C19.8822 22.6523 19.5045 22.0528 19.1745 21.4231C19.17 21.4144 19.1674 21.4049 19.1669 21.3951C19.1664 21.3853 19.168 21.3756 19.1715 21.3664C19.1751 21.3573 19.1806 21.3491 19.1876 21.3423C19.1946 21.3354 19.2029 21.3302 19.2121 21.3268C19.8107 21.105 20.3809 20.8382 20.929 20.5229C20.9388 20.5171 20.947 20.509 20.9528 20.4992C20.9587 20.4895 20.9621 20.4785 20.9626 20.4671C20.9631 20.4557 20.9609 20.4444 20.956 20.4342C20.9511 20.4239 20.9437 20.415 20.9345 20.4083C20.8181 20.3231 20.7035 20.2342 20.5935 20.1443C20.5835 20.1363 20.5713 20.1313 20.5585 20.1298C20.5457 20.1284 20.5328 20.1305 20.5211 20.1361C16.9635 21.7531 13.065 21.7531 9.46521 20.1361C9.45361 20.1308 9.44078 20.1289 9.42816 20.1305C9.41553 20.1322 9.40361 20.1372 9.39371 20.1452C9.28371 20.2342 9.16821 20.3231 9.05271 20.4083C9.04362 20.4152 9.03638 20.4242 9.03164 20.4345C9.02689 20.4449 9.02479 20.4562 9.02551 20.4676C9.02624 20.479 9.02977 20.49 9.0358 20.4996C9.04183 20.5093 9.05016 20.5173 9.06004 20.5229C9.61012 20.8356 10.1839 21.1047 10.776 21.3277C10.8145 21.3424 10.8329 21.3864 10.8136 21.4231C10.491 22.0537 10.1133 22.6542 9.68979 23.2225C9.68084 23.2337 9.6687 23.242 9.65497 23.2463C9.64123 23.2505 9.62653 23.2506 9.61279 23.2463C7.64135 22.6503 5.78423 21.7269 4.11921 20.5147C4.1113 20.5086 4.1047 20.501 4.09981 20.4924C4.09493 20.4837 4.09186 20.4741 4.09079 20.4642C3.70671 16.4254 4.48862 12.3352 7.34129 8.1415C7.34831 8.13045 7.35855 8.12181 7.37062 8.11675C8.77404 7.48333 10.2774 7.01583 11.8485 6.75C11.8627 6.74775 11.8772 6.74988 11.8902 6.7561C11.9031 6.76232 11.9139 6.77235 11.921 6.78483C12.1303 7.14987 12.3191 7.52628 12.4865 7.91233C14.1539 7.66321 15.849 7.66321 17.5163 7.91233C17.6666 7.564 17.8811 7.12308 18.0736 6.78483C18.0808 6.7725 18.0916 6.7627 18.1046 6.75679C18.1175 6.75087 18.132 6.74914 18.146 6.75183ZM9.37446 15.8232C9.37446 17.0249 10.2682 18.0048 11.3517 18.0048C12.4526 18.0048 13.329 17.0258 13.329 15.8232C13.3464 14.6287 12.4609 13.6415 11.3517 13.6415C10.2508 13.6415 9.37446 14.6205 9.37446 15.8232ZM16.6849 15.8232C16.6849 17.0249 17.5777 18.0048 18.6621 18.0048C19.7722 18.0048 20.6394 17.0258 20.6394 15.8232C20.6568 14.6287 19.7713 13.6415 18.6621 13.6415C17.5603 13.6415 16.6849 14.6205 16.6849 15.8232Z" />
            </svg>
          </a>
          <a
            className={styles.buttonItem}
            href="https://t.me/dapplets"
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="#919191" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M30 15C30 23.2838 23.2838 30 15 30C6.71625 30 0 23.2838 0 15C0 6.71625 6.71625 0 15 0C23.2838 0 30 6.71625 30 15ZM15.5375 11.0738C14.0788 11.68 11.1625 12.9362 6.79 14.8413C6.08 15.1237 5.7075 15.4 5.67375 15.67C5.61625 16.1275 6.18875 16.3075 6.96625 16.5513C7.0725 16.585 7.1825 16.6187 7.295 16.6562C8.06125 16.905 9.09125 17.1962 9.62625 17.2075C10.1125 17.2175 10.655 17.0175 11.2537 16.6075C15.3387 13.8488 17.4475 12.455 17.58 12.425C17.6737 12.4037 17.8037 12.3762 17.8913 12.455C17.9788 12.5325 17.97 12.68 17.9613 12.72C17.9038 12.9612 15.6613 15.0475 14.4987 16.1275C14.1362 16.4638 13.88 16.7025 13.8275 16.7575C13.71 16.8787 13.59 16.995 13.475 17.1063C12.7625 17.7913 12.23 18.3062 13.505 19.1462C14.1175 19.55 14.6075 19.8838 15.0962 20.2163C15.63 20.58 16.1625 20.9425 16.8525 21.395C17.0275 21.51 17.195 21.6287 17.3587 21.745C17.98 22.1887 18.5387 22.5862 19.2288 22.5237C19.6287 22.4862 20.0437 22.11 20.2537 20.9862C20.75 18.3287 21.7275 12.5738 21.9538 10.2013C21.9675 10.0043 21.9591 9.80636 21.9287 9.61125C21.9106 9.45366 21.8338 9.30866 21.7138 9.205C21.535 9.05875 21.2575 9.0275 21.1325 9.03C20.5688 9.04 19.7038 9.34125 15.5375 11.0738Z"/>
            </svg>
          </a>
        </div>

      </div>
      <div className={cn(styles.headerTop)} style={{ height: 84 }}>
        <div className={styles.headerLogo}>
          <button onClick={() => {
            setExpandedItems([]);
            setSelectedList();
          }}>
            <img src={STORE_LOGO} alt='logo' />
          </button>
        </div>

        <div className={styles.menu}>
          {
            MENU.map(({ id, label }) => {
              return (
                <div
                  key={id}
                  className={cn(styles.item, id === active ? styles.activeItem : null)}
                  onClick={() => handleItemClick(id)}
                >
                  {label}
                </div>
              );
            })
          }
        </div>

        <div id='place-for-overlay-in-header' className={styles.avatar}>
          {/* <img src={AVATAR} alt='avatar' /> */}
          {address && <VanillaChildren>{getAvatar(address)}</VanillaChildren>}
        </div>

      </div>


		</header>
	);
}
