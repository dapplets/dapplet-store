import React, {
  useEffect,
  // useMemo,
  useState,
} from "react";
import { IDapplet, IRawDapplet } from "../../models/dapplets";

import Header from "./Header/Header";
import Overlay from "./Overlay/Overlay";
import SidePanel from "./SidePanel/SidePanel";
import styled from "styled-components/macro";
import DappletList from "./DappletList/DappletList";
import { Sort, SortTypes } from "../../models/sort";
import { RootDispatch, RootState } from "../../models";
import { connect } from "react-redux";
import { Lists, MyListElement } from "../../models/myLists";
import { Modals } from "../../models/modals";
import getIconUrl from "../../api/getIconUrl";
import parseRawDappletVersion from "../../lib/parseRawDappletVersion";
import {
  MAX_MODULES_COUNTER,
  MODULE_TYPES,
  REGISTRY_BRANCHES,
} from "../../constants";
import dappletRegistry from "../../api/dappletRegistry";

interface WrapperProps {
  isNotDapplet: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  display: grid;

  height: 100%;

  grid-template-columns: 455px 1fr 455px;
  grid-template-rows: 84px 1fr;

  grid-template-areas:
    "header header header"
    ${({ isNotDapplet }) =>
      `"sidePanel content ${!isNotDapplet ? "content" : "overlay"}"`}; ;
`;

/* probabaly need those again */
/* ${({ isNotDapplet }) =>
      isNotDapplet ? `455px` : "0"}; */

/* ${({ isSmall }) =>
      `"sidePanel content ${isSmall ? "content" : "overlay"}"`}; */

const StyledHeader = styled(Header)`
  grid-area: header;
`;

const StyledSidePanel = styled(SidePanel)`
  grid-area: sidePanel;
`;

const MainContent = styled.main`
  grid-area: content;

  padding: 0 !important;
  width: 100%;import { Notification } from '../../components/Notification/Notification';

`;

const StyledOverlay = styled(Overlay)`
  grid-area: overlay;
`;

const mapState = (state: RootState) => ({
  dapplets: Object.values(state.dapplets),
  sortType: state.sort.sortType,
  addressFilter: state.sort.addressFilter,
  searchQuery: state.sort.searchQuery,
  selectedList: state.sort.selectedList,
  isTrustedSort: state.sort.isTrustedSort,
  trigger: state.sort.trigger,
  address: state.user.address,
  trustedUsers: state.trustedUsers.trustedUsers,
  myLists: state.myLists,
});
const mapDispatch = (dispatch: RootDispatch) => ({
  setModalOpen: (payload: Modals) => dispatch.modals.setModalOpen(payload),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setTrustedUsers: (payload: string[]) =>
    dispatch.trustedUsers.setTrustedUsers(payload),
  setMyList: (payload: { name: Lists; elements: MyListElement[] }) =>
    dispatch.myLists.setMyList(payload),
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

export interface LayoutProps {
  selectedList?: Lists;
  setSelectedList: any;
  trustedUsersList: string[];
  setAddressFilter: any;
  openedList: any;
  setOpenedList: any;
  windowWidth: number;
  isNotDapplet: boolean;
}

const Layout = ({
  setSelectedList,
  trustedUsersList,
  setAddressFilter,
  openedList,
  setOpenedList,
  windowWidth,
  isNotDapplet,
  dapplets,
  sortType,
  addressFilter,
  searchQuery,
  selectedList,
  isTrustedSort,
  trigger,
  address,
  trustedUsers,
  myLists,
  setModalOpen,
  setSort,
  setTrustedUsers,
  setMyList,
}: LayoutProps & Props): React.ReactElement<LayoutProps> => {
  const localDappletsList = myLists[Lists.MyDapplets];
  const selectedDappletsList = myLists[Lists.MyListing];

  const [dappletsByList, setDappletsByList] = useState<IDapplet[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [hexifiedAddressFilter, setHexifiedAddresFilter] = useState("");
  const [hexifiedTrustedUserList, setHexifiedTrustedUserList] = useState<any>(
    [],
  );

  useEffect(() => {
    (async () => {
      // setIsListLoading(true);
      const hexifiedAdresses = await Promise.all(
        trustedUsers.map(async (user) => {
          if (!user.startsWith("0x")) {
            return await dappletRegistry.provider.resolveName(user);
          } else {
            return user;
          }
        }),
      );
      setHexifiedTrustedUserList(hexifiedAdresses);
      // setIsListLoading(false);
    })();
  }, [trustedUsers]);

  useEffect(() => {
    if (dapplets.length === 0) return;

    if (addressFilter || selectedList === "Selected dapplets") {
      const getModulesOfListing = async (addressFilter: string) => {
        // setIsListLoading(true);
        const offset = 0;
        const limit = MAX_MODULES_COUNTER;
        const listingAddress = addressFilter.startsWith("0x")
          ? addressFilter
          : await dappletRegistry.provider.resolveName(addressFilter);

        /* TMP dirt */
        if (listingAddress === null)
          throw new Error("The hex pair for this ENS does not exist");

        if (addressFilter) setHexifiedAddresFilter(listingAddress);

        const data = await dappletRegistry.getModulesOfListing(
          listingAddress,
          REGISTRY_BRANCHES.DEFAULT,
          offset,
          limit,
          false,
        );

        const { modules } = data;

        const rawDapplets = modules.filter(
          (module: IRawDapplet) => module.moduleType === MODULE_TYPES.DAPPLET,
        );

        let { id: lastDappId } = dapplets.reduce((prev, current) => {
          const isNextDapp = current.id > prev.id;
          return isNextDapp ? current : prev;
        });

        // const publicList: IDapplet[] = [];
        const proms = rawDapplets.map(
          async (dapplet: IRawDapplet, i: number) => {
            const { name, description, title, icon } = dapplet;

            const presentedDapplet = dapplets.find(
              (presentedDapp) => presentedDapp.name === name,
            );

            // console.log(presentedDapplet)

            const isPresented = presentedDapplet !== undefined;

            if (isPresented) {
              return presentedDapplet;
            } else {
              const iconUrl = await getIconUrl(icon);

              const listers = await dappletRegistry.getListersByModule(
                name,
                offset,
                limit,
              );

              const formatted: IDapplet = {
                id: lastDappId + 1,
                description: description,
                icon: iconUrl,
                name: name,
                owner: data.owners[i],
                title: title,
                versionToShow: parseRawDappletVersion(
                  data.lastVersions[i].version,
                ),
                version: parseRawDappletVersion(data.lastVersions[i].version),
                /* TODO: timestamp to be implemented */
                timestampToShow: "no info",
                timestamp: "no info",
                listers: listers,
                isExpanded: false,
                interfaces: [],
              };

              lastDappId++;
              return formatted;
            }
          },
        );

        const publicList = await Promise.all(proms);

        setDappletsByList(publicList);
        // setIsListLoading(false);
      };

      getModulesOfListing(addressFilter || "");
    } else if (selectedList === "My dapplets") {
      /* TODO: won't work after pagination implemented, update ASAP */
      const selectedDappletNames = myLists[selectedList].map(
        (dapp) => dapp.name,
      );

      const localDapplets = dapplets.filter((dapp) =>
        selectedDappletNames.includes(dapp.name),
      );

      setDappletsByList(localDapplets);
    } else {
      setDappletsByList(dapplets);
    }
  }, [addressFilter, dapplets, myLists, selectedList]);

  /* Old filter version, keep for history for now */
  /* const dappletsByList = useMemo(() => {
    // If addressFilter is not empty,
    // return all dapplets
    // and filter it inside ListDapplets in filterDappletsByCondition
    if (!dapplets || !selectedList || addressFilter) return dapplets;

    const selectedDapplets = myLists[selectedList];

    if (!selectedDapplets) return dapplets;

    const formatedSelectedDapplets = selectedDapplets.flatMap(
      (selectedDapplet) =>
        dapplets.find((dapp) => dapp.name === selectedDapplet.name) || [],
    );

    return formatedSelectedDapplets;
  }, [addressFilter, dapplets, myLists, selectedList]); */

  return (
    <Wrapper isNotDapplet={isNotDapplet}>
      <StyledHeader selectedList={selectedList} isNotDapplet={isNotDapplet} />
      <StyledSidePanel
        localDappletsList={localDappletsList}
        selectedDappletsList={selectedDappletsList}
        setSelectedList={setSelectedList}
        trustedUsersList={trustedUsersList}
        setAddressFilter={setAddressFilter}
        openedList={openedList}
        setOpenedList={setOpenedList}
        dapplets={dapplets}
      />

      <MainContent>
        <DappletList
          hexifiedTrustedUserList={hexifiedTrustedUserList}
          setIsListLoading={setIsListLoading}
          hexifiedAddressFilter={hexifiedAddressFilter}
          isListLoading={isListLoading}
          dapplets={dappletsByList}
          selectedDapplets={selectedDappletsList}
          localDapplets={localDappletsList}
          selectedList={selectedList}
          setSelectedList={(newSelectedList: Lists | undefined) =>
            setSort({ selectedList: newSelectedList, searchQuery: "" })
          }
          sortType={sortType || SortTypes.ABC}
          searchQuery={searchQuery || ""}
          editSearchQuery={(newtSearchQuery: string) =>
            setSort({ searchQuery: newtSearchQuery })
          }
          addressFilter={addressFilter || ""}
          setAddressFilter={(newAddressFilter: string) =>
            setSort({ addressFilter: newAddressFilter })
          }
          trustedUsersList={trustedUsers}
          setTrustedUsersList={setTrustedUsers}
          isTrustedSort={isTrustedSort || false}
          setOpenedList={setOpenedList}
          address={address || ""}
          trigger={trigger || false}
          isNotDapplet={isNotDapplet}
          setModalOpen={setModalOpen}
        />
      </MainContent>

      {isNotDapplet && <StyledOverlay isNotDapplet={isNotDapplet} />}
    </Wrapper>
  );
};

export default connect(mapState, mapDispatch)(Layout);
