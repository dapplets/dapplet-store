import React, { ReactNode, useEffect, useRef, useState } from "react";
import styled from "styled-components/macro";
import jazzicon from "@metamask/jazzicon";
import { connect } from "react-redux";
import { ReactComponent as UserPlus } from "./userPlus.svg";
import { ReactComponent as Copy } from "./copy.svg";
import { net } from "../../api/constants";
import { ModalsList } from "../../models/modals";
import shortenAddress from "../../lib/shortenAddress";
import { RootState } from "../../models";
import useCopyToClipBoard from "../../hooks/useCopyToClipBoard";
import { TrustedUser } from "../../models/trustedUsers";

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

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  grid-column-gap: 11px;
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    "avatar title ."
    "avatar address ."
    "avatar buttons all";
  margin: 15px;
  align-items: center;
`;

const Title = styled.div`
  font-size: 26px;
  grid-area: title;

  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 900;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;

  /* align-self: flex-end; */
`;

const Avatar = styled.div`
  grid-area: avatar;
`;

const MocedAvatar = styled.div`
  background: #bbbbbb;
  width: 164px;
  height: 164px;
  border-radius: 54px;
`;

const Address = styled.div`
  grid-area: address;
  display: grid;
  grid-template-columns: max-content max-content;
  grid-column-gap: 8px;
  grid-template-rows: min-content;

  & a {
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
`;

const StyledCopy = styled(Copy)`
  cursor: pointer;
`;

const ButtonsWrapper = styled.div`
  position: relative;
  grid-area: buttons;
  justify-self: baseline;
  min-height: 40px;
  /* align-self: flex-start; */
`;

const ButtonAll = styled.div`
  grid-area: all;
  justify-self: end;
  align-self: end;
  background: none;

  & button {
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0em;
    text-align: center;
    padding: 10px;
    cursor: pointer;
    border: none;
    background: none;
  }
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

interface ButtonProps {
  // myAddress: string;
  address: string;
  trustedUsers: TrustedUser[];
  setTrustedUsersList: any;
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
  setTrustedUsersList,
  isNotDapplet,
  setModalOpen,
  addTrustedUser,
  removeTrustedUser,
  children,
}: ButtonProps) => {
  const [hover, setHover] = useState(false);

  const isTrustedUsersListEmpty = trustedUsers.length === 0;

  return (
    <ButtonsWrapper>
      {/* {hover && myAddress === address && <Tooltip>Publish new dapplet</Tooltip>} */}
      <ButtonAction
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        onClick={() => {
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

            setTrustedUsersList(updatedTrustedUsers);
            /* listing.dapplet-base.eth */
            if (toBeRemoved)
              removeTrustedUser(toBeRemoved.ens || toBeRemoved.hex);
            return;
          }

          if (isTrustedUsersListEmpty) {
            setModalOpen({
              openedModal: ModalsList.FirstTrustedUser,
              settings: {
                onAccept: () => {
                  setTrustedUsersList([...trustedUsers, { hex: address }]);
                  addTrustedUser(address);
                  setModalOpen({ openedModal: null, settings: null });
                },
                onCancel: () =>
                  setModalOpen({ openedModal: null, settings: null }),
                address: shortenAddress(address, 5),
              },
            });
            return;
          }

          /* BUG HERE */

          setTrustedUsersList([...trustedUsers, { hex: address }]);
          addTrustedUser(address);
        }}
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

const mapState = (state: RootState) => ({
  addressFilter: state.sort.addressFilter,
  trustedUsers: state.trustedUsers.trustedUsers,
  currentUserAddress: state.user.address,
});

/* const mapDispatch = (dispatch: RootDispatch) => ({
  getEnsNames: (addresses: string[]) =>
    dispatch.ensNames.getEnsNames(addresses),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  addTrustedUser: (payload: string) =>
    dispatch.trustedUsers.addTrustedUser(payload),
  removeTrustedUser: (payload: string) =>
    dispatch.trustedUsers.removeTrustedUser(payload),
  addMyDapplet: (payload: { registryUrl: string; moduleName: string }) =>
    dispatch.myLists.addMyDapplet(payload),
  removeMyDapplet: (payload: { registryUrl: string; moduleName: string }) =>
    dispatch.myLists.removeMyDapplet(payload),
  setMyList: (payload: { name: Lists; elements: MyListElement[] }) =>
    dispatch.myLists.setMyList(payload),
}); */

type ProfileInListProps = {
  setAddressFilter: any;
  editSearchQuery: any;
  setSelectedList: any;
  trustedUsersList: string[];
  setTrustedUsersList: any;
  isNotDapplet: boolean;
  setModalOpen: any;
  title?: string;
  addTrustedUser: any;
  removeTrustedUser: any;
  hexifiedAddressFilter: string;
};

const ListerProfile = ({
  currentUserAddress,
  addressFilter,

  setAddressFilter,
  editSearchQuery,
  setSelectedList,
  trustedUsersList,
  setTrustedUsersList,
  isNotDapplet,
  setModalOpen,
  title,
  addTrustedUser,
  removeTrustedUser,
  hexifiedAddressFilter,
  trustedUsers,
}: ProfileInListProps & ReturnType<typeof mapState>) => {
  const { success: copiedSuccessfuly, copyToClipboard } = useCopyToClipBoard();

  if (!addressFilter) return null;

  const addToTrustedUsersButtonContent = (
    <>
      <UserPlus />
      Add to trusted users
    </>
  );

  const trustedUser = trustedUsers.find(
    (trustedUser) => trustedUser.hex === addressFilter,
  );

  const hasEns = trustedUser && trustedUser.ens;

  const ens = hasEns ? trustedUser.ens : null;

  const trustedUsersHexAdresses = trustedUsers.map(
    (trustedUser) => trustedUser.hex,
  );

  const isCurrentListBeingTrusted =
    trustedUsersHexAdresses.includes(addressFilter);

  const nonOwnerButtonContent = isCurrentListBeingTrusted
    ? "Remove from trusted users"
    : addToTrustedUsersButtonContent;

  const isListOwnedByCurrentUser = currentUserAddress === addressFilter;
  const buttonContent = isListOwnedByCurrentUser
    ? "Create dapplet under construction"
    : nonOwnerButtonContent;

  const avatar = jazzicon(164, parseInt(addressFilter.slice(2, 10), 16));

  const resetSortAndFiltering = () => {
    setAddressFilter("");
    editSearchQuery("");
    setSelectedList(undefined);
  };

  if (currentUserAddress) {
    return (
      <Wrapper>
        <Avatar>
          <VanillaChildren>{avatar}</VanillaChildren>
        </Avatar>
        <Title>{title}</Title>
        <Address>
          <a
            href={`https://${net}.etherscan.io/address/${hexifiedAddressFilter}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ens || addressFilter}
          </a>
          {copiedSuccessfuly ? (
            "Copied"
          ) : (
            <StyledCopy
              width={16}
              height={16}
              onClick={() => copyToClipboard(hexifiedAddressFilter)}
            />
          )}
        </Address>
        {!isListOwnedByCurrentUser && (
          <Button
            // myAddress={currentUserAddress}
            address={addressFilter}
            trustedUsers={trustedUsers}
            setTrustedUsersList={setTrustedUsersList}
            isNotDapplet={isNotDapplet}
            setModalOpen={setModalOpen}
            addTrustedUser={addTrustedUser}
            removeTrustedUser={removeTrustedUser}
          >
            {buttonContent}
          </Button>
        )}
        <ButtonAll>
          <button onClick={resetSortAndFiltering}>Show All</button>
        </ButtonAll>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Avatar>
        <MocedAvatar />
      </Avatar>
      <Title>{title}</Title>
      {!isListOwnedByCurrentUser && (
        <Button
          address={addressFilter}
          trustedUsers={trustedUsers}
          setTrustedUsersList={setTrustedUsersList}
          isNotDapplet={isNotDapplet}
          setModalOpen={setModalOpen}
          addTrustedUser={addTrustedUser}
          removeTrustedUser={removeTrustedUser}
        >
          {buttonContent}
        </Button>
      )}
      <ButtonAll>
        <button onClick={resetSortAndFiltering}>Show All</button>
      </ButtonAll>
    </Wrapper>
  );
};

export default connect(mapState)(ListerProfile);
