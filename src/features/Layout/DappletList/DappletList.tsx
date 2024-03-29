import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Header } from "semantic-ui-react";
import { ReactComponent as Loader } from "../../../components/Notification/loader.svg";
import { saveListToLocalStorage } from "../../../lib/localStorage";
import styles from "./DappletList.module.scss";
import SortableList from "../../../components/SortableList";
import ItemDapplet from "../../../components/ItemDapplet";
import { DappletsListItemTypes } from "../../../components/DappletsListItem/DappletsListItem";
import ListerProfile from "../../ProfileInList/ListerProfile";
import { IDapplet } from "../../../models/dapplets";
import { Sort, SortTypes } from "../../../models/sort";
import { Lists, MyListElement } from "../../../models/myLists";
import { RootDispatch, RootState } from "../../../models";
import { connect } from "react-redux";
import styled from "styled-components/macro";
import Dropdown from "../Dropdown/Dropdown";
import Input from "../Input";
import cn from "classnames";
import {
  removeDappletItem,
  updateDappletItem,
} from "../../../lib/updateDappletItem";
import { updateMyListing } from "../../../lib/updateDappletList";
import { TrustedUser } from "../../../models/trustedUsers";

const MainContentWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
`;

interface CheckboxWrapperProps {
  isTrustedSort: boolean;
}

const CheckboxWrapper = styled.div<CheckboxWrapperProps>`
  display: grid;
  grid-template-columns: max-content max-content;
  grid-column-gap: 8px;
  padding-right: 15px;
  cursor: pointer;
  user-select: none;

  & > div {
    width: 16px;
    height: 16px;
    background: #ffffff;
    border-radius: 50%;
    margin-top: 2px;
    border: ${({ isTrustedSort }) =>
      isTrustedSort ? "5px solid #D9304F" : "1px solid #919191"};
    position: relative;
  }
`;

const ButtonAll = styled.div`
  grid-area: all;
  justify-self: end;
  align-self: end;
  background: none;

  & button {
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0em;
    text-align: center;
    padding: 10px;
    cursor: pointer;
    border: none;
    background: none;
  }
`;

const dropdownItems = [
  {
    id: 1,
    text: SortTypes.ABC,
  },
  {
    id: 2,
    text: SortTypes.ABCReverse,
  },
  /* {
    id: 3,
    text: SortTypes.Newest,
  },
  {
    id: 4,
    text: SortTypes.Oldest,
  }, */
];

const mapState = (state: RootState) => ({
  ensNames: state.ensNames,
  trustedUsers: state.trustedUsers.trustedUsers,
  isLocked: state.user.isLocked,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  getEnsNames: (addresses: string[]) =>
    dispatch.ensNames.getEnsNames(addresses),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  addTrustedUser: (payload: string) =>
    dispatch.trustedUsers.addTrustedUser(payload),
  removeTrustedUser: (payload: string) =>
    dispatch.trustedUsers.removeTrustedUser(payload),
  addMyDapplet: (payload: { registryUrl: string; moduleName: string }) =>
    dispatch.myLists.addMyDapplet(payload),
  removeMyDapplet: (payload: { registryUrl: string; moduleName: string }) =>
    dispatch.myLists.removeMyDapplet(payload),
  setMyList: (payload: { name: Lists; elements: MyListElement[] }) =>
    dispatch.myLists.setMyList(payload),
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

interface FilterDappletsByCondition {
  sortedList: IDapplet[];
  searchQuery: string;
  addressFilter: string;
  isTrustedSort: boolean;
  isNotDapplet: any;
}

export interface DappletListProps {
  dapplets: IDapplet[];
  selectedDapplets: MyListElement[];
  localDapplets: MyListElement[];
  selectedList?: Lists;
  setSelectedList: any;
  sortType: string;
  searchQuery: string;
  addressFilter: string;
  setAddressFilter: any;
  editSearchQuery: any;
  trustedUsersList: TrustedUser[];
  setTrustedUsersList: any;
  isTrustedSort: boolean;
  address: string;
  trigger: boolean;
  isNotDapplet: boolean;
  setModalOpen: any;
  setMyList: any;
  isListLoading: boolean;
  hexifiedAddressFilter: string;
  // setIsListLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DappletList = ({
  dapplets,
  selectedDapplets,
  localDapplets,
  selectedList,
  setSelectedList,
  sortType,
  searchQuery,
  addressFilter,
  setAddressFilter,
  editSearchQuery,
  // trustedUsersList,
  setTrustedUsersList,
  isTrustedSort,
  address,
  trigger,
  isNotDapplet,
  setModalOpen,
  ensNames,
  trustedUsers,
  isLocked,
  getEnsNames,
  setSort,
  addTrustedUser,
  removeTrustedUser,
  addMyDapplet,
  removeMyDapplet,
  setMyList,
  isListLoading,
  // setIsListLoading,
  hexifiedAddressFilter,
}: DappletListProps & Props): React.ReactElement => {
  const ref = useRef<HTMLDivElement>(null);

  const [expandedCards, setExpandedCards] = useState([]);
  const [sortedDapplets, setSortedDapplets] = useState<IDapplet[]>([]);

  const collator = useMemo(
    () => new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }),
    [],
  );

  const editList = useMemo(
    () =>
      (
        item: IDapplet,
        dappletsList: MyListElement[],
        type: DappletsListItemTypes,
      ) => {
        const isLocalDapplet = dappletsList.some((d) => d.name === item.name);
        let nowDappletsList;

        if (isLocalDapplet) {
          nowDappletsList = dappletsList.filter(
            (dapplet) => dapplet.name !== item.name,
          );
          removeMyDapplet({
            registryUrl: "",
            moduleName: item.name,
          });
        } else {
          const newDapplet = {
            name: item.name,
            id: item.id,
            type,
          };
          nowDappletsList = [...dappletsList, newDapplet];
          addMyDapplet({
            registryUrl: "",
            moduleName: item.name,
          });
        }

        const newDappletsList: MyListElement[] = nowDappletsList;
        return newDappletsList;
      },
    [addMyDapplet, removeMyDapplet],
  );

  const editLocalDappletsList = useMemo(
    () => (item: IDapplet) => {
      const newLocalDappletsList = editList(
        item,
        localDapplets,
        DappletsListItemTypes.Default,
      );
      setMyList({
        name: Lists.MyDapplets,
        elements: newLocalDappletsList,
      });
      saveListToLocalStorage(newLocalDappletsList, Lists.MyDapplets);
    },
    [editList, localDapplets, setMyList],
  );

  // TODO: most likely here the deleted element becomes up
  const editSelectedDappletsList = useMemo(
    () => (item: IDapplet) => {
      let nowDappletsList: MyListElement[] = selectedDapplets;
      const indexSelectedDapplet = nowDappletsList.findIndex(
        (d) => d.name === item.name,
      );

      if (indexSelectedDapplet >= 0) {
        const getDappletByIndex = nowDappletsList[indexSelectedDapplet];
        const type = getDappletByIndex.type;

        switch (type) {
          // If we have a DEFAULT when clicked, the dapplet becomes type Removing
          case DappletsListItemTypes.Default: {
            const removing = updateDappletItem(
              getDappletByIndex,
              "type",
              DappletsListItemTypes.Removing,
            );

            nowDappletsList = updateMyListing(
              nowDappletsList,
              removing,
              indexSelectedDapplet,
            );
            break;
          }

          // If we have a REMOVING when clicked, the dapplet becomes type Default
          case DappletsListItemTypes.Removing: {
            const adding = updateDappletItem(
              getDappletByIndex,
              "type",
              DappletsListItemTypes.Default,
            );

            nowDappletsList = updateMyListing(
              nowDappletsList,
              adding,
              indexSelectedDapplet,
            );
            break;
          }

          case DappletsListItemTypes.Adding: {
            nowDappletsList = removeDappletItem(
              nowDappletsList,
              indexSelectedDapplet,
            );
            break;
          }

          default:
            break;
        }
      } else {
        nowDappletsList = [
          ...nowDappletsList,
          { name: item.name, type: DappletsListItemTypes.Adding, id: item.id },
        ];
      }

      const newDappletsList: MyListElement[] = nowDappletsList;
      saveListToLocalStorage(newDappletsList, Lists.MyListing);

      setMyList({
        name: Lists.MyListing,
        elements: newDappletsList,
      });
    },
    [selectedDapplets, setMyList],
  );

  const titleText = useMemo(() => {
    if (selectedList) {
      switch (selectedList) {
        case Lists.MyDapplets:
          return "Local list";
        case Lists.MyListing:
          return "Public list";
        default:
          return "";
      }
    }
    if (searchQuery) return "Search Result";
    if (addressFilter) {
      if (!ensNames[addressFilter]) getEnsNames([addressFilter]);
      return ensNames[addressFilter] || "User Listing";
    }
    if (isTrustedSort) return "Dapplets from my trusted users";
    return "All Dapplets";
  }, [
    addressFilter,
    ensNames,
    getEnsNames,
    isTrustedSort,
    searchQuery,
    selectedList,
  ]);

  const listDappletsHeader = useMemo(
    () => (
      <div
        style={{
          display: "flex",
          margin: "30px 35px 15px",
          alignItems: "baseline",
          justifyContent: "space-between",
          height: 30,
        }}
      >
        <Header
          as="h2"
          className="infoTitle"
          size="medium"
          style={{
            flexGrow: 1,
          }}
        >
          {titleText}
        </Header>
        {titleText === "My Dapplets" && (
          <ButtonAll>
            <button
              onClick={() => {
                setAddressFilter("");
                editSearchQuery("");
                setSelectedList(undefined);
              }}
            >
              Show All
            </button>
          </ButtonAll>
        )}
      </div>
    ),
    [editSearchQuery, setAddressFilter, setSelectedList, titleText],
  );

  const sortDappletsByType = useCallback(
    (dapplets: IDapplet[], sortType: string): IDapplet[] => {
      return dapplets.sort((a, b) => {
        if (address === addressFilter) return 0;

        switch (sortType) {
          case SortTypes.ABC:
            return collator.compare(a.title, b.title);

          case SortTypes.ABCReverse:
            return collator.compare(b.title, a.title);

          /* case SortTypes.Newest:
            return collator.compare(b.timestamp, a.timestamp);

          case SortTypes.Oldest:
            return collator.compare(a.timestamp, b.timestamp); */

          default:
            return 0;
        }
      });
    },
    [address, addressFilter, collator],
  );

  const filterDappletsByCondition = useCallback(
    ({
      sortedList,
      searchQuery,
      isTrustedSort,
      isNotDapplet,
    }: FilterDappletsByCondition): IDapplet[] => {
      if (searchQuery) {
        sortedList = sortedList.filter(
          (dapplet) =>
            dapplet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dapplet.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dapplet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dapplet.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
      }

      if (isTrustedSort && !isNotDapplet) {
        sortedList = sortedList.filter(({ listers }) => {
          return trustedUsers
            .map((user) => user.hex)
            .some((user) => {
              return listers.includes(user);
            });
        });
      }

      return sortedList;
    },
    [trustedUsers],
  );

  useEffect(() => {
    const sortedList = sortDappletsByType(dapplets, sortType);
    const filtered = filterDappletsByCondition({
      sortedList,
      addressFilter,
      isNotDapplet,
      isTrustedSort,
      searchQuery,
    });
    setSortedDapplets(filtered);
  }, [
    addressFilter,
    dapplets,
    filterDappletsByCondition,
    isNotDapplet,
    isTrustedSort,
    searchQuery,
    selectedList,
    sortDappletsByType,
    sortType,
  ]);

  const chooseList = useMemo(
    () => ({
      [Lists.MyListing]: selectedDapplets,
      [Lists.MyDapplets]: localDapplets,
      [Lists.MyOldListing]: [],
    }),
    [localDapplets, selectedDapplets],
  );

  const chooseSetMethod = useMemo(
    () => ({
      [Lists.MyListing]: (elements: MyListElement[]) =>
        setMyList({
          name: Lists.MyListing,
          elements,
        }),
      [Lists.MyDapplets]: (elements: MyListElement[]) =>
        setMyList({
          name: Lists.MyDapplets,
          elements,
        }),
      /* TODO: EWW DIRT, GET RID OF IT */
      [Lists.MyOldListing]: [] as any,
    }),
    [setMyList],
  );

  useEffect(() => {
    ref?.current?.scrollTo(0, 0);
  }, [
    searchQuery,
    addressFilter,
    isTrustedSort,
    selectedList,
    sortType,
    trigger,
    ref,
  ]);

  return (
    <article
      style={{
        position: "static",
        padding: "0 !important",
        margin: "0 !important",
      }}
    >
      <div
        ref={ref}
        style={{
          height: "calc(100vh - 84px)",
          overflow: "auto",
          padding: "0 !important",
          margin: "0 !important",
        }}
      >
        <div /* style={{ padding: "0 15px" }} */>
          {(addressFilter !== "" || selectedList) &&
            selectedList !== Lists.MyDapplets && (
              <ListerProfile
                hexifiedAddressFilter={hexifiedAddressFilter}
                setTrustedUsersList={setTrustedUsersList}
                isNotDapplet={isNotDapplet}
                setModalOpen={setModalOpen}
                title={titleText}
                addTrustedUser={addTrustedUser}
                removeTrustedUser={removeTrustedUser}
              />
            )}
          <MainContentWrapper>
            <Input
              searchQuery={searchQuery || ""}
              editSearchQuery={(newSearchQuery: string | undefined) =>
                setSort({ searchQuery: newSearchQuery })
              }
            />
            {!selectedList && (
              <Dropdown
                items={dropdownItems}
                active={sortType || SortTypes.ABC}
                setActive={(newSortType: SortTypes) =>
                  setSort({ sortType: newSortType })
                }
              />
            )}
            {address !== addressFilter &&
              !isNotDapplet &&
              !trustedUsers
                .map((user) => user.hex)
                .includes(addressFilter || "") && (
                <CheckboxWrapper
                  isTrustedSort={isTrustedSort || false}
                  onClick={() => setSort({ isTrustedSort: !isTrustedSort })}
                >
                  <div></div>
                  <span>From trusted users</span>
                </CheckboxWrapper>
              )}
          </MainContentWrapper>
          {!(
            (addressFilter !== "" || selectedList) &&
            selectedList !== Lists.MyDapplets
          ) && listDappletsHeader}
          {isListLoading && (
            <div className={styles.loaderContainer}>
              <Loader
                width={50}
                height={50}
                className="notification-custom-animate"
              />
            </div>
          )}

          <div
            style={{
              borderTop: "1px solid lightgrey",
              padding: "0 15px",
              // maxWidth: "800px",
            }}
          >
            {!isListLoading &&
              sortedDapplets.length !== 0 &&
              (selectedList && addressFilter === address ? (
                <SortableList
                  expandedCards={expandedCards}
                  setExpandedCards={setExpandedCards}
                  dapplets={sortedDapplets}
                  items={chooseList[selectedList]}
                  setItems={chooseSetMethod[selectedList]}
                  selectedDapplets={selectedDapplets}
                  localDapplets={localDapplets}
                  editLocalDappletsList={editLocalDappletsList}
                  editSelectedDappletsList={editSelectedDappletsList}
                  setAddressFilter={setAddressFilter}
                  addressFilter={addressFilter}
                  searchQuery={searchQuery}
                  trustedUsersList={trustedUsers}
                  isTrustedSort={isTrustedSort}
                  selectedList={selectedList}
                  isNotDapplet={isNotDapplet}
                />
              ) : (
                sortedDapplets.map((item: any, i: number) => {
                  const selected = selectedDapplets.find(
                    (d) => d.id === item.id,
                  )?.type;
                  const isAdding = selected === DappletsListItemTypes.Adding;
                  const isRemoving =
                    selected === DappletsListItemTypes.Removing;

                  return (
                    <section
                      className={cn(styles.item, {
                        [styles.isChanged]: isAdding || isRemoving,
                      })}
                      key={item.name}
                    >
                      <div className={styles.itemContainer}>
                        <ItemDapplet
                          expandedCards={expandedCards}
                          setExpandedCards={setExpandedCards}
                          key={item.name}
                          item={item}
                          selectedDapplets={selectedDapplets}
                          localDapplets={localDapplets}
                          editLocalDappletsList={editLocalDappletsList}
                          editSelectedDappletsList={editSelectedDappletsList}
                          searchQuery={searchQuery}
                          setAddressFilter={setAddressFilter}
                          trustedUsersList={trustedUsers}
                          isNotDapplet={isNotDapplet}
                        />
                      </div>
                    </section>
                  );
                })
              ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default connect(mapState, mapDispatch)(React.memo(DappletList));
