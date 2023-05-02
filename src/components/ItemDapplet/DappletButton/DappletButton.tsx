import React, { useState } from 'react'
import styled from 'styled-components/macro'
import { useMemo } from 'react'

export enum DappletButtonTypes {
  AddToMy = 'To My Dapplets', // To My Dapplets
  AddToMyHovered = 'To My Dapplets ', // To My Dapplets hovered
  InMyDapplets = 'In My dapplets', // In My dapplets
  RemoveFromMy = 'From My Dapplets', // From My Dapplets
  AddToList = 'Add to My List', // Add to My List
  AddToListHovered = 'Add to My List ', // Add to My List
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
    case DappletButtonTypes.RemoveFromList:
      return 'dashed'
    default:
      return 'solid'
  }
}

const getColor = (type: string) => {
  switch (type) {
    case DappletButtonTypes.AddToList:
    case DappletButtonTypes.AddToMy:
      return {
        text: '#5EC280',
        border: '#5EC280',
        background: '#ffffff',
      }
    case DappletButtonTypes.AddToListHovered:
    case DappletButtonTypes.AddToMyHovered:
      return {
        text: '#D3F8E0',
        border: '#D3F8E0',
        background: '#ffffff',
      }
    case DappletButtonTypes.InMyDapplets:
    case DappletButtonTypes.InMyList:
      return {
        text: '#919191',
        border: '#F5F5F5',
        background: '#ffffff',
      }
    case DappletButtonTypes.RemoveFromMy:
    case DappletButtonTypes.FromMyList:
      return {
        text: '#ffffff',
        border: '#F5CF6C',
        background: '#F5CF6C',
      }
    case DappletButtonTypes.RemoveFromList:
      return {
        text: '#919191',
        border: '#919191',
        background: '#ffffff',
      }
    case DappletButtonTypes.RemovingFromList:
      return {
        text: '#F5CF6C',
        border: '#F5CF6C',
        background: '#ffffff',
      }
    case DappletButtonTypes.AddingToList:
      return {
        text: '#5AB5E8',
        border: '#5AB5E8',
        background: '#ffffff',
      }
    default:
      return {
        text: '#5EC280',
        border: '#5EC280',
        background: '#ffffff',
      }
  }
}

interface ButtonWrapperProps {
  buttonType: string
}

const ButtonWrapper = styled.button<ButtonWrapperProps>`
  cursor: pointer;
  width: 100%;
  min-width: 160px;
  height: 32px;
  border-radius: 4px;
  padding: 0 8px;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-column-gap: 8px;
  color: ${(props) => getColor(props.buttonType).text};
  border: 1px ${(props) => getBorderType(props.buttonType)}
    ${(props) => getColor(props.buttonType).border};
  background-color: ${(props) => getColor(props.buttonType).background};

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

// const ButtonIcon = (props: { type: string }) => {
//   switch (props.type) {
//     case DappletButtonTypes.AddToMy:
//     case DappletButtonTypes.RemoveFromMy:
//     case DappletButtonTypes.InMyDapplets:
//       return <PlusIcon stroke={getColor(props.type)} />
//     case DappletButtonTypes.AddToList:
//     case DappletButtonTypes.RemoveFromList:
//     case DappletButtonTypes.RemovingFromList:
//     case DappletButtonTypes.AddingToList:
//     case DappletButtonTypes.InMyList:
//     case DappletButtonTypes.FromMyList:
//       return <ListIcon stroke={getColor(props.type)} />
//     default:
//       return <PlusIcon />
//   }
// }

interface DappletButtonProps {
  type: string
  onClick: any
  disabled?: boolean
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

      case DappletButtonTypes.AddToList:
        if (hovered) return DappletButtonTypes.AddToListHovered
        return props.type
      case DappletButtonTypes.AddToMy:
        if (hovered) return DappletButtonTypes.AddToMyHovered
        return props.type
      case DappletButtonTypes.RemovingFromList:
      case DappletButtonTypes.AddingToList:
        if (hovered) return DappletButtonTypes.RemoveFromList
        return props.type
      default:
        return props.type
    }
  }, [props.type, hovered])
  return (
    <ButtonWrapper
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={props.onClick}
      buttonType={buttonType}
      disabled={props.disabled}
    >
      {/* <ButtonIcon type={buttonType} /> */}
      <div>{buttonType}</div>
    </ButtonWrapper>
  )
}
