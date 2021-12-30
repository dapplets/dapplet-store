
import React, { useEffect, useMemo, useRef } from "react";
import styled from 'styled-components';
import jazzicon from '@metamask/jazzicon';
import { ReactComponent as UserPlus } from './userPlus.svg'
import { ReactComponent as Copy } from './copy.svg'

interface VanillaChildrenProps {
	children: HTMLElement | HTMLDivElement
  address: string
}

const VanillaChildren = ({ children, address }: VanillaChildrenProps): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
    while (ref.current?.firstChild) {
      ref.current?.removeChild(ref.current?.firstChild);
    }
		ref.current?.appendChild(children);
	}, [children, ref]);

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} ref={ref} id={address} />
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
  display: grid;
  grid-template-columns: max-content max-content;
  grid-column-gap: 8px;
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
  background: none;

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
    border: none;
    background: none;
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

function fallbackCopyTextToClipboard(text: string) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

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
  const AvatarImg = useMemo(() => ({
    img: getAvatar(address),
    address,
  }), [address])
  return (
    <Wrapper>
      {/* <Title>{props.title}</Title> */}
      <Avatar><VanillaChildren address={AvatarImg.address}>{AvatarImg.img}</VanillaChildren></Avatar>
      <Address>
        <div>{address}</div>
        <Copy width={16} height={16} onClick={() => copyTextToClipboard(address)} />
      </Address>
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
          Show All
        </button>
      </ButtonAll>
      {/* <ButtonsWrapper>BUTTONS </ButtonsWrapper> */}
    </Wrapper>
  )
}

export default ProfileInList;
