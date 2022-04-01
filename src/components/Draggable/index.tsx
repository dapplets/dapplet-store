import React, { useMemo } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import styles from './Draggable.module.scss';
import { DraggableProps } from './Draggable.props';
import Item from '../SortableOverlayItem/Item';
import cn from 'classnames';
import { DappletsListItemTypes } from '../DappletsListItem/DappletsListItem';

const Draggable = ({ children, ...props }: DraggableProps): React.ReactElement => {
  const {
    id,
    activeId,
    item,
    selectedDapplets,
    addressFilter,
    trustedUsersList,
    isTrustedSort,
  } = props;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    transition: {
      duration: 500, // milliseconds
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: id === activeId ? .5 : 1
  };

  const selectedDapplet = useMemo(() => {
    return selectedDapplets.find((dapplet) => dapplet.name === item.name)
  }, [item.name, selectedDapplets]);


  const isType = selectedDapplet?.type === DappletsListItemTypes.Default
    && selectedDapplet.event !== undefined
    ? DappletsListItemTypes.Moved
    : selectedDapplet?.type;
  const isRemoving = selectedDapplet?.id === item.id && selectedDapplet.type === "Removing";
  const isAdding = selectedDapplet?.id === item.id && selectedDapplet.type === "Adding";
  const isMoved = selectedDapplet?.id === item.id && isType === "Moved";

  if (!!addressFilter && !item.trustedUsers.includes(addressFilter)) return <></>
  if (isTrustedSort && !trustedUsersList.some((user) => item.trustedUsers.includes(user))) return <></>
  return (
    <Item
      className={cn(styles.item, {
        [styles.isRemoving]: isRemoving,
        [styles.isAdding]: isAdding,
        [styles.isMoved]: isMoved,
      })}
      style={style}
      ref={setNodeRef}
    >
      <div className={styles.itemContainer}>
        <div
          className={styles.item__draggable}
          {...attributes}
          {...listeners}
        />
        {children}
      </div>
    </Item>
  );
};

export default Draggable;
