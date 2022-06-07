/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { DetailedHTMLProps, HTMLAttributes, useMemo } from "react";

import { saveListToLocalStorage } from "../../../lib/localStorage";
import { DappletsListItemTypes } from "../../../components/DappletsListItem/DappletsListItem";
import { RootDispatch, RootState } from "../../../models";
import { Sort } from "../../../models/sort";
import { connect } from "react-redux";
import { Modals } from "../../../models/modals";
import { IDapplet } from "../../../models/dapplets";
import styled from "styled-components/macro";
import { Lists, MyListElement } from "../../../models/myLists";
import { EventPushing, EventType } from "../../../models/dapplets";
import SideNav from "./SideNav";
import Profile from "../Profile/Profile";

const mapState = (state: RootState) => ({
  address: state.user.address,
  provider: state.user.provider,
  isLocked: state.user.isLocked,
  myOldListing: state.myLists[Lists.MyOldListing],
  myListing: state.myLists[Lists.MyListing],
  selectedList: state.sort.selectedList,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setModalOpen: (payload: Modals) => dispatch.modals.setModalOpen(payload),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  pushMyListing: (payload: {
    address: string;
    events: EventPushing[];
    provider: any;
    dappletsNames: { [name: number]: string };
    links: { prev: number; next: number }[];
  }) => dispatch.dapplets.pushMyListing(payload),
  setLocked: (payload: boolean) =>
    dispatch.user.setUser({
      isLocked: payload,
    }),
  removeMyDapplet: (payload: { registryUrl: string; moduleName: string }) =>
    dispatch.myLists.removeMyDapplet(payload),
  setUser: (payload: string) =>
    dispatch.user.setUser({
      address: payload,
    }),
});

const Wrapper = styled.aside`
  background-color: #f5f5f5;
  color: #747376;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
  gap: 10px;
  padding: 0 8px;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
  white-space: nowrap;

  & a {
    color: #747376;
  }
`;

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

export enum LegacySideLists {
  MyDapplets = "Local list",
  MyListing = "Public List",
  TrustedUsers = "Trusted users",
}
export interface SidePanelProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  localDappletsList: MyListElement[];
  setLocalDappletsList: any;
  setSelectedList: React.Dispatch<React.SetStateAction<Lists | undefined>>;
  selectedDappletsList: MyListElement[];
  setSelectedDappletsList: any;
  trustedUsersList: string[];
  setAddressFilter: any;
  openedList: any;
  setOpenedList: any;
  dapplets: IDapplet[];
}

const SidePanel = ({
  className,
  localDappletsList,
  setLocalDappletsList,
  selectedDappletsList,
  setSelectedDappletsList,
  openedList,
  setOpenedList,
  dapplets,
  address,
  provider,
  myOldListing,
  myListing,
  pushMyListing,
  setLocked,
  removeMyDapplet,
}: SidePanelProps & Props): React.ReactElement => {
  /* TODO: purge these, but keep for now, probably need them for research */
  /* const removeFromLocalList = (name: string) => (e: any) => {
    e.preventDefault();
    const list = localDappletsList.filter((dapp) => dapp.name !== name);
    const newLocalDappletsList: MyListElement[] = list;
    saveListToLocalStorage(newLocalDappletsList, Lists.MyDapplets);
    setLocalDappletsList(newLocalDappletsList);
    removeMyDapplet({
      registryUrl: "",
      moduleName: name,
    });
  }; */

  /* const removeFromSelectedList = (name: string) => (e: any) => {
    e.preventDefault();
    const dappletListIndex = selectedDappletsList.findIndex(
      (dapplet) => dapplet.name === name,
    );
    let list = selectedDappletsList;

    if (
      selectedDappletsList[dappletListIndex].type ===
      DappletsListItemTypes.Removing
    ) {
      list[dappletListIndex].type = DappletsListItemTypes.Default;
    }

    if (
      selectedDappletsList[dappletListIndex].type ===
      DappletsListItemTypes.Adding
    ) {
      list = list.filter((dapp) => dapp.name !== name);
    }

    if (selectedDappletsList[dappletListIndex].event !== undefined) {
      if (list[dappletListIndex].eventPrev !== undefined) {
        if (list[dappletListIndex].eventPrev !== 0) {
          const swapId = list.findIndex(
            ({ id }) => id === list[dappletListIndex].eventPrev,
          );
          const swap = list[dappletListIndex];
          // console.log({ swap, swapId });
          list[dappletListIndex] = list[swapId];
          list[swapId] = swap;
          list[swapId].event = undefined;
          list[swapId].eventPrev = undefined;
        } else {
          const swap = list[dappletListIndex];
          list.splice(dappletListIndex, 1);
          list.unshift(swap);
          list[0].event = undefined;
          list[0].eventPrev = undefined;
        }
      }
    }

    const newSelectedDappletsList: MyListElement[] = list;
    saveListToLocalStorage(newSelectedDappletsList, Lists.MyListing);
    setSelectedDappletsList(newSelectedDappletsList);
  }; */

  const dappletsStandard = useMemo(() => Object.values(dapplets), [dapplets]);

  const pushSelectedDappletsList = async () => {
    const events: EventPushing[] = [];
    const nowDappletsList: MyListElement[] = selectedDappletsList.filter(
      (dapplet) => {
        if (dapplet.type === DappletsListItemTypes.Adding) {
          events.push({
            eventType: EventType.ADD,
            dappletId: dapplet.id,
          });
        }
        return dapplet.type !== DappletsListItemTypes.Adding;
      },
    );
    const newDappletsList: MyListElement[] = nowDappletsList.filter(
      ({ type, name, id }) => {
        if (type === DappletsListItemTypes.Removing) {
          events.push({
            eventType: EventType.REMOVE,
            dappletId: id,
          });
        }
        return type !== DappletsListItemTypes.Removing;
      },
    );

    myListing
      .filter(
        ({ type }) =>
          type !== DappletsListItemTypes.Removing &&
          type !== DappletsListItemTypes.Adding,
      )
      .forEach((dapp, index) => {
        if (dapp.id !== myOldListing[index].id) {
          events.push({
            eventType: EventType.REPLACE,
            dappletId: dapp.id,
            dappletPrevId: index === 0 ? 0 : newDappletsList[index - 1].id,
          });
        }
      });

    const tobeLinks: number[] = [];
    const tobeIds = myListing
      .filter((x) => x.type !== DappletsListItemTypes.Removing)
      .map((x) => x.id);
    tobeIds.forEach((x, i) => {
      tobeLinks[tobeIds[i - 1] ?? 0] = x;
      tobeLinks[x] = tobeIds[i + 1] ?? 0xffffffff;
    });

    const asisLinks: number[] = [];
    const asisIds = myOldListing
      .filter((x) => x.type !== DappletsListItemTypes.Adding)
      .map((x) => x.id);
    asisIds.forEach((x, i) => {
      asisLinks[asisIds[i - 1] ?? 0] = x;
      asisLinks[x] = asisIds[i + 1] ?? 0xffffffff;
    });

    const maxLength =
      asisLinks.length > tobeLinks.length ? asisLinks.length : tobeLinks.length;

    const changedLinks = [];
    for (let i = 0; i < maxLength; i++) {
      if (asisLinks[i] !== tobeLinks[i]) {
        changedLinks.push({
          prev: i,
          next: tobeLinks[i] ?? (i === 0 ? 0xffffffff : 0x00000000),
        });
      }
    }

    try {
      const dappletsNames: { [name: number]: string } = {};

      dappletsStandard.forEach(({ id, name }) => {
        dappletsNames[id] = name;
      });
      console.log("changedLinks", changedLinks);
      setLocked(true);
      await pushMyListing({
        address: address || "",
        events,
        provider,
        dappletsNames,
        links: changedLinks,
      });
    } catch (error) {
      console.error({ error });
    }
    setLocked(false);
  };

  return (
    <Wrapper className={className}>
      <Profile />

      <SideNav
        selectedDappletsList={selectedDappletsList}
        onPush={pushSelectedDappletsList}
        openedList={openedList}
        setOpenedList={setOpenedList}
      />

      <Footer>
        <FooterLinks>
          <a href="https://dapplets.org/under-construction.html">
            Terms & Conditions
          </a>
          <a href="https://dapplets.org/under-construction.html">
            Privacy Policy
          </a>
          <a href="https://dapplets.org/about.html">About</a>
          <a href="https://forum.dapplets.org">Forum</a>
          <a href="https://docs.dapplets.org/docs/">Docs</a>
        </FooterLinks>
        <span style={{ display: "flex", justifyContent: "center" }}>
          © 2019—2022 Dapplets Project
        </span>
      </Footer>
    </Wrapper>
  );
};

export default connect(mapState, mapDispatch)(SidePanel);
