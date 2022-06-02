import React from "react";
import Card, { Title, Body } from "../../Layout/Card";
import { ReactComponent as CloseIcon } from "../../../images/close.svg";
import { ReactComponent as CancelIcon } from "../../../images/cancel.svg";
import { ReactComponent as AcceptIcon } from "../../../images/trust-user.svg";
import backgroundUrl from "../../../images/firstTrustedUserBg.png";
import styled from "styled-components/macro";
import Button from "./Button";

const Controls = styled.div`
  display: flex;
  gap: 10px;
`;

const ModalCard = styled(Card)`
  width: 930px;
  height: 292px;
  background-image: url(${backgroundUrl});
  background-repeat: no-repeat;
  background-position: right 27px top 13px;
  background-size: 323px 279px;
  color: #919191;
`;

const ModalButtons = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
`;

const Message = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: 500px;
`;

type Settings = {
  onAccept: () => {};
  onCancel: () => {};
  address: string;
};

type FirstPublicDappletProps = { settings: Settings };

const FirstPublicDapplet = ({ settings }: FirstPublicDappletProps) => {
  const { onAccept, onCancel, address } = settings;
  return (
    <ModalCard>
      <Title>
        You’re trying to add the user {address} to the Trusted Users list
      </Title>
      <ModalButtons>
        <Button invisible onClick={onCancel}>
          <CloseIcon />
        </Button>
      </ModalButtons>
      <Body>
        <Message>
          Now you can use locally (on this computer) all the Dapplets from his
          list.
        </Message>
        <Controls>
          <Button cacnel onClick={onCancel}>
            <CancelIcon />
            Cancel
          </Button>
          <Button accept onClick={onAccept}>
            <AcceptIcon />
            Trust this user
          </Button>
        </Controls>
      </Body>
    </ModalCard>
  );
};

export default FirstPublicDapplet;
