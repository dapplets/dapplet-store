import React, { useState } from "react";
import styled from 'styled-components';
import { ReactComponent as DappletListItemPlus } from '../../images/dappletListItemPlus.svg'
import { ReactComponent as DappletListItemMinus } from '../../images/dappletListItemMinus.svg'
import { ReactComponent as DappletListItemClose } from '../../images/dappletListItemClose.svg'

export enum DappletsListItemTypes {
  Default = 'Default',
  Adding = 'Adding',
  Removing = 'Removing',
}

interface TitleIconProps {
  type: string
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

const DappletsListItemWrapper = styled.div<{ type: string }>`
  display: grid;
  grid-template-columns: ${({ type }) => type === DappletsListItemTypes.Default ? '' : 'max-content'} 1fr min-content;
  height: 41px;
  align-items: center;
  width: 100%;
  grid-column-gap: 10px;
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
  type: string
  onClickRemove: any
  isRemoved: boolean
}

const DappletsListItem = (props: DappletsListItemProps) => {
  return (
    <DappletsListItemWrapper type={props.type}>
      <TitleIcon type={props.type}/>
      <Title type={props.type}>{props.title}</Title>
      {props.isRemoved && <DappletListItemCloseWrapper>
        <DappletListItemClose onClick={props.onClickRemove()}/>
      </DappletListItemCloseWrapper>}
    </DappletsListItemWrapper>
  )
}

export default DappletsListItem;
