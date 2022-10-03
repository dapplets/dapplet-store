/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, SetStateAction } from "react";
import { saveListToLocalStorage } from "../../lib/localStorage";
import styles from "./SortableList.module.scss";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { SortableListProps } from "./SortableList.props";
import Draggable from "../Draggable";
import ItemDapplet from "../ItemDapplet";
import { MyListElement } from "../../models/myLists";
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
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

const SortableList = ({
  dapplets,
  items,
  setItems,
  selectedDapplets,
  localDapplets,
  editLocalDappletsList,
  editSelectedDappletsList,
  setAddressFilter,
  addressFilter,
  searchQuery,
  trustedUsersList,
  isTrustedSort,
  selectedList,
  isNotDapplet,
  expandedCards,
  setExpandedCards,
}: SortableListProps) => {
  const [activeId, setActiveId] = useState<SetStateAction<string> | null>(null);
  const [initialItems, setInitialItems] = useState<MyListElement[]>(items);

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

  const handleDragEnd = (event: DragEndEvent) => {
    if (initialItems.length === 0) {
      setInitialItems(items);
    }

    const { active: activeItem, over: overItem } = event;

    const isDroppedInsideSortableContainer = overItem !== null;
    const shouldHandleDragEnd =
      isDroppedInsideSortableContainer && activeItem.id !== overItem.id;

    let indexedItems: MyListElement[] = items;

    if (shouldHandleDragEnd) {
      const itemNames = items.map(({ name }) => name);
      const oldIndex = itemNames.indexOf(activeItem.id);
      const newIndex = itemNames.indexOf(overItem.id);

      const shiftedItems = arrayMove(items, oldIndex, newIndex);

      const currentInitialItems =
        initialItems.length > 0 ? initialItems : items;

      indexedItems = shiftedItems.map((item, oldIndex) => {
        const newIndex = currentInitialItems.findIndex(
          (shiftedItem) => shiftedItem.name === item.name,
        );

        const indexDiff = oldIndex - newIndex;
        return { ...item, indexDiff };
      });
    }

    setItems(indexedItems);
    saveListToLocalStorage(indexedItems, selectedList);
    setActiveId(null);
  };

  if (!items || items.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items!.map(({ name }) => name)}
        strategy={verticalListSortingStrategy}
      >
        {items?.map(({ name: itemName }) => {
          return (
            dapplets.find((dapp) => dapp.name === itemName) && (
              <Draggable
                key={itemName}
                id={itemName}
                item={dapplets.find((dapp) => dapp.name === itemName)!}
                addressFilter={addressFilter}
                selectedDapplets={selectedDapplets}
                activeId={activeId}
                trustedUsersList={trustedUsersList}
                isTrustedSort={isTrustedSort}
              >
                <ItemDapplet
                  expandedCards={expandedCards}
                  setExpandedCards={setExpandedCards}
                  key={itemName}
                  item={dapplets.find((dapp) => dapp.name === itemName)!}
                  selectedDapplets={selectedDapplets}
                  localDapplets={localDapplets}
                  editLocalDappletsList={editLocalDappletsList}
                  editSelectedDappletsList={editSelectedDappletsList}
                  setAddressFilter={setAddressFilter}
                  searchQuery={searchQuery}
                  trustedUsersList={trustedUsersList}
                  isNotDapplet={isNotDapplet}
                />
              </Draggable>
            )
          );
        })}
      </SortableContext>
      <DragOverlay
        dropAnimation={{
          duration: 500,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
        modifiers={[restrictToWindowEdges]}
      >
        {activeId ? (
          <section className={styles.item}>
            <div className={styles.itemContainer}>
              <div className={styles.item__draggable} />
              <ItemDapplet
                expandedCards={expandedCards}
                setExpandedCards={setExpandedCards}
                key={dapplets.find((dapp) => dapp.name === activeId)?.name}
                item={dapplets.find((dapp) => dapp.name === activeId)!}
                selectedDapplets={selectedDapplets}
                localDapplets={localDapplets}
                editLocalDappletsList={editLocalDappletsList}
                editSelectedDappletsList={editSelectedDappletsList}
                setAddressFilter={setAddressFilter}
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
