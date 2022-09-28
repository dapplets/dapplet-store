import React, { DetailedHTMLProps, HTMLAttributes, useMemo } from "react";

import { DappletsListItemTypes } from "../../../components/DappletsListItem/DappletsListItem";
import { RootDispatch, RootState } from "../../../models";
import { Sort } from "../../../models/sort";
import { connect } from "react-redux";
import { Modals } from "../../../models/modals";
import { IDapplet, LinkedListDiff } from "../../../models/dapplets";
import styled from "styled-components/macro";
import { Lists, MyListElement } from "../../../models/myLists";
import SideNav from "./SideNav";
import { PUBLIC_LIST } from "../../../constants";
import Profile from "../Profile/Profile";
import { TrustedUser } from "../../../models/trustedUsers";

const mapState = (state: RootState) => ({
  address: state.user.address,
  provider: state.user.provider,
  isLocked: state.user.isLocked,
  myOldListing: state.myLists[Lists.MyOldListing],
  myListing: state.myLists[Lists.MyListing],
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setModalOpen: (payload: Modals) => dispatch.modals.setModalOpen(payload),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  pushMyListing: (payload: {
    address: string;
    provider: any;
    dappletsNames: { [name: number]: string };
    links: LinkedListDiff[];
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
  flex-wrap: wrap;

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
  setSelectedList: React.Dispatch<React.SetStateAction<Lists | undefined>>;
  selectedDappletsList: MyListElement[];
  trustedUsersList: TrustedUser[];
  setAddressFilter: any;
  dapplets: IDapplet[];
}

const SidePanel = ({
  className,
  selectedDappletsList,
  dapplets,
  address,
  provider,
  myListing: listingEvents,
  pushMyListing,
  setLocked,
}: SidePanelProps & Props): React.ReactElement => {
  const dappletsStandard = useMemo(() => Object.values(dapplets), [dapplets]);

  const pushSelectedDappletsList = async () => {
    const links: LinkedListDiff[] = [];
    /* persisting = default(rearranging) + add */
    const persistingEvents = listingEvents.filter(
      (event) => event.type !== DappletsListItemTypes.Removing,
    );

    /* Loop the list for it be interpreted as empty */
    const shouldClearList = persistingEvents.length === 0;
    if (shouldClearList)
      links.push({ prev: PUBLIC_LIST.HEADER, next: PUBLIC_LIST.TAIL });

    const rearrangingEvents = listingEvents.filter(
      (event) => event.type === DappletsListItemTypes.Default,
    );

    const currentListLastDappletName =
      rearrangingEvents.length > 0
        ? rearrangingEvents[rearrangingEvents.length - 1].name
        : PUBLIC_LIST.HEADER;

    let lastAdded: LinkedListDiff | null = null;
    listingEvents.forEach((listingEvent, i) => {
      if (listingEvent.type === DappletsListItemTypes.Removing) {
        if (!shouldClearList) {
          const isInitialEvent = i === 0;
          if (isInitialEvent) {
            links.push({
              prev: PUBLIC_LIST.HEADER,
              next: rearrangingEvents[0].name,
            });
          } else {
            const listingEventsReversedCopy = listingEvents.slice().reverse();
            const exPrev = listingEventsReversedCopy.find((ev, evIndex) => {
              const indexFromBehind = listingEvents.length - 1 - i;
              return (
                evIndex > indexFromBehind &&
                ev.type === DappletsListItemTypes.Default
              );
            });

            const exNext = listingEvents.find(
              (ev, evIndex) =>
                evIndex > i && ev.type === DappletsListItemTypes.Default,
            );

            links.push({
              prev: exPrev?.name || PUBLIC_LIST.HEADER,
              next: exNext?.name || PUBLIC_LIST.TAIL,
            });
          }
        }

        links.push({ prev: listingEvent.name, next: PUBLIC_LIST.HEADER });
      }

      if (listingEvent.type === DappletsListItemTypes.Adding) {
        if (!lastAdded) {
          links.push({
            prev: currentListLastDappletName,
            next: listingEvent.name,
          });

          links.push({
            prev: listingEvent.name,
            next: PUBLIC_LIST.TAIL,
          });

          lastAdded = links[links.length - 1];
        } else {
          lastAdded.next = listingEvent.name;

          links.push({
            prev: listingEvent.name,
            next: PUBLIC_LIST.TAIL,
          });

          lastAdded = links[links.length - 1];
        }
      }
    });

    persistingEvents.forEach((persistingEvent, newIndex) => {
      const isInitialEl = newIndex === 0;

      const indexDiff = persistingEvent.indexDiff || 0;
      const isRearrangedEl = indexDiff !== 0;

      if (isInitialEl && isRearrangedEl) {
        links.push({
          prev: PUBLIC_LIST.HEADER,
          next: persistingEvent.name,
        });
      }

      const nextElement = persistingEvents[newIndex + 1];
      const shouldSetNext = nextElement && indexDiff !== nextElement.indexDiff;

      if (shouldSetNext) {
        links.push({
          prev: persistingEvent.name,
          next: nextElement.name,
        });
      }

      const isLastEl = newIndex === persistingEvents.length - 1;

      if (isLastEl) {
        links.push({
          prev: persistingEvent.name,
          next: PUBLIC_LIST.TAIL,
        });
      }
    });

    const deduplicatedLinks = links.filter(
      (currentLink, index, links) =>
        index ===
        links.findIndex(
          (linkToCompareTo) =>
            linkToCompareTo.prev === currentLink.prev &&
            linkToCompareTo.next === currentLink.next,
        ),
    );

    try {
      const dappletsNames: { [name: number]: string } = {};

      dappletsStandard.forEach(({ id, name }) => {
        dappletsNames[id] = name;
      });

      setLocked(true);
      await pushMyListing({
        address: address || "",
        provider,
        dappletsNames,
        links: deduplicatedLinks,
      });
    } catch (error) {
      console.error({ error });
    }
    setLocked(false);
  };

  /* return <div style={{width: "100%", background: "red"}}></div> */

  return (
    <Wrapper className={className}>
      <Profile />

      <SideNav
        selectedDappletsList={selectedDappletsList}
        onPush={pushSelectedDappletsList}
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
