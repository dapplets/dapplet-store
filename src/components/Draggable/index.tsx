import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import styles from './Draggable.module.scss';
import { DraggableProps } from './Draggable.props';
import Item from '../SortableOverlayItem/Item';

const Draggable = ({ children, ...props }: DraggableProps): React.ReactElement => {
  const {
    id,
    activeId,
    item,
    addressFilter,
  } = props;

  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
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
  if (!!addressFilter && item.owner !== addressFilter) return <></>

  return (
    <Item
      className={styles.item}
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
