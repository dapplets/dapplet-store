import React, { useCallback, useEffect, useState } from "react";

import Layout from "./../features/Layout/Layout";

import "@fontsource/roboto";
import "@fontsource/montserrat";
import "@fontsource/montserrat/900.css";
import ModalResolver from "../features/Modals/ModalResolver";
import { Toaster } from "react-hot-toast";

import { connect } from "react-redux";
import { RootState, RootDispatch } from "../models";
import { Sort } from "./../models/sort";
import { Modals, ModalsList } from "./../models/modals";
import { Lists, MyListElement } from "../models/myLists";
import { useMemo } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { TrustedUser } from "../models/trustedUsers";

// import { getEnsNamesApi } from '../api/ensName/ensName';

const mapState = (state: RootState) => ({
  dappletsStandard: state.dapplets,
  address: state.user.address,
  trustedUsers: state.trustedUsers.trustedUsers,
  addressFilter: state.sort.addressFilter,
  provider: state.user.provider,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  getDapplets: () => dispatch.dapplets.getDapplets(),
  getSort: (address: string) => dispatch.sort.getSort(address),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setModalOpen: (payload: Modals) => dispatch.modals.setModalOpen(payload),
  getTrustedUsers: () => dispatch.trustedUsers.getTrustedUsers(),
  getLists: (payload: Lists) => dispatch.myLists.getLists(payload),
  removeMyList: (payload: Lists) => dispatch.myLists.removeMyList(payload),
  setMyList: (payload: { name: Lists; elements: MyListElement[] }) =>
    dispatch.myLists.setMyList(payload),
  getMyDapplets: () => dispatch.myLists.getMyDapplets(),
  getMyListing: (payload: {
    address: string;
    provider: any;
    dappletsNames: { [name: number]: string };
  }) => dispatch.myLists.getMyListing(payload),
  setUser: (payload: string) =>
    dispatch.user.setUser({
      address: payload,
    }),
  setProvider: (payload: any) =>
    dispatch.user.setUser({
      provider: payload,
    }),
  setTrustedUsers: (payload: TrustedUser[]) =>
    dispatch.trustedUsers.setTrustedUsers(payload),
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

declare global {
  interface Window {
    dapplets: any;
    openModal: any;
  }
}

const App = ({
  dappletsStandard,
  address,
  trustedUsers,
  addressFilter,
  provider,
  getDapplets,
  getSort,
  setSort,
  setModalOpen,
  getTrustedUsers,
  getLists,
  removeMyList,
  setMyList,
  getMyDapplets,
  setUser,
  setProvider,
  setTrustedUsers,
  getMyListing,
}: Props) => {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const [isNotDapplet, setIsNotDapplet] = useState(true);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.addEventListener("dapplets#initialized", () => {
      setIsNotDapplet(false);
    });
  }, []);

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
    window.addEventListener("resize", handleResize);
  }, []);

  const dapplets = useMemo(
    () => Object.values(dappletsStandard),
    [dappletsStandard],
  );

  useEffect(() => {
    getDapplets();
  }, [getDapplets]);

  const hangDappletsEvent = useCallback(() => {
    /* window.dapplets.onTrustedUsersChanged?.(getTrustedUsers);
    window.dapplets.onMyDappletsChanged?.(getMyDapplets); */

    window.dapplets.onUninstall?.(() => {
      setIsNotDapplet(true);
      setMyList({
        name: Lists.MyDapplets,
        elements: [],
      });
      setTrustedUsers([]);
    });
  }, [setMyList, setTrustedUsers]);

  const onLoad = useCallback(() => {
    if (window.dapplets) {
      hangDappletsEvent();
    } else {
      window.addEventListener("dapplets#initialized", hangDappletsEvent);
    }
  }, [hangDappletsEvent]);

  useEffect(() => {
    const fetchTrustedUsers = async () => {
      await getTrustedUsers();
      setIsLoading(false);
    };

    if (!isNotDapplet) {
      getMyDapplets();
      fetchTrustedUsers();
      onLoad();
    }

    return () => {
      window.removeEventListener("dapplets#initialized", hangDappletsEvent);
    };
  }, [getMyDapplets, getTrustedUsers, hangDappletsEvent, isNotDapplet, onLoad]);

  // TODO: test func to open modals
  useEffect(() => {
    window.openModal = (modal: ModalsList) => {
      setModalOpen({ openedModal: modal, settings: null });
    };
  }, [setModalOpen]);

  useEffect(() => {
    if (!address) removeMyList(Lists.MyListing);
  }, [address, removeMyList]);

  useEffect(() => {
    if (address && provider) {
      const dappletsNames: { [name: number]: string } = {};

      dapplets.forEach(({ id, name }) => {
        dappletsNames[id] = name;
      });
      getMyListing({ address, provider, dappletsNames });
    }
  }, [address, dapplets, getMyListing, provider]);

  const [url, setUrl] = useState("");

  useEffect(() => {
    getSort(address || "");
  }, [address, getSort, url]);

  useEffect(() => {
    window.onpopstate = () => {
      setUrl(document.URL as string);
    };
  }, []);

  useEffect(() => {
    const web3Init = async () => {
      const providerOptions = {};

      const web3Modal = new Web3Modal({
        network: "goerli", // optional
        cacheProvider: true, // optional
        providerOptions, // required
      });

      const provider = await web3Modal.connect();

      if (localStorage["metamask_disabled"] === "true") {
        await provider.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
        localStorage["metamask_disabled"] = "";
      }

      provider.on("accountsChanged", (accounts: string[]) => {
        setUser(accounts[0]);
      });

      const web3 = new Web3(provider);
      const address = await web3.eth.getAccounts();
      setUser(address[0]);

      setProvider(provider);
      setModalOpen({ openedModal: null, settings: null });
      localStorage["login"] = "metamask";
      return web3;
    };
    const walletConnect = async () => {
      try {
        const provider: any = new WalletConnectProvider({
          infuraId: "eda881d858ae4a25b2dfbbd0b4629992",
        });

        //  Enable session (triggers QR Code modal)
        await provider.enable();
        const web3 = new Web3(provider);
        const address = await web3.eth.getAccounts();
        setUser(address[0]);
        setModalOpen({ openedModal: null, settings: null });

        setProvider(provider);

        localStorage["login"] = "walletConnect";
      } catch (error) {
        console.error(error);
      }
    };
    if (localStorage["login"] === "walletConnect") {
      walletConnect();
      return;
    }
    if (localStorage["login"] === "metamask") {
      web3Init();
      return;
    }
  }, [setModalOpen, setProvider, setUser]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Toaster position="bottom-left" />
      <ModalResolver />
      <Layout
        setSelectedList={(newSelectedList: Lists | undefined) =>
          setSort({ selectedList: newSelectedList })
        }
        trustedUsersList={trustedUsers}
        setAddressFilter={(newAddressFilter: string | undefined) => {
          setSort({ addressFilter: newAddressFilter });
        }}
        windowWidth={dimensions.width}
        isNotDapplet={isNotDapplet}
      />
    </>
  );
};

export default connect(mapState, mapDispatch)(App);
