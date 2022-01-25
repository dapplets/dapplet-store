import React, { DetailedHTMLProps, FC, HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import STORE_LOGO from '../../../images/StoreLogo.svg';
import jazzicon from '@metamask/jazzicon';
import { RootState, RootDispatch } from "../../../models";
import { INITIAL_STATE, Sort } from '../../../models/sort';


import { ReactComponent as GitHub } from './github.svg'
import { ReactComponent as Discord } from './discord.svg'
import { ReactComponent as TG } from './tg.svg'

import { connect } from 'react-redux';
import { ModalsList } from '../../../models/modals';
import { Lists } from '../../../models/myLists';

const Wrapper = styled.header`
  position: fixed;
  align-items: center;
  border-bottom: 1px solid #E3E3E3;
  background: white;
  width: 100%;
  z-index: 9999;
  box-shadow: 0px 10px 8px 0px #2675D10A;
  box-shadow: 0px 3px 4px 0px #00000017;

`

const HeaderTop = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  padding: 0 40px;
  align-items: center;
  background: white;
  width: 100%;
  height: 50px;
  z-index: 9999;
`

const Menu = styled.div`
  display: flex;
  justify-self: end;
`

const Avatar = styled.div`
  border-radius: 50%;
  margin-left: 20px;
  width: 50px;
  height: 50px;
  cursor: pointer;
`

const ItemMain = styled.div`
  position: relative;
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: normal !important;
  font-size: 16px;
  line-height: 149% !important;
  color: #2A2A2A !important;
  min-width: 100px;
  text-align: center;
  cursor: pointer;
  padding-inline: 20px;

  &::after {
    position: absolute;
    top: -30px;
    left: 50%;
    width: 0;
    height: 4px;
    content: '';
    transform: translateX(-50%);
    background-color: #d9304f;
    transition: all .2s cubic-bezier(.24,.22,.015,1.56);
  }
`

interface ItemProps {
  isActive: boolean
}

const Item = styled(ItemMain)<ItemProps>`
  color: ${({ isActive }) => isActive ? '#d9304f !important' : 'black'};
  transition: all .2s cubic-bezier(.24,.22,.015,1.56);
  &::after {
    width: ${({ isActive }) => isActive ? '90%' : '0'};
  }
  &:hover {
    color: #d9304f !important;
    transition: all .2s cubic-bezier(.24,.22,.015,1.56);

    &::after {
      width: 100%;
    }
  }
`

const HeaderTopItem = styled(ItemMain)`
  &::after {
    position: absolute;
    top: 0;
    left: 100%;
    right: 0;
    width: 1px;
    height: 20px;
    content: '';
    background-color: #e3e3e3;
  }
`

const ButtonItem = styled.a`
  margin-left: 20px;
  vertical-align: middle;

  &:hover svg {
    fill: red;
  }
`

const HeaderLogo = styled.div`
  display: block;
  position: relative;
  width: 390px;
  /* margin-top: -68px; */

  & > button {
    background: none;
    border: none;
    box-shadow: none;
    cursor: pointer;

    & > img {
      width: 212px;
    }
  }
`

const mapState = (state: RootState) => ({
  address: state.user.address,
  trigger: state.sort.trigger,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setModalOpen: (payload: ModalsList | null) => dispatch.modals.setModalOpen(payload),
});

const Login = styled.button`
  box-shadow: none;
	outline: inherit;
  border: none;
  border-radius: 4px;
  display: grid;
  justify-content: center;
  align-content: center;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: center;
  color: white;
  background: #D9304F;

  width: 90px;
  height: 32px;

  &:hover {
    background: #F26680;
  }
`

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

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


interface HeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  selectedList?: Lists
  isDapplet: boolean
}

const Header: FC<HeaderProps & Props> = ({
  className,
  selectedList,
  isDapplet,

  setSort,
  setModalOpen,
  address,
  trigger,
}): React.ReactElement => {
	const [active, setActive] = useState<number>(MENU[0].id);
  const getAvatar = (loggedIn: string): HTMLDivElement => jazzicon(50, parseInt(loggedIn.slice(2, 10), 16));
  const addressShort = useMemo(() => address ? address.replace('0x000000000000000000000000', '0x') : '', [address])

	function handleItemClick(id: number): void {
    switch (id) {
      case 1:
        setSort({
          ...INITIAL_STATE,
          trigger: !trigger,
        });
        break;
      case 2:
        if (!address) {
          setModalOpen(ModalsList.Login)
          return
        }
        setSort({
          selectedList: Lists.MyListing,
          addressFilter: "",
        });
        break;
      case 3:
        if (isDapplet) {
          setModalOpen(ModalsList.Install)
          return
        }
        setSort({
          selectedList: Lists.MyDapplets,
          addressFilter: "",
        });
        break;
      default:
        break;
    }
	}

  useEffect(() => {
    switch (selectedList) {
      case Lists.MyDapplets:
        setActive(3);
        break;
      case Lists.MyListing:
        setActive(2);
        break;
      default:
        setActive(1);
        break;
    }
  }, [selectedList])

	return (
		<Wrapper className={className}>
      <HeaderTop style={{ background: '#F5F5F5'}}>
        <HeaderLogo>
          {/* Localization */}
        </HeaderLogo>

        <Menu>
          {
            MENU2.map(({ id, label, href }) => {
              if (href) {
                return (
                  <a
                    key={id}
                    href={href}
                  >
                    <HeaderTopItem>
                      {label}
                    </HeaderTopItem>
                  </a>

                )
              }
              return (
                <HeaderTopItem key={id}>
                  {label}
                </HeaderTopItem>
              );
            })
          }
        </Menu>

        <div>
          <ButtonItem
            href="https://github.com/dapplets"
          >
            <GitHub/>
          </ButtonItem>
          <ButtonItem
            href="https://discord.com/invite/YcxbkcyjMV"
          >
            <Discord/>
          </ButtonItem>
          <ButtonItem
            href="https://t.me/dapplets"
          >
            <TG/>
          </ButtonItem>
        </div>

      </HeaderTop>
      <HeaderTop style={{ height: 84 }}>
        <HeaderLogo>
          <button onClick={() => {
            setSort({
              ...INITIAL_STATE,
              trigger: !trigger,
            });
          }}>
            <img src={STORE_LOGO} alt='logo' />
          </button>
        </HeaderLogo>

        <Menu>
          {
            MENU.map(({ id, label }) => {
              return (
                <Item
                  isActive={id === active}
                  key={id}
                  onClick={() => handleItemClick(id)}
                >
                  {label}
                </Item>
              );
            })
          }
        </Menu>
        {
          address ? 
            <Avatar 
              onClick={() => {
                setModalOpen(ModalsList.User)
              }}
            >
              <VanillaChildren>{getAvatar(addressShort)}</VanillaChildren>
            </Avatar>
            :
            <Login 
              onClick={() => {
                setModalOpen(ModalsList.Login)
              }}
            >
              login
            </Login>
        }
      </HeaderTop>


		</Wrapper>
	);
}

export default connect(mapState, mapDispatch)(Header);
