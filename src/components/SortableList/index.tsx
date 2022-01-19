import { useState, SetStateAction } from 'react';
import { saveListToLocalStorage } from '../../utils';
import { IDappletsList, IDappletsListElement } from '../../config/types';
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
    selectedDapplets,
    localDapplets,
    editLocalDappletsList,
    editSelectedDappletsList,
    expandedItems,
    setExpandedItems,
    setAddressFilter,
    addressFilter,
    setOpenedList,
    searchQuery,
    trustedUsersList,
    isTrustedSort,
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
    let newArray: IDappletsListElement[];
    if (over !== null && active.id !== over.id) {
      const itemIds = items!.dapplets.map(({name}) => name);
      const oldIndex = itemIds.indexOf(active.id);
      const newIndex = itemIds.indexOf(over.id);
      newArray = arrayMove(items!.dapplets, oldIndex, newIndex);
    } else {
      newArray = items!.dapplets;
    }
    const newDappletsList: IDappletsList = { listName: items!.listName, dapplets: newArray };
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
      <SortableContext items={items!.dapplets.map(({name}) => name)} strategy={verticalListSortingStrategy}>
        {items?.dapplets.map(({name: itemName}) => (
          dapplets.find((dapp) => dapp.name === itemName) &&
          <Draggable
            key={itemName}
            id={itemName}
            item={dapplets.find((dapp) => dapp.name === itemName)!}
            addressFilter={addressFilter}
            activeId={activeId}
            trustedUsersList={trustedUsersList}
            isTrustedSort={isTrustedSort}
          >
            <ItemDapplet
              key={itemName}
              item={dapplets.find((dapp) => dapp.name === itemName)!}
              selectedDapplets={selectedDapplets}
              localDapplets={localDapplets}
              editLocalDappletsList={editLocalDappletsList}
              editSelectedDappletsList={editSelectedDappletsList}
              expandedItems={expandedItems}
              setExpandedItems={setExpandedItems}
              setAddressFilter={setAddressFilter}
              setOpenedList={setOpenedList}
              searchQuery={searchQuery}
              trustedUsersList={trustedUsersList}
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
                selectedDapplets={selectedDapplets}
                localDapplets={localDapplets}
                editLocalDappletsList={editLocalDappletsList}
                editSelectedDappletsList={editSelectedDappletsList}
                expandedItems={expandedItems}
                setExpandedItems={setExpandedItems}
                setAddressFilter={setAddressFilter}
                setOpenedList={setOpenedList}
                trustedUsersList={trustedUsersList}
              />
            </div>
          </section>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SortableList;
