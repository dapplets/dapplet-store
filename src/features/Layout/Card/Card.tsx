import React, { ReactNode, CSSProperties } from "react";
import styled from "styled-components/macro";

const Wrapper = styled.div`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15), 0px 4px 35px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 40px;
  background: #ffffff;
  position: relative;
`;

const Content = styled.div`
  width: 540px;
`;

type CardProps = {
  children: ReactNode;
  // title: string;
  style?: CSSProperties;
  className?: string;
};

const Card = ({ children, style, className }: CardProps) => {
  return (
    <Wrapper className={className} style={style}>
      <Content>{children}</Content>
    </Wrapper>
  );
};

export default Card;
