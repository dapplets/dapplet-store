
import React, { useEffect, useRef } from "react";
import styled from 'styled-components';
import jazzicon from '@metamask/jazzicon';
import { ReactComponent as UserPlus } from './userPlus.svg'
import { ReactComponent as Copy } from './copy.svg'

interface VanillaChildrenProps {
	children: HTMLElement | HTMLDivElement
}

const VanillaChildren = ({ children }: VanillaChildrenProps): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
    while (ref.current?.firstChild) {
      ref.current?.removeChild(ref.current?.firstChild);
    }
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

const MocedAvatar = styled.div`
  background: #BBBBBB;
  width: 164px;
  height: 164px;
  border-radius: 54px;
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

  &:hover {
    background: #F26680;
  }

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

interface ButtonProps {
  myAddress: string,
  address: string
  trustedUsersList: string[]
  setTrustedUsersList: any
}

const Button = ({
  myAddress,
  address,
  trustedUsersList,
  setTrustedUsersList,
}: ButtonProps) => {
  return (
    <ButtonsWrapper>
      <ButtonAction onClick={() => {
        if (myAddress === address) return
        if (trustedUsersList.includes(address)) 
          setTrustedUsersList(trustedUsersList.filter((user) => user !== address))
        else
          setTrustedUsersList([address, ...trustedUsersList])
      }}>
        <UserPlus/>
        <div>
          {
            myAddress === address ? 'Publish' : 
            trustedUsersList.includes(address) ? 'Remove from trusted users' : 'Add to trusted users'
          }
        </div>
      </ButtonAction>
    </ButtonsWrapper>
  )
}

interface ProfileInListProps {
  myAddress: string,
  address: string
  setAddressFilter: any
  editSearchQuery: any
  setSelectedList: any
  trustedUsersList: string[]
  setTrustedUsersList: any
}

const ProfileInList = ({
  myAddress,
  address,
  setAddressFilter,
  editSearchQuery,
  setSelectedList,
  trustedUsersList,
  setTrustedUsersList,
}: ProfileInListProps) => {
  const getAvatar = (loggedIn: string): HTMLDivElement => jazzicon(164, parseInt(loggedIn.slice(2, 10), 16));
  const getAddress = (address: string) => address.replace('0x000000000000000000000000', '0x')

  if (!address) return (
    <Wrapper>
      <Avatar><MocedAvatar /></Avatar>
      <Button
        myAddress={myAddress}
        address={address}
        trustedUsersList={trustedUsersList}
        setTrustedUsersList={setTrustedUsersList}
      />
      <ButtonAll>
        <button onClick={() => {
          setAddressFilter('')
          editSearchQuery('')
          setSelectedList(undefined)
        }}>
          Show All
        </button>
      </ButtonAll>
    </Wrapper>
  )

  return (
    <Wrapper>
      <Avatar><VanillaChildren >{getAvatar(getAddress(address))}</VanillaChildren></Avatar>
      <Address>
        <div>{getAddress(address)}</div>
        <Copy width={16} height={16} onClick={() => copyTextToClipboard(getAddress(address))} />
      </Address>
      <Button
        myAddress={myAddress}
        address={address}
        trustedUsersList={trustedUsersList}
        setTrustedUsersList={setTrustedUsersList}
      />
      <ButtonAll>
        <button onClick={() => {
          setAddressFilter('')
          editSearchQuery('')
          setSelectedList(undefined)
        }}>
          Show All
        </button>
      </ButtonAll>
    </Wrapper>
  )
}

export default ProfileInList;
