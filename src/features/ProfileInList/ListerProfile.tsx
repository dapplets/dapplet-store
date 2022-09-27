import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components/macro";
import jazzicon from "@metamask/jazzicon";
import { connect } from "react-redux";
import { ReactComponent as UserPlus } from "./userPlus.svg";
import { ReactComponent as Copy } from "./copy.svg";
import { net } from "../../api/constants";
import { ModalsList } from "../../models/modals";
import shortenAddress from "../../lib/shortenAddress";
import { RootDispatch, RootState } from "../../models";
import useCopyToClipBoard from "../../hooks/useCopyToClipBoard";
import { INITIAL_STATE as SORT_INITIAL_STATE, Sort } from "../../models/sort";
import { TrustedUser } from "../../models/trustedUsers";
import Button from "./Button";

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

const mapState = (state: RootState) => ({
  addressFilter: state.sort.addressFilter,
  trustedUsers: state.trustedUsers.trustedUsers,
  currentUserAddress: state.user.address,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
});

type ProfileInListProps = {
  setTrustedUsersList: any;
  isNotDapplet: boolean;
  setModalOpen: any;
  title?: string;
  addTrustedUser: any;
  removeTrustedUser: any;
  hexifiedAddressFilter: string;
} & ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>;

const ListerProfile = ({
  hexifiedAddressFilter,
  setTrustedUsersList,
  isNotDapplet,
  setModalOpen,
  title,
  addTrustedUser,
  removeTrustedUser,
  /* store states */
  addressFilter,
  trustedUsers,
  currentUserAddress,
  /* store dispatchers */
  setSort,
}: ProfileInListProps) => {
  const { success: copiedSuccessfuly, copyToClipboard } = useCopyToClipBoard();

  if (!addressFilter) return null;

  const addToTrustedUsersButtonContent = (
    <>
      <UserPlus />
      Add to trusted users
    </>
  );

  const currentLister = trustedUsers.find(
    (user) => user.hex === addressFilter || user.ens === addressFilter,
  );

  const isCurrentListBeingTrusted = !!currentLister;
  const hasEns = currentLister && currentLister.ens;
  const ens = hasEns ? currentLister.ens : null;

  const nonOwnerButtonContent = isCurrentListBeingTrusted
    ? "Remove from trusted users"
    : addToTrustedUsersButtonContent;

  const isListOwnedByCurrentUser = currentUserAddress === addressFilter;
  const buttonContent = isListOwnedByCurrentUser
    ? "Create dapplet under construction"
    : nonOwnerButtonContent;

  const avatarSeed = currentLister?.hex || addressFilter;

  const avatar = jazzicon(164, parseInt(avatarSeed.slice(2, 10), 16));

  const resetSortAndFiltering = () => {
    setSort(SORT_INITIAL_STATE);
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
        <VanillaChildren>{avatar}</VanillaChildren>
      </Avatar>
      <Title>{title}</Title>
      {!isListOwnedByCurrentUser && (
        <Button
          address={addressFilter}
          trustedUsers={trustedUsers}
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

export default connect(mapState, mapDispatch)(ListerProfile);
