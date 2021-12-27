import React from 'react';
import styled from 'styled-components';

import { ReactComponent as Dapplet } from './dapplet.svg';
import { ReactComponent as Metamask } from './metamask.svg';
import { ReactComponent as Walletconnect } from './walletconnect.svg';

const Wrapper = styled.div`
  width: 755px;
  height: 280px;
  display: grid;
  grid-row-gap: 10px;
  padding: 40px;
  position: relative;
  grid-template-rows: min-content min-content 1fr;

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

const CloseButton = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
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
  grid-template-columns: 1fr max-content 1fr;
  grid-column-gap: 30px;
  grid-template-rows: 1fr 1fr;
  grid-row-gap: 10px;
  height: 90px;
`

const ButtonWrapperText = styled.div`
  grid-row: 1/3;
  align-self: center;
  justify-self: center;
`

const ButtonWrapper = styled.button`
  border-radius: 20px;
  display: grid;
  justify-items: center;
  align-items: center;
  box-shadow: none;
	outline: inherit;
  background: white;
`

const ButtonContentWrapper = styled.div`
  display: grid;
  grid-template-columns: min-content max-content;
  justify-items: center;
  align-items: center;
  grid-column-gap: 6px;
`

const ButtonText = styled.div``

const Button = (props: { icon: any, text: string, className?: any, onClick?: any }) => {
  return(
    <ButtonWrapper className={props.className} onClick={props.onClick}>
      <ButtonContentWrapper>
        {props.icon}
        <ButtonText>{props.text}</ButtonText>
      </ButtonContentWrapper>
    </ButtonWrapper>
  )
}

const DappletButton = styled(Button)`
  grid-row: 1/3;
  border: 1px solid #D9304F;
  color: #D9304F;
`

const SignButton = styled(Button)`
  color: #2A2A2A;
  grid-column-gap: 10px;
  border: 1px solid #E3E3E3;
`

interface LoginModalProps {
  onMetamask: any
}

const LoginModal = (props: LoginModalProps) => {
  return(
    <Wrapper>
      <CloseButton>x</CloseButton>
      <MainText>Sign In</MainText>
      <SubText>Sed tristique odio fermentum tempus sed.</SubText>
      <ButtonsWrapper>
        <DappletButton icon={<Dapplet />} text='Install Dapplets Extension'/>
        <ButtonWrapperText>or</ButtonWrapperText>
        <SignButton icon={<Metamask />} text='Sign in with Metamask' onClick={props.onMetamask}/>
        <SignButton icon={<Walletconnect />} text='Sign in with WalletConnect'/>
      </ButtonsWrapper>
    </Wrapper>
)}

export default LoginModal
