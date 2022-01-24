import React from 'react';
import styled from 'styled-components';

import { ReactComponent as Dapplet } from './dapplet.svg';
import { ReactComponent as Metamask } from './metamask.svg';
import { ReactComponent as Walletconnect } from './walletconnect.svg';
import { ReactComponent as Close } from '../close.svg';

const Wrapper = styled.div`
  width: 380px;
  /* height: 421px; */
  display: grid;
  grid-row-gap: 10px;
  padding: 40px;
  position: relative;
  grid-template-rows: min-content min-content 1fr;
  background: white;

  font-family: Montserrat;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: left;
  color: #919191;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15), 0px 4px 35px rgba(0, 0, 0, 0.1);
  border-radius: 10px; 
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

const MainText = styled.div`
  font-family: Montserrat;
  font-size: 26px;
  font-style: normal;
  font-weight: 900;
  line-height: 39px;
  letter-spacing: 0em;
  text-align: left;
  color: #2A2A2A;
`

const SubText = styled.div`
  margin-bottom: 30px;
`

const ButtonsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 30px;
  grid-row-gap: 10px;
  height: 90px;
`

const ButtonWrapper = styled.button`
  border-radius: 20px;
  display: grid;
  justify-items: center;
  align-items: center;
  box-shadow: none;
	outline: inherit;
  background: white;
  cursor: pointer;
  &:hover {
    background: #F5F5F5
  }
`

const LinkWrapper = styled.a`
  border-radius: 20px;
  display: grid;
  justify-items: center;
  align-items: center;
  box-shadow: none;
	outline: inherit;
  background: white;
  cursor: pointer;
  &:hover {
    background: #F5F5F5
  }
`

const ButtonContentWrapper = styled.div`
  display: grid;
  grid-template-columns: min-content max-content;
  justify-items: center;
  align-items: center;
  grid-column-gap: 6px;
`

const ButtonText = styled.div``

const Button = (props: { icon: any, text: string, className?: any, onClick?: any, href?: string }) => {
  if (!props.href)
    return(
      <ButtonWrapper className={props.className} onClick={props.onClick}>
        <ButtonContentWrapper>
          {props.icon}
          <ButtonText>{props.text}</ButtonText>
        </ButtonContentWrapper>
      </ButtonWrapper>
    )
  return (
    <LinkWrapper className={props.className} href={props.href} target="_blank">
      <ButtonContentWrapper>
        {props.icon}
        <ButtonText>{props.text}</ButtonText>
      </ButtonContentWrapper>
    </LinkWrapper>
  )
}

const DappletButton = styled(Button)`
  height: 90px;
  border: 1px solid #D9304F;
  color: #D9304F;
  text-decoration: none;
  &:hover, &:active, &:focus {
    color: #D9304F;
    text-decoration: none;
  }
`

const SignButton = styled(Button)`
  height: 40px;
  color: #2A2A2A;
  grid-column-gap: 10px;
  border: 1px solid #E3E3E3;
`

interface LoginModalProps {
  onMetamask: any
  onWalletConnect: any
  onClose: any
  onDapplet: any
  isDappletInstall: boolean
  isDappletLogin?: boolean
}

const LoginModal = (props: LoginModalProps) => {
  return(
    <Wrapper>
      <CloseButton onClick={props.onClose}><Close /></CloseButton>
      <MainText>{!props.isDappletLogin && 'Login'}</MainText>
      <SubText>{props.isDappletLogin && 'You need to install extensions for this action'}</SubText>
      <ButtonsWrapper>
        {
          props.isDappletLogin && (props.isDappletInstall ? (
            <DappletButton icon={<Dapplet />} text='Install Dapplets Extension' href='https://docs.dapplets.org/docs/installation'/>
          ) :
          (
            <DappletButton icon={<Dapplet />} text='Login Dapplets Extension' onClick={props.onDapplet}/>
          ))
        }
        {
          !props.isDappletLogin && (
            <>
              <SignButton icon={<Metamask />} text='Login with Metamask' onClick={props.onMetamask}/>
              <SignButton icon={<Walletconnect />} text='Login with WalletConnect' onClick={props.onWalletConnect}/>
            </>
          )
        }
      </ButtonsWrapper>
    </Wrapper>
)}

export default LoginModal
