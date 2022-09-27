import { ReactNode, useCallback, useState } from "react";
import styled from "styled-components/macro";
import shortenAddress from "../../lib/shortenAddress";
import { connect } from "react-redux";
import { ModalsList } from "../../models/modals";
import { TrustedUser } from "../../models/trustedUsers";
import { RootDispatch, RootState } from "../../models";

const ButtonsWrapper = styled.div`
  position: relative;
  grid-area: buttons;
  justify-self: baseline;
  min-height: 40px;
  /* align-self: flex-start; */
`;

const ButtonAction = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  justify-items: center;
  align-items: center;
  grid-column-gap: 4px;

  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: center;

  padding: 10px 20px;
  cursor: pointer;
  background: #d9304f;
  border-radius: 30px;
  color: white;

  &:hover {
    background: #f26680;
  }

  & div {
    margin-top: 1px;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: -20px;
  width: 100%;

  font-family: Roboto;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: center;
`;

const mapState = (state: RootState) => ({});

const mapDispatch = (dispatch: RootDispatch) => ({
  setTrustedUsers: (payload: TrustedUser[]) =>
    dispatch.trustedUsers.setTrustedUsers(payload),
});

interface ButtonProps {
  // myAddress: string;
  address: string;
  trustedUsers: TrustedUser[];
  setTrustedUsers: any;
  isNotDapplet: boolean;
  setModalOpen: any;
  addTrustedUser: any;
  removeTrustedUser: any;
  children: ReactNode;
}

const Button = ({
  // myAddress,
  address,
  trustedUsers,
  isNotDapplet,
  setModalOpen,
  addTrustedUser,
  removeTrustedUser,
  children,
  /* store dispatchers */
  setTrustedUsers,
}: ButtonProps &
  ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>) => {
  const [hover, setHover] = useState(false);

  const isTrustedUsersListEmpty = trustedUsers.length === 0;

  const handleClick = useCallback(async () => {
    /* listing.dapplet-base.eth */
    /* console.log(address);
      const hex = await dappletRegistry.provider.resolveName(address);
      console.log(hex);
      return; */

    if (isNotDapplet) {
      setModalOpen({ openedModal: ModalsList.Install, settings: null });
      return;
    }

    /* if (myAddress === address) {
          window.dapplets.openOverlay();
          return;
        } */

    const isUserInTrustedUsersList = trustedUsers
      .map((trustedUser) => trustedUser.hex)
      .includes(address);

    if (isUserInTrustedUsersList) {
      const updatedTrustedUsers = trustedUsers.filter(
        (trustedUser) => trustedUser.hex !== address,
      );

      const toBeRemoved = trustedUsers.find(
        (trustedUser) => trustedUser.hex === address,
      );

      setTrustedUsers(updatedTrustedUsers);

      if (toBeRemoved) removeTrustedUser(toBeRemoved.ens || toBeRemoved.hex);
      return;
    }

    const updatedTrustedUsers = [...trustedUsers, { hex: address, ens: null }];

    if (isTrustedUsersListEmpty) {
      setModalOpen({
        openedModal: ModalsList.FirstTrustedUser,
        settings: {
          onAccept: () => {
            setTrustedUsers(updatedTrustedUsers);
            addTrustedUser(address);
            setModalOpen({ openedModal: null, settings: null });
          },
          onCancel: () => setModalOpen({ openedModal: null, settings: null }),
          address: shortenAddress(address, 5),
        },
      });
      return;
    }

    setTrustedUsers(updatedTrustedUsers);
    addTrustedUser(address);
  }, [
    addTrustedUser,
    address,
    isNotDapplet,
    isTrustedUsersListEmpty,
    removeTrustedUser,
    setModalOpen,
    setTrustedUsers,
    trustedUsers,
  ]);

  return (
    <ButtonsWrapper>
      {/* {hover && myAddress === address && <Tooltip>Publish new dapplet</Tooltip>} */}
      <ButtonAction
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        onClick={handleClick}
      >
        {children}

        {/* <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isCurrentUserAuthor ? (
            "Create dapplet under construction"
          ) : isTrustedUserList ? (
            "Remove from trusted users"
          ) : (
            <>
              <UserPlus />
              Add to trusted users
            </>
          )}
        </div> */}
      </ButtonAction>
    </ButtonsWrapper>
  );
};

export default connect(mapState, mapDispatch)(Button);
