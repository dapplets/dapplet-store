import React, { useMemo } from 'react'
import styled from 'styled-components/macro'

import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { Modals, ModalsList } from '../../models/modals'
import UserModal from './UserModal/UserModal'
import LoginModal from './LoginModal/LoginModal'
import WarningModal from './WarningModal/WarningModal'

import { RootDispatch, RootState } from '../../models'
import { connect } from 'react-redux'
import FirstLocalDapplet from './DappletList/FirstLocalDapplet'
import FirstPublicDapplet from './DappletList/FirstPublicDapplet'
import FirstTrustedUser from './DappletList/FirstTrustedUser'
import OwnDappletRemove from './DappletList/OwnDappletRemove'

const mapState = (state: RootState) => ({
  openedModal: state.modals.openedModal,
  settings: state.modals.settings,
  address: state.user.address,
  provider: state.user.provider,
})
const mapDispatch = (dispatch: RootDispatch) => ({
  setModalOpen: (payload: Modals) => dispatch.modals.setModalOpen(payload),
  setUser: (payload: string) =>
    dispatch.user.setUser({
      address: payload,
    }),
  setProvider: (payload: any) =>
    dispatch.user.setUser({
      provider: payload,
    }),
})

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

const ModalWrapperBg = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99999;
  display: grid;
  justify-items: center;
  align-items: center;
`

const ModalWrapper = styled.div`
  background: none;
`

const ModalResolver = ({
  openedModal,
  address,
  provider,
  settings,
  setModalOpen,
  setUser,
  setProvider,
}: Props) => {
  const nowModal = useMemo(() => {
    const web3Init = async () => {
      const providerOptions = {}

      const web3Modal = new Web3Modal({
        network: 'goerli', // optional
        cacheProvider: true, // optional
        providerOptions, // required
      })

      let provider: any
      try {
        provider = await web3Modal.connect()

        if (localStorage['metamask_disabled'] === 'true') {
          await provider.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }],
          })
          localStorage['metamask_disabled'] = ''
        }
      } catch (error) {
        setModalOpen({ openedModal: null, settings: null })
        throw error
      }

      provider.on('accountsChanged', (accounts: string[]) => {
        setUser(accounts[0])
      })

      const web3 = new Web3(provider)

      const address = await web3.eth.getAccounts()
      setUser(address[0])

      setProvider(provider)
      setModalOpen({ openedModal: null, settings: null })
      localStorage['login'] = 'metamask'
      return web3
    }

    const walletConnect = async () => {
      try {
        const provider: any = new WalletConnectProvider({
          infuraId: 'eda881d858ae4a25b2dfbbd0b4629992',
        })

        //  Enable session (triggers QR Code modal)
        await provider.enable()
        const web3 = new Web3(provider)
        const address = await web3.eth.getAccounts()
        setUser(address[0])
        setModalOpen({ openedModal: null, settings: null })

        setProvider(provider)

        localStorage['login'] = 'walletConnect'
      } catch (error) {
        console.error(error)
      }
    }

    const onDapplet = async () => {
      try {
        const addressDapps = await window.dapplets.getAccounts()
        if (addressDapps.length > 0) {
          setUser(addressDapps[0].account)
          setModalOpen({ openedModal: null, settings: null })
        }
      } catch (error) {
        console.error(error)
      }
    }
    switch (openedModal) {
      case ModalsList.Login:
        return (
          <LoginModal
            isDappletInstall={!window.dapplets}
            onDapplet={onDapplet}
            onMetamask={web3Init}
            onWalletConnect={walletConnect}
            onClose={() => setModalOpen({ openedModal: null, settings: null })}
          />
        )
      case ModalsList.Install:
        return (
          <LoginModal
            isDappletInstall={!window.dapplets}
            onDapplet={onDapplet}
            onMetamask={web3Init}
            onWalletConnect={walletConnect}
            onClose={() => setModalOpen({ openedModal: null, settings: null })}
            isDappletLogin={true}
          />
        )
      case ModalsList.User:
        return (
          <UserModal
            address={address || ''}
            onLogout={async () => {
              try {
                localStorage['login'] = ''
                localStorage['metamask_disabled'] = 'true'
                const prov: any = provider
                prov.disconnect()
              } catch (error) {
                console.error(error)
              }
              setUser('')
              setModalOpen({ openedModal: null, settings: null })
            }}
            onClose={() => setModalOpen({ openedModal: null, settings: null })}
          />
        )
      case ModalsList.Warning:
        return (
          <WarningModal
            onClose={() => setModalOpen({ openedModal: null, settings: null })}
            onRetry={settings?.onRetry}
          />
        )
      case ModalsList.FirstLocalDapplet:
        return <FirstLocalDapplet settings={settings} />
      case ModalsList.FirstPublicDapplet:
        return <FirstPublicDapplet settings={settings} />
      case ModalsList.FirstTrustedUser:
        return <FirstTrustedUser settings={settings} />
      case ModalsList.OwnDappletRemove:
        return <OwnDappletRemove settings={settings} />
      default:
        return null
    }
  }, [address, openedModal, provider, setModalOpen, setProvider, setUser, settings])

  if (!openedModal) return <></>

  return (
    <ModalWrapperBg onClick={() => setModalOpen({ openedModal: null, settings: null })}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>{nowModal}</ModalWrapper>
    </ModalWrapperBg>
  )
}

export default connect(mapState, mapDispatch)(ModalResolver)
