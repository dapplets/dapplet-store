import React from 'react';
import styled from 'styled-components';
import { ReactComponent as PlusIcon } from '../../../images/dappletPlus.svg';
import { ReactComponent as ListIcon } from '../../../images/dappletList.svg';

export enum DappletButtonTypes {
  AddToMy = 'AddToMy',
  RemoveFromMy = 'RemoveFromMy',
  AddToList = 'AddToList',
}


const getColor = (type: string): string => {
  switch (type) {
    case DappletButtonTypes.AddToList:
    case DappletButtonTypes.AddToMy:
      return '#5EC280'
    case DappletButtonTypes.RemoveFromMy:
      return '#FF6442'
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
`

const ButtonIcon = (props: { type: string }) => {
  switch (props.type) {
    case DappletButtonTypes.AddToMy:
      return <PlusIcon />
    case DappletButtonTypes.RemoveFromMy:
      return <PlusIcon stroke={getColor(DappletButtonTypes.RemoveFromMy)} />
    case DappletButtonTypes.AddToList:
      return <ListIcon />
    default:
      return <PlusIcon />
  }
}

interface DappletButtonProps {
  title: string
  type: string
  onClick: any
}

export const DappletButton = (props: DappletButtonProps) => (
  <ButtonWrapper onClick={props.onClick} buttonType={props.type}>
    <ButtonIcon type={props.type} />
    <div>{props.title}</div>
  </ButtonWrapper>
)