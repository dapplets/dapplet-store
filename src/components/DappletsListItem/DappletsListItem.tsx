/* eslint-disable prettier/prettier */
import React, { useState, useMemo } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import { ReactComponent as DappletListItemPlus } from '../../images/dappletListItemPlus.svg'
import { ReactComponent as DappletListItemMinus } from '../../images/dappletListItemMinus.svg'
import { ReactComponent as DappletListItemClose } from '../../images/dappletListItemClose.svg'
import { ReactComponent as DappletListItemMoved } from './arrow-down-circle.svg'

export enum DappletsListItemTypes {
  Default = 'Default',
  Adding = 'Adding',
  Removing = 'Removing',
  Moved = 'Moved',
}

export const TitleIcon = (props: { type: DappletsListItemTypes }) => {
  switch (props.type) {
    case DappletsListItemTypes.Adding:
      return <DappletListItemPlus />
    case DappletsListItemTypes.Removing:
      return <DappletListItemMinus />
    case DappletsListItemTypes.Moved:
      return <DappletListItemMoved />
    default:
      return <></>
  }
}

interface DappletsListItemWrapperProps {
  // type: DappletsListItemTypes;
  isActive: boolean
}

const DappletsListItemWrapper = styled.div<{
  type: string
}>`
  display: grid;
  grid-template-columns: ${({ type }) =>
      type === DappletsListItemTypes.Default ? '' : 'max-content'} 1fr min-content;
  height: 41px;
  align-items: center;
  width: 100%;
  grid-column-gap: 10px;
  cursor: 'pointer';
`

const getColorByType = (type: DappletsListItemTypes) => {
  switch (type) {
    case DappletsListItemTypes.Adding:
      return '#5EC280'
    case DappletsListItemTypes.Removing:
      return '#FF6442'
    case DappletsListItemTypes.Moved:
      return '#5AB5E8'
    default:
      return '#747376'
  }
}

const Title = styled.div<{
  isActive: boolean
}>`
  font-family: Montserrat;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0em;
  color: ${(props) => props.isActive && '#2A2A2A'};
`

const DappletListItemCloseWrapper = styled.button`
  border: none;
  display: grid;
  align-items: center;
  cursor: pointer;
`

export interface DappletsListItemProps {
  title: string
  subTitle?: string
  type: DappletsListItemTypes
  isPushing?: boolean
  onClick: any
  id?: string
  isActive: boolean
}

const TrustedListItem = (props: DappletsListItemProps) => {
  const { title, type, id, onClick, subTitle, isActive } = props

  const isSubtitle = subTitle && subTitle.length > 0
  const handleOnClick = () => {
    onClick(id)
  }

  return (
    <DappletsListItemWrapper type={props.type} onClick={handleOnClick}>
      <TitleIcon type={type} />
      <Title isActive={isActive} title={isSubtitle ? title : ''}>
        {isSubtitle ? subTitle : title}
      </Title>
    </DappletsListItemWrapper>
  )
}

export default TrustedListItem
