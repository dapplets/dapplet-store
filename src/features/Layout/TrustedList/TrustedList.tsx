import React, { useMemo } from "react";
import { connect } from "react-redux";
import TrustedListItem, {
  DappletsListItemTypes,
} from "../../../components/DappletsListItem/DappletsListItem";
import { RootDispatch, RootState } from "../../../models";
import { Sort } from "../../../models/sort";
import Collapsible from "../Collapsible/Collapsible";

type TrustedUser = {
  title: string;
  subTitle: string;
  id: string;
  type: DappletsListItemTypes;
};

const mapState = (state: RootState) => ({
  addressFilter: state.sort.addressFilter,
});

const mapDispatch = (dispatch: RootDispatch) => ({
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
});

type TrustedListProps = {
  users: TrustedUser[];
  isOpen: boolean;
  onToggle: () => void;
} & ReturnType<typeof mapDispatch> &
  ReturnType<typeof mapState>;

const TrustedList = ({
  users,
  isOpen,
  onToggle,
  setSort,
  addressFilter,
}: TrustedListProps) => {
  const trustedListItems = useMemo(
    () =>
      users.map(({ id, subTitle, title, type }) => {
        const onListItemClick = () => {
          setSort({
            addressFilter: id,
            selectedList: undefined,
            searchQuery: "",
          });
        };

        return (
          <TrustedListItem
            isActive={addressFilter === id}
            key={id}
            onClick={onListItemClick}
            subTitle={subTitle}
            title={title}
            type={type}
            id={id}
          />
        );
      }),
    [addressFilter, setSort, users],
  );

  return (
    <Collapsible
      isOpen={isOpen}
      onToggle={onToggle}
      title="Trusted users"
      maxHeight={164}
    >
      {trustedListItems}
    </Collapsible>
  );
};

export default connect(mapState, mapDispatch)(TrustedList);
