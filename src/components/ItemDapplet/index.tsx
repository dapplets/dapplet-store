import React, { useMemo, useState } from "react";
import styled from "styled-components/macro";
import { ReactComponent as DappletListItemMoved } from "../DappletsListItem/arrow-down-circle.svg";
import { DAPPLET_LISTING_STAGES } from "../../constants";
import cn from "classnames";
import Highlighter from "react-highlight-words";
import DappletListersPopup from "../../features/DappletListersPopup/DappletListersPopup";
import { IDapplet } from "../../models/dapplets";
import { RootDispatch, RootState } from "../../models";
import { Sort } from "../../models/sort";
import { connect } from "react-redux";
import { Modals, ModalsList } from "../../models/modals";
import { Lists, MyListElement } from "../../models/myLists";
import { Image } from "semantic-ui-react";
import { useCallback } from "react";
import { DappletsListItemTypes } from "../DappletsListItem/DappletsListItem";
import Button from "./Button";

import styles from "./ItemDapplet.module.scss";

const mapState = (state: RootState) => ({
  address: state.user.address,
  isLocked: state.user.isLocked,
  blobUrl: state.blobUrl,
  myOldListing: state.myLists[Lists.MyOldListing],
  myListing: state.myLists[Lists.MyListing],
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

const ItemDapplet = ({
  item,
  selectedDapplets,
  localDapplets,
  editLocalDappletsList,
  editSelectedDappletsList,
  searchQuery,
  setSort,
  trustedUsersList,
  myOldListing,
  myListing,
  address,
  setModalOpen,
  setExpanded,
  isNotDapplet,
  isLocked,
}: ItemDappletProps & Props): React.ReactElement => {
  const isLocalListEmpty = localDapplets.length === 0;
  const isPublicListEmpty = myListing.length === 0;

  // const [context, setContext] = useState<null | string>(null);

  const trustedList = useMemo(() => {
    return item.listers.filter(
      (user) => trustedUsersList.includes(user) || user === address,
    );
  }, [address, item.listers, trustedUsersList]);

  const otherList = useMemo(() => {
    return item.listers.filter(
      (user) => !(trustedUsersList.includes(user) || user === address),
    );
  }, [address, item.listers, trustedUsersList]);

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
          return DAPPLET_LISTING_STAGES.PENIDNG_ADD;
        case "Removing":
          return DAPPLET_LISTING_STAGES.PENDING_REMOVE;
        default:
        case "Default":
          return DAPPLET_LISTING_STAGES.PRESENTED;
      }
    return DAPPLET_LISTING_STAGES.ADD;
  }, [item.name, selectedDapplets]);

  const owner = useMemo(
    () => item.owner.replace("0x000000000000000000000000", "0x"),
    [item.owner],
  );

  const isOpen = useMemo(() => item.isExpanded, [item.isExpanded]);

  const handleClickOnItem = async ({ target }: any) => {
    if (target.tagName === "BUTTON") return;

    /* const context = await Promise.resolve("twitter");

    setContext(context); */

    setExpanded({
      id: item.id,
      isExpanded: !isOpen,
    });
  };

  const dappletIndexOverOldListing = useMemo(() => {
    return myOldListing.findIndex(
      (i) => i.type !== DappletsListItemTypes.Adding && i.name === item.name,
    );
  }, [
    myOldListing,
    myListing,
    selectedDapplets,
    editLocalDappletsList,
    editSelectedDappletsList,
  ]);

  const dappletIndexOverListing = useMemo(() => {
    return myListing.findIndex(
      (i) => i.type !== DappletsListItemTypes.Adding && i.name === item.name,
    );
  }, [
    myListing,
    selectedDapplets,
    editLocalDappletsList,
    editSelectedDappletsList,
  ]);

  const listLength = [...trustedList, ...otherList].length;

  const onLocalListingButtonClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isNotDapplet)
      setModalOpen({
        openedModal: ModalsList.Install,
        settings: null,
      });
    else {
      if (isLocalListEmpty) {
        setModalOpen({
          openedModal: ModalsList.FirstLocalDapplet,
          settings: {
            onAccept: () => {
              editLocalDappletsList(item);
              setModalOpen({ openedModal: null, settings: null });
            },
            onCancel: () => setModalOpen({ openedModal: null, settings: null }),
            dapplet: item,
          },
        });
        return;
      }
      editLocalDappletsList(item);
    }
  };

  const onPublicListingButtonClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!address)
      setModalOpen({
        openedModal: ModalsList.Login,
        settings: null,
      });
    else {
      if (isPublicListEmpty) {
        setModalOpen({
          openedModal: ModalsList.FirstPublicDapplet,
          settings: {
            onAccept: () => {
              editSelectedDappletsList(item);
              setModalOpen({ openedModal: null, settings: null });
            },
            onCancel: () => setModalOpen({ openedModal: null, settings: null }),
            dapplet: item,
          },
        });
        return;
      }
      editSelectedDappletsList(item);
    }
  };

  const isIndexUpdated = dappletIndexOverOldListing === dappletIndexOverListing;
  const isNewIndexLesser = dappletIndexOverListing < dappletIndexOverOldListing;

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
          style={{
            width: 85,
            height: 85,
            borderRadius: "50%",
            marginTop: 10,
          }}
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
        <div className={styles.titleWrapper}>
          {!isIndexUpdated && address && (
            <div className={styles.order}>
              <DappletListItemMoved
                className={isNewIndexLesser ? styles.up : styles.down}
              />
              {Math.abs(dappletIndexOverOldListing - dappletIndexOverListing)}
            </div>
          )}
          <h3 className={styles.title}>
            <Highlighter
              textToHighlight={item.title}
              searchWords={[searchQuery || ""]}
              highlightStyle={{ background: "#ffff00", padding: 0 }}
            />
          </h3>
          {address === item.owner && <div className={styles.label}>dev</div>}
        </div>

        {isOpen && (
          <>
            <div className={cn(styles.text)}>
              <Highlighter
                className={styles.text}
                textToHighlight={`${item.name}`}
                searchWords={[searchQuery || ""]}
                highlightStyle={{ background: "#ffff00", padding: 0 }}
              />
            </div>
          </>
        )}

        {listLength > 0 && (
          <UnderUserInfo>
            <ImagesWrapper
              count={trustedList.slice(0, 3).length}
              className={styles.text}
            >
              <DappletListersPopup
                trustedList={trustedList}
                otherList={otherList}
                text={`in ${listLength} list${listLength !== 1 ? "s" : ""}`}
                onClickSort={(address: string) => {
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

        <div className={cn(styles.text, styles.dInlineBlock)}>
          <span style={{ width: 60, display: "inline-block" }}>Author:</span>
          <a
            style={{ display: "inline" }}
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
            <div className={styles.text}>
              <span style={{ width: 60, display: "inline-block" }}>
                Update:
              </span>
              <Highlighter
                className={styles.text}
                textToHighlight={`${item.timestampToShow} (ver. ${item.versionToShow})`}
                searchWords={[searchQuery || ""]}
                highlightStyle={{ background: "#ffff00", padding: 0 }}
              />
            </div>

            {/* {isOpen && <p>{context}</p>} */}

            <Line />
          </>
        )}

        <div className={styles.text}>
          <Highlighter
            className={styles.text}
            textToHighlight={item.description}
            searchWords={[searchQuery || ""]}
            highlightStyle={{ background: "#ffff00", padding: 0 }}
          />
        </div>
      </div>

      {/* TODO: YOU NEED TO CHECK HOW IT WORKS */}
      {/* TODO: DappletButtonTypes.InMyDapplets : DappletButtonTypes.AddToMy */}
      <ButtonsWrapper>
        <Button
          isFirstPress={isLocalListEmpty}
          onClick={onLocalListingButtonClick}
          listing="local"
          stage={
            isLocalDapplet
              ? DAPPLET_LISTING_STAGES.PRESENTED
              : DAPPLET_LISTING_STAGES.ADD
          }
        />

        <Button
          isFirstPress={isPublicListEmpty}
          onClick={onPublicListingButtonClick}
          listing="public"
          stage={getSelectedType()}
        />
      </ButtonsWrapper>
    </div>
  );
};

export default connect(mapState, mapDispatch)(ItemDapplet);
