import React, { useEffect, useMemo, useRef } from "react";
import styled from "styled-components/macro";
import { RootDispatch, RootState } from "../../../models";
import { Modals, ModalsList } from "../../../models/modals";
import jazzicon from "@metamask/jazzicon";
import shortenAddress from "../../../lib/shortenAddress";
import { connect } from "react-redux";
import { ReactComponent as Logout } from "../../../images/logout.svg";

const Wrapper = styled.div`
  background: #ebebeb;
  padding-top: 32px;
  padding-bottom: 32px;
`;

const Avatar = styled.div`
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserAddress = styled.span`
  font-size: 24px;
`;

const Connected = styled.div`
  display: flex;
  padding-left: 60px;
  padding-right: 24px;
  gap: 10px;
  align-items: center;
`;

const NotConnected = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 60px;
  padding-right: 34px;
`;

const InvisibleButton = styled.button`
  background: transparent;
  outline: none;
  display: flex;
  border: none;
  cursor: pointer;

  svg {
    stroke: #e3e3e3;
  }

  path {
    stroke: #747376;
  }

  :hover {
    svg {
      stroke: #747376;
    }

    path {
      stroke: #2a2a2a;
    }
  }
`;

const ConnectButton = styled.button`
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
  cursor: pointer;

  width: 130px;
  height: 32px;

  &:hover {
    background: #f26680;
  }
`;

interface VanillaChildrenProps {
  children: HTMLElement | HTMLDivElement;
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      ref={ref}
    />
  );
};

const mapState = (state: RootState) => ({
  address: state.user.address,
  provider: state.user.provider,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setModalOpen: (payload: Modals) => dispatch.modals.setModalOpen(payload),
  setUser: (payload: string) =>
    dispatch.user.setUser({
      address: payload,
    }),
});

type ProfileProps = {} & ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>;

const Profile = ({
  address,
  setModalOpen,
  provider,
  setUser,
}: ProfileProps) => {
  const getAvatar = (loggedIn: string): HTMLDivElement =>
    jazzicon(60, parseInt(loggedIn.slice(2, 10), 16));

  const addressShort = useMemo(
    () => (address ? address.replace("0x000000000000000000000000", "0x") : ""),
    [address],
  );

  return (
    <Wrapper>
      {address ? (
        <Connected>
          <Avatar
            onClick={() => {
              setModalOpen({ openedModal: ModalsList.User, settings: null });
            }}
          >
            <VanillaChildren>{getAvatar(addressShort)}</VanillaChildren>
          </Avatar>
          <UserInfo>
            <UserAddress>{shortenAddress(address, 8)}</UserAddress>
          </UserInfo>
          <InvisibleButton
            //TODO: CLEAN THE DUCK UP THIS BLOODY MESS!!!
            onClick={async () => {
              try {
                localStorage["login"] = "";
                localStorage["metamask_disabled"] = "true";
                const prov: any = provider;
                prov.disconnect();
              } catch (error) {
                console.error(error);
              }
              setUser("");
              setModalOpen({ openedModal: null, settings: null });
            }}
          >
            <Logout />
          </InvisibleButton>
        </Connected>
      ) : (
        <NotConnected>
          <span>
            To access all of the store's features please connect your wallet
          </span>
          <ConnectButton
            onClick={() => {
              setModalOpen({
                openedModal: ModalsList.Login,
                settings: null,
              });
            }}
          >
            Connect
          </ConnectButton>
        </NotConnected>
      )}
    </Wrapper>
  );
};

export default connect(mapState, mapDispatch)(Profile);
