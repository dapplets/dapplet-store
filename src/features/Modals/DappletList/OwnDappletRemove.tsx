import React from 'react'
import Card, { Title, Body } from '../../Layout/Card'
import { ReactComponent as CloseIcon } from '../../../images/close.svg'
import { ReactComponent as CancelIcon } from '../../../images/cancel.svg'
import { ReactComponent as TrashIcon } from '../../../images/trash.svg'
import backgroundUrl from '../../../images/owndappletremove-bg.png'
import styled from 'styled-components/macro'
import Button from './Button'
import { IDapplet } from '../../../models/dapplets'

const Controls = styled.div`
  display: flex;
  gap: 10px;
  position: absolute;
  bottom: 40px;
`

const ModalCard = styled(Card)`
  width: 930px;
  height: 292px;
  background-image: url(${backgroundUrl});
  background-repeat: no-repeat;
  background-position: right 27px top 13px;
  background-size: 323px 279px;
  color: #919191;
`

const ModalButtons = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
`

const Message = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: 500px;
`

type Settings = {
  onAccept: () => {}
  onCancel: () => {}
  dapplet: IDapplet
}

type FirstPublicDappletProps = { settings: Settings }

const OwnDappletRemove = ({ settings }: FirstPublicDappletProps) => {
  const { onAccept, onCancel, dapplet } = settings
  return (
    <ModalCard>
      <Title>You are the owner of the {dapplet.title} you are trying to remove</Title>
      <ModalButtons>
        <Button invisible onClick={onCancel}>
          <CloseIcon />
        </Button>
      </ModalButtons>
      <Body>
        {/* <Message>
          TO BE MESSAGE
        </Message> */}
        <Controls>
          <Button cancel onClick={onCancel}>
            <CancelIcon />
            Cancel
          </Button>
          <Button accept onClick={onAccept}>
            <TrashIcon />
            Remove dapplet
          </Button>
        </Controls>
      </Body>
    </ModalCard>
  )
}

export default OwnDappletRemove
