import React, {
  useMemo,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
} from "react";
import Tooltip from "../Tooltip/Tooltip";
import { connect } from "react-redux";
import { Lists, MyListElement } from "../../../models/myLists";
import { Sort } from "../../../models/sort";
import TrustedListItem, {
  DappletsListItemTypes,
} from "../../../components/DappletsListItem/DappletsListItem";
import { LegacySideLists } from "../SidePanel/SidePanel";
import { RootDispatch, RootState } from "../../../models";
import styled from "styled-components/macro";
import TrustedList from "../TrustedList/TrustedList";
import { TrustedUser } from "../../../models/trustedUsers";
import trimLeadingZeros from "../../../lib/trimLeadingZeros";
import shortenAddress from "../../../lib/shortenAddress";

// WHY 24?
const ZEROS_TO_TRIM = 24;

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

const MenuItemLabel = styled.span<{
  disabled?: boolean;
  isActive?: boolean;
}>`
  cursor: pointer;
  min-width: 300px;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  color: ${({ isActive }) => (isActive ? "#2A2A2A" : "auto")};
`;

const PublicListingActionButton = styled.button`
  min-width: 158px;
  cursor: pointer;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #5ab5e8;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: center;
  padding: 9px 10px;
  color: ${({ disabled }) => (disabled ? "#747376" : "#5ab5e8")};
  border-color: ${({ disabled }) => (disabled ? "#747376" : "#5ab5e8")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const mapState = (state: RootState) => ({
  myLists: state.myLists,
  isLocked: state.user.isLocked,
  address: state.user.address,
  trustedUsers: state.trustedUsers.trustedUsers,
  filter: state.sort.addressFilter,
  selectedList: state.sort.selectedList,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
});

type MenuProps = {
  selectedDappletsList: MyListElement[];
  onPush: () => Promise<void>;
  trustedUsers: TrustedUser[];
} & ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>;

const SideNav = ({
  selectedDappletsList,
  onPush,
  isLocked,
  trustedUsers,
  address,
  setSort,
  myLists,
  filter,
  selectedList,
}: MenuProps) => {
  const myDapplets = myLists[Lists.MyDapplets];
  const myListing = myLists[Lists.MyListing];

  const [isUserListOpened, setIsUserListOpened] = useState(false);

  const formattedTrustedUsers = useMemo(() => {
    const users = trustedUsers.map((trustedUser) => {
      const { ens, hex } = trustedUser;
      const hasEns = !!ens;
      const formattedHex = trimLeadingZeros(hex, ZEROS_TO_TRIM);

      return {
        title: formattedHex,
        subTitle: hasEns ? trustedUser.ens : shortenAddress(formattedHex, 10),
        id: hex,
        type: DappletsListItemTypes.Default,
      };
    });

    return users;
  }, [trustedUsers]);

  const pendingActions = useMemo(
    () =>
      selectedDappletsList.filter((d) => {
        const isInOutAction = d.type !== DappletsListItemTypes.Default;
        const isIndexDiffSet = d.indexDiff !== undefined;
        const isRearranged = d.indexDiff !== 0;
        const shouldRearrange = isIndexDiffSet && isRearranged;

        /* Action is pending if it's I/O event OR it's position is changed */
        return isInOutAction || shouldRearrange;
      }),
    [selectedDappletsList],
  );

  const arePendingActions = pendingActions.length > 0;
  const isMyListingEmpty = myListing.length === 0;
  const isMyDappletsEmpty = myDapplets.length === 0;
  const isTrustedUsersListEmpty = formattedTrustedUsers.length === 0;
  const isCurrentUserList = filter === address;

  const toggleUserList = () => {
    setIsUserListOpened((old) => !old);
  };

  const togleLocalList = () => {
    setSort({
      selectedList: Lists.MyDapplets,
      addressFilter: "",
      searchQuery: "",
    });
  };

  const toglePublicList = () => {
    setSort({
      selectedList: Lists.MyListing,
      addressFilter: address,
      searchQuery: "",
      isTrustedSort: false,
    });
  };

  return (
    <Wrapper>
      <MenuItem>
        <Tooltip
          isOn={isMyListingEmpty}
          tipText={
            "Add dapplets here for public use and for share it to your followers"
          }
        >
          <MenuItemLabel
            isActive={isCurrentUserList}
            disabled={isMyListingEmpty}
            onClick={toglePublicList}
          >
            Public list
          </MenuItemLabel>
        </Tooltip>

        {arePendingActions && (
          <PublicListingActionButton
            disabled={Boolean(isLocked)}
            onClick={onPush}
          >
            Push{isLocked ? "ing" : ""} {pendingActions.length} change
            {pendingActions.length > 1 ? "s" : ""}
          </PublicListingActionButton>
        )}
      </MenuItem>

      <MenuItem>
        <Tooltip
          isOn={isMyDappletsEmpty}
          tipText={"Add dapplets here for local use from dapplets card"}
        >
          <MenuItemLabel
            isActive={selectedList === Lists.MyDapplets}
            disabled={isMyDappletsEmpty}
            onClick={togleLocalList}
          >
            Local list
          </MenuItemLabel>
        </Tooltip>
      </MenuItem>

      <MenuItem>
        <Tooltip
          isOn={isTrustedUsersListEmpty}
          tipText={"Add users here to follow them"}
        >
          <MenuItemLabel disabled={isTrustedUsersListEmpty}>
            {isTrustedUsersListEmpty ? (
              "Trusted Users"
            ) : (
              <TrustedList
                users={formattedTrustedUsers}
                isOpen={isUserListOpened}
                onToggle={toggleUserList}
              ></TrustedList>
            )}
          </MenuItemLabel>
        </Tooltip>
      </MenuItem>
    </Wrapper>
  );
};

export default connect(mapState, mapDispatch)(SideNav);
