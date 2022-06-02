import React from "react";
import Card, { Title, Body } from "../../Layout/Card";
import { ReactComponent as CloseIcon } from "../../../images/close.svg";
import { ReactComponent as CancelIcon } from "../../../images/cancel.svg";
import { ReactComponent as AcceptIcon } from "../../../images/users.svg";
import backgroundUrl from "../../../images/firstPublicDappletBg.png";
import styled from "styled-components/macro";
import Button from "./Button";
import { IDapplet } from "../../../models/dapplets";

const Controls = styled.div`
  display: flex;
  gap: 10px;
`;

const ModalCard = styled(Card)`
  width: 930px;
  height: 355px;
  background-image: url(${backgroundUrl});
  background-repeat: no-repeat;
  background-position: right 27px top 13px;
  background-size: 323px 342px;
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
  dapplet: IDapplet;
};

type FirstPublicDappletProps = { settings: Settings };

const FirstPublicDapplet = ({ settings }: FirstPublicDappletProps) => {
  const { onAccept, onCancel, dapplet } = settings;
  return (
    <ModalCard>
      <Title>You’re trying to add {dapplet.title} to the Public List</Title>
      <ModalButtons>
        <Button invisible onClick={onCancel}>
          <CloseIcon />
        </Button>
      </ModalButtons>
      <Body>
        <Message>
          You will be able to use the dapplets in this list through the
          Extension on all computers where you are logged in. You will also be
          able to share this list. Changing this list requires a blockchain
          transaction signature and some cost. If you don't want to spend, you
          can add a dapplet to the Extension List, changes to which do not
          require a transaction signature, but which is local.
        </Message>
        <Controls>
          <Button cacnel onClick={onCancel}>
            <CancelIcon />
            Cancel
          </Button>
          <Button accept onClick={onAccept}>
            <AcceptIcon />
            Create Public List
          </Button>
        </Controls>
      </Body>
    </ModalCard>
  );
};

export default FirstPublicDapplet;
