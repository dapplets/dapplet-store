import React from "react";
import styled from 'styled-components';
import DappletsListItem, { DappletsListItemProps } from '../DappletsListItem/DappletsListItem'

const ListWrapper = styled.div``

interface TitleProps {
  color: string
}

const Title = styled.div<TitleProps>`
  font-family: Montserrat;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px;
  letter-spacing: 0em;
  text-align: left;
  color: ${({ color }) => color};
  user-select: none;
  cursor: pointer;
  & span {
    display: inline-block;
    width: 14px;
  }
`

const TitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: center;
`

const DappletsListItemWrapper = styled.div`
  display: grid;
  padding-left: 30px;
  grid-row-gap: 10px;
  padding-top: 10px;
`

const MoreWrapper = styled.div`
  color: #588CA3;
  text-decoration-line: underline;
  user-select: none;
  cursor: pointer;
`

const TitleButtonWrapper = styled.button`
  height: 32px;
  border-radius: 4px;
  border: 1px solid #5AB5E8;
  color: #5AB5E8;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: center;
  padding: 9px 10px;
`

interface DappletsListSidebarProps {
  dappletsList: DappletsListItemProps[]
  title: string
  onOpenList: any
  isMoreShow: boolean
  titleButton?: {
    title: string
    onClick: any
  }
  onElementClick?: any
  isOpen: boolean
  setIsOpen: any
}

const DappletsListSidebar = (props: DappletsListSidebarProps) => {
  // const [isOpen, setIsOpen] = useState(false)
  return (
    <ListWrapper>
      <TitleWrapper>
        <Title onClick={() => {
          if (!!props.dappletsList.length)
            props.setIsOpen(props.isOpen ? null : props.title)
        }} color={props.isOpen ? '#2A2A2A' : '.#747376'}>{!!props.dappletsList.length && (props.isOpen ? <span>-</span> : <span>+</span>)} {props.title}</Title>
        {props.isOpen && props.titleButton && <TitleButtonWrapper onClick={props.titleButton?.onClick}>{props.titleButton?.title}</TitleButtonWrapper>}
      </TitleWrapper>
      {
        props.isOpen && !!props.dappletsList.length && <DappletsListItemWrapper>
          {props.dappletsList.filter(({ title }) => !!title).map((dapplet) => (
            <DappletsListItem onClick={props.onElementClick} subTitle={dapplet.subTitle} {...dapplet} key={dapplet.title} />
          ))}
          {props.isMoreShow && <MoreWrapper onClick={props.onOpenList}>show more</MoreWrapper>}
        </DappletsListItemWrapper>
      }
    </ListWrapper>
  )
}

export default DappletsListSidebar;
