import React from "react";
import Card, { Title, Body } from "../../Layout/Card";
import { ReactComponent as CloseIcon } from "../../../images/close.svg";
import { ReactComponent as CancelIcon } from "../../../images/cancel.svg";
import backgroundUrl from "../../../images/firstLocalDappletBg.png";
import styled from "styled-components/macro";
import Button from "./Button";
import { IDapplet } from "../../../models/dapplets";

const Controls = styled.div`
  display: flex;
  gap: 10px;
`;

const ModalCard = styled(Card)`
  width: 930px;
  height: 292px;
  background-image: url(${backgroundUrl});
  background-repeat: no-repeat;
  background-position: right 10px top 14px;
  background-size: 323px 279px;
  color: #919191;
`;

const Message = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: 500px;
`;

const ModalButtons = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
`;

type Settings = {
  onAccept: () => {};
  onCancel: () => {};
  dapplet: IDapplet;
};

type FirstLocalDappletProps = { settings: Settings };

const FirstLocalDapplet = ({ settings }: FirstLocalDappletProps) => {
  const { onAccept, onCancel, dapplet } = settings;
  return (
    <ModalCard>
      {/* ITEM NAME CAN BE TOO LONG BREAKING THE FLOW!!! */}
      <Title>
        You’re trying to add {dapplet.title} to the Local Extension List
      </Title>
      <ModalButtons>
        <Button invisible onClick={onCancel}>
          <CloseIcon />
        </Button>
      </ModalButtons>
      <Body>
        <Message>
          Dapplets from this list you will be able to use through the Extension
          only on this computer. In order to use or share the Dapplet on
          different computers, you need to add the Dapplet to the Public List.
        </Message>
        <Controls>
          <Button cacnel onClick={onCancel}>
            <CancelIcon />
            Cancel
          </Button>
          <Button accept onClick={onAccept}>
            Create Extension List
          </Button>
        </Controls>
      </Body>
    </ModalCard>
  );
};

export default FirstLocalDapplet;
