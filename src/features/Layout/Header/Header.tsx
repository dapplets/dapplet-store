import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import styled from "styled-components/macro";
import { RootState, RootDispatch } from "../../../models";
import { INITIAL_STATE, Sort } from "../../../models/sort";

import { ReactComponent as Logo } from "../../../images/storelogo.svg";
import { ReactComponent as GitHub } from "./github.svg";
import { ReactComponent as Discord } from "./discord.svg";
import { ReactComponent as TG } from "./tg.svg";
import { ReactComponent as Twitter } from "./twitter.svg";

import { connect } from "react-redux";
import { Modals } from "../../../models/modals";
import { Lists } from "../../../models/myLists";

/* TODO: clean out the comments ASAP but gotta keep it for now, researching purposes */

const Wrapper = styled.header`
  padding: 0 40px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e3e3e3;
  background: white;
  justify-content: space-between;
  z-index: 9999;
  box-shadow: 0px 10px 8px 0px #2675d10a;
  box-shadow: 0px 3px 4px 0px #00000017;
`;

const InvisibleButton = styled.button`
  background: transparent;
  outline: none;
  display: flex;
  border: none;
  cursor: pointer;
`;

const Channels = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Divider = styled.div`
  width: 1px;
  background-color: #e3e3e3;
  min-height: 20px;
  margin: 0 10px;
`;

const ChannelItem = styled.a`
  svg {
    display: block;
  }

  &:hover svg {
    fill: #d9304f;
  }
`;

/* const Menu = styled.div`
  display: flex;
  justify-self: end;
`; */

/* const Avatar = styled.div`
  border-radius: 50%;
  margin-left: 20px;
  margin-bottom: 4px;
  width: 30px;
  height: 30px;
  cursor: pointer;
`; */

/* const ItemMain = styled.div`
  position: relative;
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: normal !important;
  font-size: 16px;
  line-height: 149% !important;
  color: #2a2a2a !important;
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
    content: "";
    transform: translateX(-50%);
    background-color: #d9304f;
    transition: all 0.2s cubic-bezier(0.24, 0.22, 0.015, 1.56);
  }
`; */

/* interface ItemProps {
  isActive: boolean
} */

/* const Item = styled(ItemMain)<ItemProps>`
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
` */

/* const HeaderTopItem = styled(ItemMain)`
  &::after {
    position: absolute;
    top: 0;
    left: 100%;
    right: 0;
    width: 1px;
    height: 20px;
    content: "";
    background-color: #e3e3e3;
  }

  &:hover {
    color: #d9304f !important;
    text-decoration:import { Divider } from 'semantic-ui-react';
 underline;
  }
`; */

/* const HeaderLogo = styled.div`
  display: block;
  position: relative;
  width: 390px;

  & > button {
    background: none;
    border: none;
    box-shadow: none;
    cursor: pointer;
  }
`; */

/* const Login = styled.button`
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
  background: #d9304f;

  margin: 0 20px;

  width: 90px;
  height: 32px;

  &:hover {
    background: #f26680;
  }
`; */

const mapState = (state: RootState) => ({
  address: state.user.address,
  trigger: state.sort.trigger,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setModalOpen: (payload: Modals) => dispatch.modals.setModalOpen(payload),
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

/* interface VanillaChildrenProps {
  children: HTMLElement | HTMLDivElement;
} */

/* const VanillaChildren = ({ children }: VanillaChildrenProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    while (ref.current?.firstChild) {
      ref.current?.removeChild(ref.current?.firstChild);
    }
    ref.current?.appendChild(children);
  }, [children, ref]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      ref={ref}
    />
  );
}; */

// const MENU = [
// 	{ id: 0, label: 'Home' },
// 	{ id: 1, label: 'Store' },
// 	{ id: 2, label: 'My List' },
// 	{ id: 3, label: 'My Dapplets' },
// ];

/* const MENU2 = [
  { id: 0, label: "Developers", href: "https://dapplets.org/index.html" },
  { id: 1, label: "Join Us", href: "https://dapplets.org/index.html" },
  { id: 2, label: "Blog", href: "https://dapplets.org/index.html" },
  { id: 3, label: "About", href: "https://dapplets.org/index.html" },
  { id: 4, label: "Docs", href: "https://docs.dapplets.org" },
  { id: 5, label: "Forum", href: "https://forum.dapplets.org" },
]; */

interface HeaderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  selectedList?: Lists;
  isNotDapplet: boolean;
}

const Header: FC<HeaderProps & Props> = ({
  className,
  // selectedList,
  // isNotDapplet,
  setSort,
  // setModalOpen,
  // address,
  trigger,
}): React.ReactElement => {
  // const [active, setActive] = useState<number>(MENU[0].id);
  /* const getAvatar = (loggedIn: string): HTMLDivElement =>
    jazzicon(30, parseInt(loggedIn.slice(2, 10), 16)); */

  /* const addressShort = useMemo(
    () => (address ? address.replace("0x000000000000000000000000", "0x") : ""),
    [address],
  ); */

  /* function handleItemClick(id: number): void {
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
        if (isNotDapplet) {
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
  } */

  /* useEffect(() => {
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
  }, [selectedList]) */

  return (
    <Wrapper className={className}>
      <InvisibleButton
        onClick={() => {
          setSort({
            ...INITIAL_STATE,
            trigger: !trigger,
          });
        }}
      >
        <Logo />
        {/* <img src={STORE_LOGO} alt="logo" /> */}
      </InvisibleButton>

      {/* <Menu>
          {MENU2.map(({ id, label, href }) => {
            if (href) {
              return (
                <a key={id} href={href}>
                  <HeaderTopItem>{label}</HeaderTopItem>
                </a>
              );
            }
            return <HeaderTopItem key={id}>{label}</HeaderTopItem>;
          })}
        </Menu> */}

      <Channels>
        <Divider />
        <ChannelItem href="https://github.com/dapplets">
          <GitHub />
        </ChannelItem>
        <ChannelItem href="https://discord.com/invite/YcxbkcyjMV">
          <Discord />
        </ChannelItem>
        <ChannelItem href="https://t.me/dapplets">
          <TG />
        </ChannelItem>
        <ChannelItem href="https://twitter.com/dappletsproject">
          <Twitter />
        </ChannelItem>

        {/* {address ? (
          <Avatar
            onClick={() => {
              setModalOpen({ openedModal: ModalsList.User, settings: null });
            }}
          >
            <VanillaChildren>{getAvatar(addressShort)}</VanillaChildren>
          </Avatar>
        ) : (
          <Login
            onClick={() => {
              setModalOpen({ openedModal: ModalsList.Login, settings: null });
            }}
          >
            login
          </Login>
        )} */}
      </Channels>

      {/* <HeaderTop style={{ background: "#F5F5F5" }}>
        
      </HeaderTop> */}
    </Wrapper>
  );
};

export default connect(mapState, mapDispatch)(Header);
