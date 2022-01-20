import React, { useMemo, useState } from "react"
import styled from "styled-components"

import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ModalsList } from "../../models/modals";
import UserModal from "./UserModal/UserModal";
import LoginModal from "./LoginModal/LoginModal";
import WarningModal from "./WarningModal/WarningModal";
import { Lists } from "../../config/types";

import { RootDispatch, RootState } from "../../models";
import { connect } from "react-redux";


const mapState = (state: RootState) => ({
  openedModal: state.modals.openedModal,
  address: state.user.address,
});
const mapDispatch = (dispatch: RootDispatch) => ({
  setModalOpen: (payload: ModalsList | null) => dispatch.modals.setModalOpen(payload),
  setUser: (payload: string) => dispatch.user.setUser({
    address: payload
  }),
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

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

interface ModalResolverProps {
  setSelectedDappletsList: any
}

const ModalResolver = ({
  setSelectedDappletsList,
  openedModal,
  address,
  setModalOpen,
  setUser,
}: ModalResolverProps & Props) => {
  const [provider, setProvider] = useState()
  
  const nowModal = useMemo(() => {
    const web3Init = async () => {
      const providerOptions = {};
  
      const web3Modal = new Web3Modal({
        network: "goerli", // optional
        cacheProvider: true, // optional
        providerOptions // required
      });
  
      const provider = await web3Modal.connect();
      
      if (localStorage['metamask_disabled'] === 'true') {
        localStorage['metamask_disabled'] = '';
        await provider.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
      }
      
      provider.on("accountsChanged", (accounts: string[]) => {
        setUser(accounts[0])
      });
      
      const web3 = new Web3(provider);
      const address = await web3.eth.getAccounts()
      setUser(address[0])
      
      setProvider(provider)
      setModalOpen(null)
      return web3
    }
      
    const walletConnect = async () => {
      try {
        const provider: any = new WalletConnectProvider({
          infuraId: "eda881d858ae4a25b2dfbbd0b4629992",
        });
        
        //  Enable session (triggers QR Code modal)
        await provider.enable();
        const web3 = new Web3(provider);
        const address = await web3.eth.getAccounts()
        setUser(address[0])
        setModalOpen(null)
        
        setProvider(provider)
      } catch (error) {
        console.error(error)
      }
    }
  
    const onDapplet = async () => {
      try {
        const addressDapps = await window.dapplets.getAccounts()
        if (addressDapps.length > 0) {
          setUser(addressDapps[0].account)
          setModalOpen(null)
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
            onClose={() => setModalOpen(null)}
          />
        )
      case ModalsList.User:
        return (
          <UserModal 
            address={address || ""} 
            onLogout={async () => {
              try {
                setSelectedDappletsList({
                  listName: Lists.Selected,
                  dapplets: [],
                })
                localStorage['metamask_disabled'] = 'true'
                const prov: any = provider
                prov.disconnect()
              } catch (error) {
                console.error(error)
              }
              setUser("")
              setModalOpen(null)
            }}
            onClose={() => setModalOpen(null)}
          />
        )
        case ModalsList.Warning:
          return (
            <WarningModal
              onClose={() => setModalOpen(null)}
            />
          )
      default:
        return null
    }
  }, [address, openedModal, provider, setModalOpen, setSelectedDappletsList, setUser])

  if (!openedModal) return <></>

  return (
    <ModalWrapperBg onClick={() => setModalOpen(null)}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        {nowModal}
      </ModalWrapper>
    </ModalWrapperBg>
  )
}

export default connect(mapState, mapDispatch)(ModalResolver);
