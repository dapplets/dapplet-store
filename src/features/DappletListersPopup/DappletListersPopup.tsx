import React, { useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as Trusted } from './trusted.svg'
import { ReactComponent as Others } from './others.svg'

const MainWrapper = styled.div`
  position: relative;
  user-select: none;
`

const MainText = styled.div`
  font-family: Montserrat;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: left;
  color: #588CA3;
  text-decoration-line: underline;
  cursor: pointer;
`

const Wrapper = styled.div`
  width: 420px;
  display: grid;
  grid-row-gap: 20px;
  padding: 20px;
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
  background-color: white;
  z-index: 1000;

  position: absolute;
  top: 16;
  left: 0;

  color: #747376;

  cursor: auto;

  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.09), 0px 10px 8px rgba(38, 117, 209, 0.04);
  border-radius: 10px;
`

const Line = styled.div`
  width: 420px;
  margin-left: -20px;
  height: 1px;
  background: #E3E3E3;
`

const ListWrapper = styled.div`
  display: grid;
  grid-row-gap: 10px;
`

const ListTitle = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-column-gap: 10px;
`

const ListUser = styled.div`
  display: grid;
  grid-column-gap: 8px;
  grid-template-columns: max-content max-content max-content 1fr;
  align-items: center;
`

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  background-color: gray;
  border-radius: 50%;
`

const Address = styled.div`
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: left;
  color: #588CA3;
  text-decoration-line: underline;
  cursor: pointer;
`

const ListShowMore = styled.div`
  font-family: Montserrat;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: left;
  text-decoration-line: underline;
  color: #588CA3;
  cursor: pointer;
`

interface UsersList {
  address: string
  followers?: number 
  onClick: any
}

interface ListProps {
  icon?: any
  usersList: UsersList[]
  onShowMore: any
  listTitle: string
}

const List = (props: ListProps) => {
  return (
    <ListWrapper>
      <ListTitle>
        <div><props.icon/></div>
        <div>{props.listTitle}</div>
      </ListTitle>
      {
        props.usersList.map(({ address, onClick }) => (
          <ListUser>
            <Avatar></Avatar>
            <Address onClick={() => onClick(address)}>{address}</Address>
          </ListUser>
        ))
      }
      <ListShowMore onClick={props.onShowMore}>Show more</ListShowMore>
    </ListWrapper>
  )
}

interface DappletListersPopupProps {
  text: string
  onClickSort: any
}

const DappletListersPopup = (props: DappletListersPopupProps) => {
  const [open, setOpen] = useState(false)
  return(
    <MainWrapper>
      <MainText onClick={(e) => {
        e.stopPropagation()
        setOpen(!open)
      }}>{props.text}</MainText>
      {open && <Wrapper onClick={(e) => {e.stopPropagation()}}>
        <List 
          icon={Trusted}
          usersList={[
            {
              address: "0x0",
              followers: 2,
              onClick: props.onClickSort,
            }
          ]}
          onShowMore={() => {}}
          listTitle="Your trusted users"
        />
        <Line />
        <List 
          icon={Others}
          usersList={[
            {
              address: "0x2",
              followers: 2,
              onClick: props.onClickSort,
            }
          ]}
          onShowMore={() => {}}
          listTitle="Other users"
        />
      </Wrapper>}

    </MainWrapper>
)}

export default DappletListersPopup