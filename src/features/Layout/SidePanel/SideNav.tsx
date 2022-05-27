import React, { useMemo, Dispatch, SetStateAction } from "react";
import Tooltip from "../Tooltip/Tooltip";
import { connect } from "react-redux";
import { Lists, MyListElement } from "../../../models/myLists";
import { Sort } from "../../../models/sort";
import DappletsListItem, {
  DappletsListItemTypes,
} from "../../../components/DappletsListItem/DappletsListItem";
import { LegacySideLists } from "../SidePanel/SidePanel";
import { RootDispatch, RootState } from "../../../models";
import styled from "styled-components";
import TrustedList from "../TrustedList/TrustedList";

const Wrapper = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-top: 20px;
  padding-left: 60px;
  padding-right: 30px;
`;

const MenuItem = styled.li`
  font-family: Montserrat;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 36px;
  letter-spacing: 0em;
  text-align: left;
  user-select: none;
  display: flex;
  justify-content: space-between;
`;

const MenuItemLabel = styled.span`
  cursor: pointer;
  min-width: 300px;
`;

const PublicListingActionButton = styled.button`
  min-width: 128px;
  cursor: pointer;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #5ab5e8;
  color: #5ab5e8;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: center;
  padding: 9px 10px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const mapState = (state: RootState) => ({
  myLists: state.myLists,
  isLocked: state.user.isLocked,
  trustedUsers: state.trustedUsers.trustedUsers,
  address: state.user.address,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
});

type MenuProps = {
  selectedDappletsList: MyListElement[];
  onPush: () => Promise<void>;
  trustedUsers: string[];
  openedList: string | undefined;
  setOpenedList: Dispatch<SetStateAction<null | string>>;
} & ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>;

const SideNav = ({
  selectedDappletsList,
  onPush,
  isLocked,
  trustedUsers,
  address,
  setSort,
  openedList,
  setOpenedList,
  myLists,
}: MenuProps) => {
  const myDapplets = myLists[Lists.MyDapplets];
  const myListing = myLists[Lists.MyListing];

  console.log(myDapplets);

  const pendingActions = useMemo(
    () =>
      selectedDappletsList.filter((d) => {
        return (
          d.type !== DappletsListItemTypes.Default || d.event !== undefined
        );
      }),
    [selectedDappletsList],
  );

  const arePendingActions = pendingActions.length > 0;

  const formattedTrustedUsers = useMemo(
    () =>
      trustedUsers
        .filter(
          (user) =>
            !address ||
            address?.replace("0x000000000000000000000000", "0x") !==
              user.replace("0x000000000000000000000000", "0x"),
        )
        .map((user) => ({
          title: user.replace("0x000000000000000000000000", "0x"),
          subTitle: `${user
            .replace("0x000000000000000000000000", "0x")
            .slice(0, 6)}...${user
            .replace("0x000000000000000000000000", "0x")
            .slice(-4)}`,
          id: user,
          type: DappletsListItemTypes.Default,
          onClickRemove: () => {
            return;
          },
          isRemoved: false,
        }))
        .filter(({ title }) => !!title)
        .map(({ id, subTitle, isRemoved, onClickRemove, title, type }) => {
          return (
            <DappletsListItem
              key={id}
              onClick={(id: string) =>
                setSort({
                  addressFilter: id,
                  selectedList: undefined,
                  searchQuery: "",
                })
              }
              subTitle={subTitle}
              isRemoved={isRemoved}
              onClickRemove={onClickRemove}
              title={title}
              type={type}
              id={id}
            />
          );
        }),
    [trustedUsers],
  );

  const isOpen = LegacySideLists.TrustedUsers === openedList;

  const onTrustedUsersListToggle = () => {
    if (isOpen) setOpenedList(null);
    else setOpenedList(LegacySideLists.TrustedUsers);
  };

  return (
    <Wrapper>
      <MenuItem>
        <Tooltip
          isOn={myDapplets.length === 0}
          tipText={"Add dapplets here for local use from dapplets card"}
        >
          <MenuItemLabel
            onClick={() => {
              setSort({
                selectedList: Lists.MyDapplets,
                addressFilter: "",
                searchQuery: "",
              });
            }}
          >
            Local list
          </MenuItemLabel>
        </Tooltip>
      </MenuItem>

      <MenuItem>
        <Tooltip
          isOn={myListing.length === 0}
          tipText={
            "Add dapplets here for public use and for share it to your followers"
          }
        >
          <MenuItemLabel
            onClick={() => {
              setSort({
                selectedList: Lists.MyListing,
                addressFilter: "",
                searchQuery: "",
              });
            }}
          >
            Public list
          </MenuItemLabel>
        </Tooltip>

        {arePendingActions && (
          <PublicListingActionButton
            disabled={Boolean(isLocked)}
            onClick={onPush}
          >
            Push {pendingActions.length} change
            {pendingActions.length > 1 ? "s" : ""}
          </PublicListingActionButton>
        )}
      </MenuItem>

      <MenuItem>
        <Tooltip
          isOn={formattedTrustedUsers.length === 0}
          tipText={
            "Add dapplets here for public use and for share it to your followers"
          }
        >
          <MenuItemLabel>
            <TrustedList
              users={formattedTrustedUsers}
              isOpen={isOpen}
              onToggle={onTrustedUsersListToggle}
            ></TrustedList>
          </MenuItemLabel>
        </Tooltip>
      </MenuItem>
    </Wrapper>
  );
};

export default connect(mapState, mapDispatch)(SideNav);
