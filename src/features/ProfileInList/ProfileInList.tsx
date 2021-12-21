
import React, { useEffect, useMemo, useRef } from "react";
import styled from 'styled-components';
import jazzicon from '@metamask/jazzicon';
import { ReactComponent as UserPlus } from './userPlus.svg'

interface VanillaChildrenProps {
	children: HTMLElement | HTMLDivElement;
}

const VanillaChildren = ({ children }: VanillaChildrenProps): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		ref.current?.appendChild(children);
	}, [children, ref]);

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

// const Title = styled.div`
//   font-size: 26px;
//   grid-area: title;
// `

const Avatar = styled.div`
  grid-area: avatar;
`

const Address = styled.div`
  grid-area: address;
  cursor: pointer;
`

// const Description = styled.div`
//   grid-area: description;
// `

const ButtonsWrapper = styled.div`
  grid-area: buttons;
`

const ButtonAll = styled.div`
  grid-area: all;
  justify-self: end;
  align-self: end;

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

const ButtonAction = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  justify-items: center;
  align-items: center;
  grid-column-gap: 4px;

  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: center;

  padding: 10px 20px;
  cursor: pointer;
  background: #D9304F;
  border-radius: 30px;
  color: white;

  & div {
    margin-top: 1px;
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
  setSelectedList: any
  trustedUsersList: string[]
  setTrustedUsersList: any
}

const ProfileInList = (props: ProfileInListProps) => {
  const getAvatar = (loggedIn: string): HTMLDivElement => jazzicon(164, parseInt(loggedIn.slice(2, 10), 16));

  
  const address = useMemo(() => props.address.replace('0x000000000000000000000000', '0x'), [props.address])
  const AvatarImg = useMemo(() => getAvatar(address), [address])
  return (
    <Wrapper>
      {/* <Title>{props.title}</Title> */}
      <Avatar><VanillaChildren>{AvatarImg}</VanillaChildren></Avatar>
      <Address onClick={() => props.setAddressFilter(props.address)}>{address}</Address>
      <ButtonsWrapper>
        <ButtonAction onClick={() => {
          if (props.trustedUsersList.includes(props.address)) 
            props.setTrustedUsersList(props.trustedUsersList.filter((user) => user !== props.address))
          else
            props.setTrustedUsersList([props.address, ...props.trustedUsersList])
        }}>
          <UserPlus/>
          <div>
            {props.trustedUsersList.includes(props.address) ? 'Remove from trusted users' : 'Add to trusted users'}
          </div>
        </ButtonAction>
      </ButtonsWrapper>
      <ButtonAll  >
        <button onClick={() => {
        props.setAddressFilter('')
        props.editSearchQuery('')
        props.setSelectedList(undefined)
      }}>
        All Dapplets

        </button>
      </ButtonAll>
      {/* <ButtonsWrapper>BUTTONS </ButtonsWrapper> */}
    </Wrapper>
  )
}

export default ProfileInList;
