import React, { ReactNode } from "react";
import styled, { css } from "styled-components/macro";

const Accept = css`
  background: #d9304f;
  border: 1px solid #d9304f;
  color: #ffffff;

  &:hover {
    background-color: #f26680;
    border-color: #f26680;

    & svg {
      stroke: #ffffff;
    }
  }

  & svg {
    stroke: #ffffff;
  }
`;

const Cancel = css`
  background: #f5f5f5;
  border: 1px solid #919191;
  color: #919191;

  &:hover {
    border: 1px solid #919191;
    background-color: #747376;
    color: #ffffff;

    & svg {
      stroke: #ffffff;
    }
  }

  & svg {
    stroke: #919191;
  }
`;

const Invisible = css`
  border: none;
  background-color: transparent;
  cursor: pointer;
  width: fit-content;
  height: fit-content;
  padding: 0;

  & svg {
    stroke: #919191;
  }

  & svg:hover {
    stroke: #bbbbbb;
  }
`;

type WrapperProps = {
  cancel?: boolean;
  accept?: boolean;
  invisible?: boolean;
};

const Wrapper = styled.button<WrapperProps>`
  border-radius: 40px;
  width: 170px;
  height: 40px;
  display: flex;
  gap: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 10px;
  border: 1px solid;
  font-weight: 400;
  font-size: 14px;
  line-height: 149%;
  cursor: pointer;

  ${(props) => props.accept && Accept}
  ${(props) => props.cancel && Cancel}
  ${(props) => props.invisible && Invisible}
`;

type ButtonProps = {
  children: ReactNode;
  onClick: () => {};
} & WrapperProps;

const Button = ({
  children,
  accept,
  cancel,
  invisible,
  onClick,
}: ButtonProps) => {
  return (
    <Wrapper
      accept={accept}
      cancel={cancel}
      invisible={invisible}
      onClick={onClick}
    >
      {children}
    </Wrapper>
  );
};

export default Button;
