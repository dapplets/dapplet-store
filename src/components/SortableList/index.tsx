import { useState, SetStateAction } from 'react';
import { saveListToLocalStorage } from '../../utils';
import { IDappletsList } from '../../config/types';
import styles from './SortableList.module.scss';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  closestCenter,
  DragStartEvent,
} from '@dnd-kit/core';

import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import {
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';

import { SortableListProps } from './SortableList.props';
import Draggable from '../Draggable';
import ItemDapplet from '../ItemDapplet';

const SortableList = (props: SortableListProps) => {
  const {
    dapplets,
    items,
    setItems,
    dappletsVersions,
    selectedDapplets,
    localDapplets,
    dappletsTransactions,
    editLocalDappletsList,
    editSelectedDappletsList,
    expandedItems,
    setExpandedItems,
  } = props;

  const [activeId, setActiveId] = useState<SetStateAction<string> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id);
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    let newArray: string[];
    if (over !== null && active.id !== over.id) {
      const itemIds = items!.dappletsNames;
      const oldIndex = itemIds.indexOf(active.id);
      const newIndex = itemIds.indexOf(over.id);
      newArray = arrayMove(items!.dappletsNames, oldIndex, newIndex);
    } else {
      newArray = items!.dappletsNames;
    }
    const newDappletsList: IDappletsList = { listName: items!.listName, dappletsNames: newArray };
    setItems(newDappletsList);
    saveListToLocalStorage(newDappletsList);
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items!.dappletsNames} strategy={verticalListSortingStrategy}>
        {items?.dappletsNames.map((itemName) => (
          <Draggable
            key={itemName}
            id={itemName}
            activeId={activeId}
          >
            <ItemDapplet
              key={itemName}
              item={dapplets.find((dapp) => dapp.name === itemName)!}
              dappletsVersions={dappletsVersions}
              selectedDapplets={selectedDapplets}
              localDapplets={localDapplets}
              dappletsTransactions={dappletsTransactions}
              editLocalDappletsList={editLocalDappletsList}
              editSelectedDappletsList={editSelectedDappletsList}
              expandedItems={expandedItems}
              setExpandedItems={setExpandedItems}
            />
          </Draggable>
        ))}
      </SortableContext>
      <DragOverlay
        dropAnimation={{
          duration: 500,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
        modifiers={[restrictToWindowEdges]}
      >
        {activeId ? (
          <section className={styles.item}>
            <div className={styles.itemContainer}>
              <div
                className={styles.item__draggable}
              />
              <ItemDapplet
                item={dapplets.find((dapp) => dapp.name === activeId)!}
                dappletsVersions={dappletsVersions}
                selectedDapplets={selectedDapplets}
                localDapplets={localDapplets}
                dappletsTransactions={dappletsTransactions}
                editLocalDappletsList={editLocalDappletsList}
                editSelectedDappletsList={editSelectedDappletsList}
                expandedItems={expandedItems}
                setExpandedItems={setExpandedItems}
              />
            </div>
          </section>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SortableList;
