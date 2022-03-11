import { useState, SetStateAction } from 'react';
import { saveListToLocalStorage } from '../../lib/localStorage';
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
import { MyListElement } from '../../models/myLists';
import { DappletsListItemTypes } from '../DappletsListItem/DappletsListItem';

const SortableList = (props: SortableListProps) => {
  const {
    dapplets,
    items,
    setItems,
    selectedDapplets,
    localDapplets,
    editLocalDappletsList,
    editSelectedDappletsList,
    setAddressFilter,
    addressFilter,
    setOpenedList,
    searchQuery,
    trustedUsersList,
    isTrustedSort,
    selectedList,
    isNotDapplet,
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
    let newArray: MyListElement[];
    if (over !== null && active.id !== over.id) {
      const itemIds = items!.map(({name}) => name);
      const oldIndex = itemIds.indexOf(active.id);
      const newIndex = itemIds.indexOf(over.id);
      if (items) {
        items[oldIndex].event = newIndex === 0 ? 0 : items[newIndex-1].id;
        if (items[oldIndex].eventPrev === undefined)
          items[oldIndex].eventPrev = oldIndex === 0 ? 0 : items[oldIndex-1].id;
        console.log({i: items[oldIndex]})
      }
      newArray = arrayMove(items || [], oldIndex, newIndex);
    } else {
      newArray = items || [];
    }
    newArray = newArray.map((dapp, index) => {
      if (dapp.event !== undefined && dapp.eventPrev !== undefined) {
        if (index > 0) {
          if (newArray[index-1].id === dapp.eventPrev) {
            return {
              ...dapp,
              event: undefined,
              eventPrev: undefined,
            }
          }
        }
        if (index === 0) {
          if (dapp.eventPrev === 0) {
            return {
              ...dapp,
              event: undefined,
              eventPrev: undefined,
            }
          }
        }
      }
      return dapp
    })
    const newDappletsList: MyListElement[] = newArray;
    setItems(newDappletsList);
    saveListToLocalStorage(newDappletsList, selectedList);
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items!.map(({name}) => name)} strategy={verticalListSortingStrategy}>
        {items?.map(({name: itemName}) => (
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
              setAddressFilter={setAddressFilter}
              setOpenedList={setOpenedList}
              searchQuery={searchQuery}
              trustedUsersList={trustedUsersList}
              isNotDapplet={isNotDapplet}
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
                key={dapplets.find((dapp) => dapp.name === activeId)?.name}
                item={dapplets.find((dapp) => dapp.name === activeId)!}
                selectedDapplets={selectedDapplets}
                localDapplets={localDapplets}
                editLocalDappletsList={editLocalDappletsList}
                editSelectedDappletsList={editSelectedDappletsList}
                setAddressFilter={setAddressFilter}
                setOpenedList={setOpenedList}
                trustedUsersList={trustedUsersList}
                isNotDapplet={isNotDapplet}
              />
            </div>
          </section>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SortableList;
