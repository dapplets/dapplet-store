import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as PlusIcon } from '../../../images/dappletPlus.svg';
import { ReactComponent as ListIcon } from '../../../images/dappletList.svg';

export enum DappletButtonTypes {
  AddToMy = 'AddToMy',
  RemoveFromMy = 'RemoveFromMy',
  AddToList = 'AddToList',
  RemoveFromList = 'RemoveFromList',
  RemovingFromList = 'RemovingFromList',
}


const getColor = (type: string): string => {
  switch (type) {
    case DappletButtonTypes.AddToList:
    case DappletButtonTypes.AddToMy:
      return '#5EC280'
    case DappletButtonTypes.RemoveFromMy:
    case DappletButtonTypes.RemoveFromList:
      return '#FF6442'
    case DappletButtonTypes.RemovingFromList:
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
  height: 32px;
  border-radius: 4px;
  padding: 0 8px;
  display: grid;
  align-items: center;
  grid-template-columns: min-content max-content;
  grid-column-gap: 8px;
  color: ${(props) => getColor(props.buttonType)};
  border: 1px solid ${(props) => getColor(props.buttonType)};
  background-color: white;

`

const ButtonIcon = (props: { type: string }) => {
  switch (props.type) {
    case DappletButtonTypes.AddToMy:
      return <PlusIcon />
    case DappletButtonTypes.RemoveFromMy:
      return <PlusIcon stroke={getColor(DappletButtonTypes.RemoveFromMy)} />
    case DappletButtonTypes.AddToList:
      return <ListIcon />
    case DappletButtonTypes.RemoveFromList:
      return <ListIcon stroke={getColor(DappletButtonTypes.RemoveFromList)} />
    case DappletButtonTypes.RemovingFromList:
      return <ListIcon stroke={getColor(DappletButtonTypes.RemovingFromList)} />
    default:
      return <PlusIcon />
  }
}

interface DappletButtonProps {
  title: string
  type: string
  onClick: any
}

export const DappletButton = (props: DappletButtonProps) => {
  const [hovered, setHovered] = useState(false)
  return(
  <ButtonWrapper onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={props.onClick} buttonType={hovered &&  props.type === DappletButtonTypes.RemoveFromList ? DappletButtonTypes.RemovingFromList : props.type}>
    <ButtonIcon type={hovered && props.type === DappletButtonTypes.RemoveFromList ? DappletButtonTypes.RemovingFromList : props.type} />
    <div>{hovered && props.type === DappletButtonTypes.RemoveFromList ? 'Removing' : props.title}</div>
  </ButtonWrapper>
)}