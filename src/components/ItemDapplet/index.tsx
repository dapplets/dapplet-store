import React, { useMemo } from "react";
import styled from "styled-components";

import styles from "./ItemDapplet.module.scss";
import {
  DappletButton,
  DappletButtonTypes,
} from "./DappletButton/DappletButton";

import Highlighter from "react-highlight-words";
import DappletListersPopup from "../../features/DappletListersPopup/DappletListersPopup";
import { IDapplet } from "../../models/dapplets";
import { RootDispatch, RootState } from "../../models";
import { Sort } from "../../models/sort";
import { connect } from "react-redux";
import { Modals, ModalsList } from "../../models/modals";
import { MyListElement } from "../../models/myLists";
import { Image } from "semantic-ui-react";
import { useCallback } from "react";

const mapState = (state: RootState) => ({
  address: state.user.address,
  isLocked: state.user.isLocked,
  blobUrl: state.blobUrl,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setModalOpen: (payload: Modals) => dispatch.modals.setModalOpen(payload),
  setExpanded: (payload: { id: number; isExpanded: boolean }) =>
    dispatch.dapplets.setExpanded(payload),
  setBlobUrl: (payload: { id: number; blobUrl: string }) =>
    dispatch.blobUrl.setBlobUrl(payload),
});

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

const ImagesWrapper = styled.div<{ count: number }>`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;

  a {
    color: #588ca3;
    text-decoration-line: underline;
    font-family: Montserrat;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 21px;
    letter-spacing: 0em;
    text-align: left;
  }
`;

const UnderUserInfo = styled.div`
  display: grid;
  grid-template-columns: max-content max-content max-content;
  grid-column-gap: 20px;
  color: #919191;
`;

const Line = styled.div`
  display: grid;
  height: 1px;
  background: #e3e3e3;
  margin-top: 10px;
`;

// const UnderUserInfoSeparator = styled.div`
//   width: 2px;
//   height: 100%;
//   background-color: #E3E3E3;
// `

const ButtonsWrapper = styled.div`
  display: grid;
  grid-template-rows: min-content min-content;
  grid-row-gap: 10px;
`;

interface ItemDappletProps {
  item: IDapplet;
  selectedDapplets: MyListElement[];
  localDapplets: MyListElement[];
  editLocalDappletsList: (item: IDapplet) => void;
  editSelectedDappletsList: (item: IDapplet) => void;
  searchQuery?: string;
  setAddressFilter: any;
  setOpenedList: any;
  trustedUsersList: string[];
  isNotDapplet: boolean;
}

const ItemDapplet = (props: ItemDappletProps & Props): React.ReactElement => {
  const {
    item,
    selectedDapplets,
    localDapplets,
    editLocalDappletsList,
    editSelectedDappletsList,
    searchQuery,
    setSort,
    trustedUsersList,
    address,
    setModalOpen,
    setExpanded,

    isNotDapplet,
    isLocked,
  } = props;

  const trustedList = useMemo(() => {
    return item.trustedUsers.filter(
      (user) => trustedUsersList.includes(user) || user === address,
    );
  }, [address, item.trustedUsers, trustedUsersList]);

  const otherList = useMemo(() => {
    return item.trustedUsers.filter(
      (user) => !(trustedUsersList.includes(user) || user === address),
    );
  }, [address, item.trustedUsers, trustedUsersList]);

  // const getAvatar = (loggedIn: string): HTMLDivElement => jazzicon(12, parseInt(loggedIn.slice(2, 10), 16));
  // const getAddressShort = (address: string) => address ? address.replace('0x000000000000000000000000', '0x') : ''

  const isLocalDapplet = useMemo(
    () => localDapplets.some((dapplet) => dapplet.name === item.name),
    [item.name, localDapplets],
  );

  const getSelectedType = useCallback(() => {
    const selectedDapplet = selectedDapplets.find(
      (dapplet) => dapplet.name === item.name,
    );
    if (selectedDapplet)
      switch (selectedDapplet.type) {
        case "Adding":
          return DappletButtonTypes.AddingToList;
        case "Removing":
          return DappletButtonTypes.RemovingFromList;
        default:
        case "Default":
          return DappletButtonTypes.InMyList;
      }
    return DappletButtonTypes.AddToList;
  }, [item.name, selectedDapplets]);

  const owner = useMemo(
    () => item.owner.replace("0x000000000000000000000000", "0x"),
    [item.owner],
  );

  const isOpen = useMemo(() => item.isExpanded, [item.isExpanded]);

  const handleClickOnItem = ({ target }: any) => {
    if (target.tagName === "BUTTON") return;
    setExpanded({
      id: item.id,
      isExpanded: !isOpen,
    });
  };

  if (!item) return <></>;
  return (
    <div
      style={{ display: "flex", width: "100%", wordBreak: "break-all" }}
      onClick={handleClickOnItem}
    >
      {item.icon ? (
        <Image
          className={styles.itemImage}
          src={item.icon}
          style={{ width: 85, height: 85, borderRadius: "50%", marginTop: 10 }}
        />
      ) : (
        <div
          style={{
            minWidth: 85,
            height: 85,
            borderRadius: "50%",
            marginTop: 10,
            background: "#919191",
          }}
        ></div>
      )}

      <div className={styles.left} style={{ flexGrow: 1, padding: "5px 18px" }}>
        <h3 className={styles.title}>
          <Highlighter
            textToHighlight={item.title}
            searchWords={[searchQuery || ""]}
            highlightStyle={{ background: "#ffff00", padding: 0 }}
          />
        </h3>

        {isOpen && (
          <>
            <div className={styles.author}>
              <Highlighter
                className={styles.author}
                textToHighlight={`${item.name}`}
                searchWords={[searchQuery || ""]}
                highlightStyle={{ background: "#ffff00", padding: 0 }}
              />
            </div>
          </>
        )}

        {[...trustedList, ...otherList].length > 0 && (
          <UnderUserInfo>
            <ImagesWrapper
              count={trustedList.slice(0, 3).length}
              className={styles.author}
            >
              <DappletListersPopup
                trustedList={trustedList}
                otherList={otherList}
                text={`in ${[...trustedList, ...otherList].length} list${
                  [...trustedList, ...otherList].length !== 1 ? "s" : ""
                }`}
                onClickSort={(address: string) => {
                  // console.log('hello')
                  setSort({
                    addressFilter: address,
                    selectedList: undefined,
                    searchQuery: "",
                  });
                }}
              />
            </ImagesWrapper>
          </UnderUserInfo>
        )}

        <div className={styles.author}>
          <span style={{ width: 60, display: "inline-block" }}>Author:</span>
          <a
            onClick={(e) => {
              e.stopPropagation();
              setSort({
                addressFilter: item.owner,
                selectedList: undefined,
                searchQuery: "",
              });
            }}
          >
            <Highlighter
              textToHighlight={owner}
              searchWords={[searchQuery || ""]}
              highlightStyle={{ background: "#ffff00", padding: 0 }}
            />
          </a>
        </div>

        {isOpen && (
          <>
            <div className={styles.author}>
              <span style={{ width: 60, display: "inline-block" }}>
                Update:
              </span>
              <Highlighter
                className={styles.author}
                textToHighlight={`${item.timestampToShow} (ver. ${item.versionToShow})`}
                searchWords={[searchQuery || ""]}
                highlightStyle={{ background: "#ffff00", padding: 0 }}
              />
            </div>
            <Line />
          </>
        )}

        <div className={styles.author}>
          <Highlighter
            className={styles.author}
            textToHighlight={item.description}
            searchWords={[searchQuery || ""]}
            highlightStyle={{ background: "#ffff00", padding: 0 }}
          />
        </div>
      </div>

      {/* TODO: YOU NEED TO CHECK HOW IT WORKS */}
      {/* TODO: DappletButtonTypes.InMyDapplets : DappletButtonTypes.AddToMy */}
      <ButtonsWrapper>
        <DappletButton
          type={
            isLocalDapplet
              ? DappletButtonTypes.InMyDapplets
              : DappletButtonTypes.AddToMy
          }
          onClick={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            if (isNotDapplet)
              setModalOpen({ openedModal: ModalsList.Install, settings: null });
            else editLocalDappletsList(item);
          }}
        />
        <DappletButton
          type={getSelectedType()}
          onClick={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            if (!address)
              setModalOpen({ openedModal: ModalsList.Login, settings: null });
            else editSelectedDappletsList(item);
          }}
          disabled={isLocked}
        />
      </ButtonsWrapper>
    </div>
  );
};

export default connect(mapState, mapDispatch)(React.memo(ItemDapplet));
