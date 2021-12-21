import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as PlusIcon } from '../../../images/dappletPlus.svg';
import { ReactComponent as ListIcon } from '../../../images/dappletList.svg';
import { useMemo } from 'react';

export enum DappletButtonTypes {
  AddToMy = 'To My Dapplets',  // To My Dapplets
  InMyDapplets = 'In My dapplets', // In My dapplets
  RemoveFromMy = 'From My Dapplets', // From My Dapplets
  AddToList = 'Add to My List', // Add to My List
  AddingToList = 'Adding to List', // Adding to List - -
  RemoveFromList = 'Cancel', // CANCEL 
  InMyList = 'In My List', // In My List
  FromMyList = 'From My List', // From My List
  RemovingFromList = 'Removing from List', // Removing from List - -
}

const getBorderType = (type: string): string => {
  switch (type) {
    case DappletButtonTypes.RemovingFromList:
    case DappletButtonTypes.AddingToList:
      return 'dashed'
    default:
      return 'solid'
  }
}

const getColor = (type: string): string => {
  switch (type) {
    case DappletButtonTypes.AddToList:
    case DappletButtonTypes.AddToMy:
    case DappletButtonTypes.InMyDapplets:
    case DappletButtonTypes.InMyList:
      return '#5EC280'
    case DappletButtonTypes.RemoveFromMy:
    case DappletButtonTypes.RemoveFromList:
    case DappletButtonTypes.FromMyList:
      return '#FF6442'
    case DappletButtonTypes.RemovingFromList:
    case DappletButtonTypes.AddingToList:
      return '#919191'
    default:
      return '#5EC280'
  }
}

interface ButtonWrapperProps {
  buttonType: string
}

const ButtonWrapper = styled.button<ButtonWrapperProps>`
  width: 100%;
  min-width: 160px;
  height: 32px;
  border-radius: 4px;
  padding: 0 8px;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-column-gap: 8px;
  color: ${(props) => getColor(props.buttonType)};
  border: 1px ${(props) => getBorderType(props.buttonType)} ${(props) => getColor(props.buttonType)};
  background-color: white;
`

const ButtonIcon = (props: { type: string }) => {
  switch (props.type) {
    case DappletButtonTypes.AddToMy:
    case DappletButtonTypes.RemoveFromMy:
    case DappletButtonTypes.InMyDapplets:
      return <PlusIcon stroke={getColor(props.type)} />
    case DappletButtonTypes.AddToList:
    case DappletButtonTypes.RemoveFromList:
    case DappletButtonTypes.RemovingFromList:
    case DappletButtonTypes.AddingToList:
    case DappletButtonTypes.InMyList:
    case DappletButtonTypes.FromMyList:
      return <ListIcon stroke={getColor(props.type)} />
    default:
      return <PlusIcon />
  }
}

interface DappletButtonProps {
  type: string
  onClick: any
}

export const DappletButton = (props: DappletButtonProps) => {
  const [hovered, setHovered] = useState(false)
  const buttonType = useMemo(() => {
    switch (props.type) {
      case DappletButtonTypes.InMyDapplets:
        if (hovered) return DappletButtonTypes.RemoveFromMy
        return props.type
      case DappletButtonTypes.InMyList:
        if (hovered) return DappletButtonTypes.FromMyList
        return props.type
      case DappletButtonTypes.RemovingFromList:
      case DappletButtonTypes.AddingToList:
        if (hovered) return DappletButtonTypes.RemoveFromList
        return props.type
      default:
        return props.type
    }
  }, [props.type, hovered])
  return(
  <ButtonWrapper onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={props.onClick} buttonType={buttonType}>
    {/* <ButtonIcon type={buttonType} /> */}
    <div>{buttonType}</div>
  </ButtonWrapper>
)}