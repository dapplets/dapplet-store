import React, { ReactNode } from 'react'
import styled from 'styled-components/macro'

const Wrapper = styled.div`
  color: #2a2a2a;
  font-weight: 900;
  font-size: 26px;
  line-height: 149%;
  margin-bottom: 10px;
`

type TitleProps = {
  children: ReactNode
}

const Title = ({ children }: TitleProps) => {
  return <Wrapper>{children}</Wrapper>
}

export default Title
