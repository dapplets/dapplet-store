import React, { ReactNode, useRef } from "react";
import styled, { css } from "styled-components";
import addIcon from "../../images/plus.svg";
import inLocalListIcon from "../../images/cpu.svg";
import inPublicListIcon from "../../images/alignCenter.svg";
import removeIcon from "../../images/remove.svg";
import {
  DAPPLET_BUTTON_TEXT as ButtonText,
  DAPPLET_LISTING_STAGES,
  DAPPLET_LISTINGS_NAMES,
} from "../../Constants";

const Basic = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
  width: 188px;
  height: 32px;
  cursor: pointer;
`;

const Add = styled(Basic)`
  color: white;
  background-color: #d9304f;
  border: 1px solid #d9304f;

  &:hover {
    background-color: #f26680;
    border-color: #f26680;
  }

  &::before {
    content: url(${addIcon});
    display: inline-block;
    vertical-align: middle;
    height: 16px;
    line-height: normal;
    margin-right: 10px;
  }

  & svg {
    stroke: white;
  }
`;

const Adding = styled(Basic)`
  border: 1px dashed #5ab5e8;
  background-color: transparent;
  color: #5ab5e8;

  &:hover {
    border-color: #919191;
    background-color: transparent;
    color: #919191;
  }
`;

const Presented = styled(Basic)<{
  icon: string;
}>`
  border-color: transparent;
  background-color: transparent;
  color: #5ab5e8;

  &:hover {
    border: 1px solid #919191;
    background-color: transparent;
    color: #919191;

    &::before {
      content: url(${removeIcon});
      display: inline-block;
      vertical-align: middle;
      height: 16px;
      line-height: normal;
      margin-right: 6px;
    }
  }

  &::before {
    content: url(${(props) => props.icon});
    display: inline-block;
    vertical-align: middle;
    height: 16px;
    line-height: normal;
    margin-right: 10px;
  }
`;

const Removing = styled(Basic)`
  border: 1px dashed #5ab5e8;
  background-color: transparent;
  color: #5ab5e8;

  &:hover {
    border-color: #919191;
    background-color: transparent;
    color: #919191;
  }
`;

const StyledButtons = {
  add: Add,
  adding: Adding,
  presented: Presented,
  removing: Removing,
};

type stagesKeys = keyof typeof DAPPLET_LISTING_STAGES;
type Stages = typeof DAPPLET_LISTING_STAGES[stagesKeys];

type listingKeys = keyof typeof DAPPLET_LISTINGS_NAMES;
type Listings = typeof DAPPLET_LISTINGS_NAMES[listingKeys];

type ButtonProps = {
  stage: Stages;
  listing: Listings;
  onClick: (e: any) => void;
};

const Button = ({ stage, listing: list, onClick }: ButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  const Button = StyledButtons[stage];
  const textList = ButtonText[list];
  const { base: basicText, hover: hoverText } = textList[stage];

  const icon = list === "local" ? inLocalListIcon : inPublicListIcon;

  const shouldHandleHover = ref.current !== null;

  const handleOnMouseOver = () => {
    if (shouldHandleHover) ref.current.innerText = hoverText;
  };

  const handleOnMouseLeave = () => {
    if (shouldHandleHover) ref.current.innerText = basicText;
  };

  return (
    <Button
      onClick={onClick}
      ref={ref}
      onMouseOver={handleOnMouseOver}
      onMouseLeave={handleOnMouseLeave}
      icon={icon}
    >
      {basicText}
    </Button>
  );
};

export default Button;
