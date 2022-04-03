import React, { useMemo, useState } from "react";
import styled from "styled-components";

import { ReactComponent as Cat } from "./cat.svg";
import { ReactComponent as RotateArrow } from "./rotateArrow.svg";
import { ReactComponent as XCircle } from "./xCircle.svg";
import { ReactComponent as Close } from "../close.svg";

const Wrapper = styled.div`
  width: 380px;
  height: 421px;
  display: grid;
  grid-row-gap: 10px;
  padding: 40px;
  position: relative;
  align-content: center;

  font-family: Montserrat;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: left;
  color: #919191;
  background: white;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15), 0px 4px 35px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Title = styled.div`
  font-family: Montserrat;
  font-size: 26px;
  font-style: normal;
  font-weight: 900;
  line-height: 39px;
  letter-spacing: 0em;
  text-align: left;
  color: #2a2a2a;
`;

const SubTitle = styled.div``;

const ButtonsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 10px;
`;

const ButtonWrapper = styled.button`
  height: 40px;
  border: none;
  box-shadow: none;
  outline: none;
  display: grid;
  justify-items: center;
  align-items: center;
  border-radius: 2px;
  margin-top: 10px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  justify-items: center;
  align-items: center;
  grid-column-gap: 10px;
  & div {
    padding-top: 1px;
  }
`;

interface ButtonProps {
  icon: any;
  onClick: any;
  title: string;
  className?: any;
  stroke?: {
    hovered: string;
    default: string;
  };
}

const Button = ({
  icon,
  onClick,
  title,
  className,
  stroke = {
    hovered: "#ffffff",
    default: "#ffffff",
  },
}: ButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const nowStroke = useMemo(() => {
    if (hovered) return stroke?.hovered;
    return stroke.default;
  }, [hovered, stroke.default, stroke.hovered]);
  const Icon = icon;
  return (
    <ButtonWrapper
      onClick={onClick}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ButtonContainer>
        <Icon stroke={nowStroke} width={16} height={16} />
        <div>{title}</div>
      </ButtonContainer>
    </ButtonWrapper>
  );
};

const ButtonCancel = styled(Button)`
  border: 1px solid #919191;
  background: #f5f5f5;
  color: #919191;
  &:hover {
    background: #ffffff;
  }
`;

const ButtonRetry = styled(Button)`
  background: #f5cf6c;
  color: white;
  &:hover {
    background: #ffe299;
    color: #d5a93b;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  box-shadow: none;
  outline: inherit;
  background: none;
  border: none;
  cursor: pointer;
`;

interface WarningModalProps {
  onClose: any;
  message?: string;
  onRetry?: any;
}

const WarningModal = ({
  onClose,
  message = "Change yore network to Goerli",
  onRetry,
}: WarningModalProps) => {
  return (
    <Wrapper>
      <CloseButton onClick={onClose}>
        <Close />
      </CloseButton>
      <Title>Oooops!</Title>
      <SubTitle>{message}</SubTitle>
      <Cat />
      <ButtonsWrapper>
        <ButtonCancel icon={XCircle} onClick={onClose} title="Close" />
        {onRetry && (
          <ButtonRetry
            icon={RotateArrow}
            onClick={onRetry}
            title="Retry"
            stroke={{
              hovered: "#D5A93B",
              default: "#FFFFFF",
            }}
          />
        )}
      </ButtonsWrapper>
    </Wrapper>
  );
};

export default WarningModal;
