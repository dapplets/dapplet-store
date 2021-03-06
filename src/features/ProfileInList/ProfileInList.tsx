import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/macro";
import jazzicon from "@metamask/jazzicon";
import { ReactComponent as UserPlus } from "./userPlus.svg";
import { ReactComponent as Copy } from "./copy.svg";
import { net } from "../../api/consts";
import { ModalsList } from "../../models/modals";
import shortenAddress from "../../lib/shortenAddress";

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

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

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
  myAddress: string;
  address: string;
  trustedUsersList: string[];
  setTrustedUsersList: any;
  isNotDapplet: boolean;
  setModalOpen: any;
  addTrustedUser: any;
  removeTrustedUser: any;
}

const Button = ({
  myAddress,
  address,
  trustedUsersList,
  setTrustedUsersList,
  isNotDapplet,
  setModalOpen,
  addTrustedUser,
  removeTrustedUser,
}: ButtonProps) => {
  const [hover, setHover] = useState(false);

  const isUserListEmpty = trustedUsersList.length === 0;

  return (
    <ButtonsWrapper>
      {hover && myAddress === address && <Tooltip>Publish new dapplet</Tooltip>}
      <ButtonAction
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        onClick={() => {
          if (isNotDapplet) {
            setModalOpen({ openedModal: ModalsList.Install, settings: null });
            return;
          }
          if (myAddress === address) {
            window.dapplets.openOverlay();
            return;
          }
          if (trustedUsersList.includes(address)) {
            setTrustedUsersList(
              trustedUsersList.filter((user) => user !== address),
            );
            removeTrustedUser(address);
            return;
          }

          if (isUserListEmpty) {
            setModalOpen({
              openedModal: ModalsList.FirstTrustedUser,
              settings: {
                onAccept: () => {
                  setTrustedUsersList([...trustedUsersList, address]);
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

          setTrustedUsersList([...trustedUsersList, address]);
          addTrustedUser(address);
        }}
      >
        <div>
          {myAddress === address ? (
            <div>Create dapplet under construction</div>
          ) : trustedUsersList.includes(address) ? (
            "Remove from trusted users"
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <UserPlus />
              Add to trusted users
            </div>
          )}
        </div>
      </ButtonAction>
    </ButtonsWrapper>
  );
};

interface ProfileInListProps {
  myAddress: string;
  address: string;
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
}

const ProfileInList = ({
  myAddress,
  address,
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
}: ProfileInListProps) => {
  const [isCopy, setCopy] = useState<boolean>(false);

  const getAvatar = (loggedIn: string): HTMLDivElement =>
    jazzicon(164, parseInt(loggedIn.slice(2, 10), 16));
  const getAddress = (address: string) =>
    address.replace("0x000000000000000000000000", "0x");

  function copyTextToClipboard(text: string) {
    if (!navigator.clipboard) return fallbackCopyTextToClipboard(text);

    navigator.clipboard.writeText(text).then(copiedText);
  }

  function copiedText() {
    setCopy(true);

    const timer = setTimeout(() => {
      setCopy(false);
      clearTimeout(timer);
    }, 1000);
  }

  if (!address)
    return (
      <Wrapper>
        <Avatar>
          <MocedAvatar />
        </Avatar>
        <Title>{title}</Title>
        <Button
          myAddress={myAddress}
          address={address}
          trustedUsersList={trustedUsersList}
          setTrustedUsersList={setTrustedUsersList}
          isNotDapplet={isNotDapplet}
          setModalOpen={setModalOpen}
          addTrustedUser={addTrustedUser}
          removeTrustedUser={removeTrustedUser}
        />
        <ButtonAll>
          <button
            onClick={() => {
              setAddressFilter("");
              editSearchQuery("");
              setSelectedList(undefined);
            }}
          >
            Show All
          </button>
        </ButtonAll>
      </Wrapper>
    );

  return (
    <Wrapper>
      <Avatar>
        <VanillaChildren>{getAvatar(getAddress(address))}</VanillaChildren>
      </Avatar>
      <Title>{title}</Title>
      <Address>
        <a
          href={`https://${net}.etherscan.io/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {getAddress(address)}
        </a>
        {isCopy ? (
          "Copied"
        ) : (
          <StyledCopy
            width={16}
            height={16}
            onClick={() => copyTextToClipboard(getAddress(address))}
          />
        )}
      </Address>
      <Button
        myAddress={myAddress}
        address={address}
        trustedUsersList={trustedUsersList}
        setTrustedUsersList={setTrustedUsersList}
        isNotDapplet={isNotDapplet}
        setModalOpen={setModalOpen}
        addTrustedUser={addTrustedUser}
        removeTrustedUser={removeTrustedUser}
      />
      <ButtonAll>
        <button
          onClick={() => {
            setAddressFilter("");
            editSearchQuery("");
            setSelectedList(undefined);
          }}
        >
          Show All
        </button>
      </ButtonAll>
    </Wrapper>
  );
};

export default ProfileInList;
