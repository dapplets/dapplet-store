import React, { ReactNode } from 'react'
import styled from 'styled-components/macro'

const Content = styled.div``

const Tip = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  border-radius: 4px;
  z-index: 1;
  visibility: hidden;
  font-size: 14px;
  min-width: 370px;

  &:before {
    content: '';
    width: 0;
    height: 0;
    left: 20px;
    top: -10px;
    position: absolute;
    border: 10px solid transparent;
    transform: rotate(135deg);
  }
`

const Wrapper = styled.div<{ showTip: boolean }>`
  position: relative;
  width: 100%;

  & ${Content}:hover + ${Tip} {
    visibility: ${(props) => (props.showTip ? 'visible' : 'hidden')};
    color: #fff;
    background: rgba(42, 42, 42, 0.7);
    padding: 10px;
    line-height: 149%;

    &:before {
      border-color: transparent transparent rgba(42, 42, 42, 0.7) rgba(42, 42, 42, 0.7);
    }
  }
`

type TooltipProps = {
  children: ReactNode
  tipText: ReactNode
  isOn?: boolean
}

const Tooltip = ({ children, tipText, isOn = true }: TooltipProps) => {
  return (
    <Wrapper showTip={isOn}>
      <Content>{children}</Content>
      <Tip>{tipText}</Tip>
    </Wrapper>
  )
}

export default Tooltip
