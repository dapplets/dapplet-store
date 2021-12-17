
import React, { useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import jazzicon from '@metamask/jazzicon';
import { ReactComponent as ButtonPush } from './InAppPrimaryButton.svg'

interface VanillaChildrenProps {
	children: HTMLElement | HTMLDivElement;
}

const VanillaChildren = ({ children }: VanillaChildrenProps): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		ref.current?.appendChild(children);
	}, [ref]);

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} ref={ref} />
	);
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  grid-column-gap: 11px;
  grid-template-rows: 38px min-content min-content;
  grid-template-areas: 
    "avatar title buttons"
    "avatar address address"
    "avatar description all";
  margin: 15px;

`

const Title = styled.div`
  font-size: 26px;
  grid-area: title;
`

const Avatar = styled.div`
  grid-area: avatar;
`

const Address = styled.div`
  grid-area: address;
  cursor: pointer;
`

const Description = styled.div`
  grid-area: description;
`

const ButtonsWrapper = styled.div`
  grid-area: buttons;
`

const ButtonAll = styled.div`
  grid-area: all;
  justify-self: end;

  & button {
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0em;
    text-align: center;
    padding: 10px;
    cursor: pointer;
    border: #E3E3E3 solid 1px;
    border-radius: 4px;
  }

`


interface ProfileInListProps {
  title: string
  avatar: string
  address: string
  description: string
  setAddressFilter: any
  setSortType: any
  editSearchQuery: any
}

const ProfileInList = (props: ProfileInListProps) => {
  const getAvatar = (loggedIn: string): HTMLDivElement => jazzicon(164, parseInt(loggedIn.slice(2, 10), 16));
  
  const address = props.address.replace('0x000000000000000000000000', '0x');
  return (
    <Wrapper>
      {/* <Title>{props.title}</Title> */}
      <Avatar><VanillaChildren>{getAvatar(props.address)}</VanillaChildren></Avatar>
      <Address onClick={() => props.setAddressFilter(props.address)}>{address}</Address>
      <ButtonsWrapper>
        <ButtonPush />
      </ButtonsWrapper>
      <ButtonAll  >
        <button onClick={() => {
        props.setAddressFilter('')
        props.editSearchQuery('')
      }}>
        all

        </button>
      </ButtonAll>
      {/* <ButtonsWrapper>BUTTONS </ButtonsWrapper> */}
    </Wrapper>
  )
}

export default ProfileInList;
