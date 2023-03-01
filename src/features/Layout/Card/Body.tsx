import React, { ReactNode } from 'react'
import styled from 'styled-components/macro'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 21px;
`

type BodyProps = {
  children: ReactNode
}

const Body = ({ children }: BodyProps) => {
  return <Wrapper>{children}</Wrapper>
}

export default Body
