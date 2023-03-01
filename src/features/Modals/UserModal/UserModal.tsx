import React, { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components/macro'
import jazzicon from '@metamask/jazzicon'

import { ReactComponent as Close } from '../close.svg'

const Wrapper = styled.div`
  width: 420px;
  height: 390px;
  display: grid;
  grid-row-gap: 30px;
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
`

interface VanillaChildrenProps {
  children: HTMLElement | HTMLDivElement
}

const VanillaChildren = ({ children }: VanillaChildrenProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    while (ref.current?.firstChild) {
      ref.current?.removeChild(ref.current?.firstChild)
    }
    ref.current?.appendChild(children)
  }, [children, ref])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      ref={ref}
    />
  )
}

const Address = styled.div`
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: center;
  color: #919191;
`

const SubText = styled.div`
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: center;
  color: #747376;
`

const ButtonWrapper = styled.div`
  display: grid;
  align-content: center;
  justify-content: center;
  height: 50px;
  border-radius: 25px;
  width: 100%;
  border: 1px solid #d9304f;
  background: none;
  box-shadow: none;
  outline: inherit;
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: center;
  color: #d9304f;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  box-shadow: none;
  outline: inherit;
  background: none;
  border: none;
  cursor: pointer;
`

interface LoginModalProps {
  address: string
  onLogout: any
  onClose: any
}

const UserModal = ({ address, onLogout, onClose }: LoginModalProps) => {
  const addressShort = useMemo(
    () => (address ? address.replace('0x000000000000000000000000', '0x') : ''),
    [address]
  )
  const getAvatar = (loggedIn: string): HTMLDivElement =>
    jazzicon(122, parseInt(loggedIn.slice(2, 10), 16))
  return (
    <Wrapper>
      <CloseButton onClick={onClose}>
        <Close />
      </CloseButton>
      <VanillaChildren>{getAvatar(addressShort)}</VanillaChildren>
      <Address>{addressShort}</Address>
      <SubText>My Dapplets control panel</SubText>
      <ButtonWrapper onClick={onLogout}>Logout</ButtonWrapper>
    </Wrapper>
  )
}

export default UserModal
