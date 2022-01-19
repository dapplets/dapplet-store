import React, { useState, useMemo } from "react";
import styled from 'styled-components';
import { ReactComponent as DappletListItemPlus } from '../../images/dappletListItemPlus.svg'
import { ReactComponent as DappletListItemMinus } from '../../images/dappletListItemMinus.svg'
import { ReactComponent as DappletListItemClose } from '../../images/dappletListItemClose.svg'

export enum DappletsListItemTypes {
  Default = 'Default',
  Adding = 'Adding',
  Removing = 'Removing',
}

const TitleIcon = (props: { type: string }) => {
  switch (props.type) {
    case DappletsListItemTypes.Adding:
      return <DappletListItemPlus />
    case DappletsListItemTypes.Removing:
      return <DappletListItemMinus />
    default:
      return <></>
  }
}

interface DappletsListItemWrapperProps {
  type: string
}

const DappletsListItemWrapper = styled.div<{ type: string, isClickable: boolean }>`
  display: grid;
  grid-template-columns: ${({ type }) => type === DappletsListItemTypes.Default ? '' : 'max-content'} 1fr min-content;
  height: 41px;
  align-items: center;
  width: 100%;
  grid-column-gap: 10px;
  cursor: ${({ isClickable }) => isClickable ? 'pointer' : 'auto'};
`

const getColorByType = (type: string) => {
  switch (type) {
    case DappletsListItemTypes.Adding:
      return '#5EC280'
    case DappletsListItemTypes.Removing:
      return '#FF6442'
    default:
      return '#747376'
  }
}

const Title = styled.div<DappletsListItemWrapperProps>`
  font-family: Montserrat;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0em;
  color: ${({ type }) => getColorByType(type)};
`

const DappletListItemCloseWrapper = styled.div`
  display: grid;
  align-items: center;
  cursor: pointer;
`

export interface DappletsListItemProps {
  title: string
  subTitle?: string
  type: string
  onClickRemove: any
  isRemoved: boolean
  onClick?: any
  id?: string
}

const DappletsListItem = (props: DappletsListItemProps) => {
  const [hovered, setHovered] = useState(false)

  const title = useMemo(() => {
    if (!props.subTitle) {
      return props.title
    }
    if (hovered) {
      return props.title
    }
    return props.subTitle
  }, [hovered, props.subTitle, props.title])
  
  return (
    <DappletsListItemWrapper 
      type={props.type} 
      onClick={() => {
        if (props.onClick) props.onClick(props.id)}
      } 
      isClickable={!!props.onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)} 
    >
      <TitleIcon type={props.type}/>
      <Title type={props.type}>{title}</Title>
      {props.isRemoved && <DappletListItemCloseWrapper>
        <DappletListItemClose onClick={props.onClickRemove()}/>
      </DappletListItemCloseWrapper>}
    </DappletsListItemWrapper>
  )
}

export default DappletsListItem;
