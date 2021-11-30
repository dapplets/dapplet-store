import React, { useState,  SetStateAction  } from 'react';
import Item from '../SortableOverlayItem/Item';
import { saveListToLocalStorage } from '../../utils';
import { IDappletsList } from '../../config/types';

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

import { SortableModuleProps } from './SortableModule.props';

export default ({ children, ...props }: SortableModuleProps) => {
  const { items, setItems } = props;

  const [activeId, setActiveId] = useState<SetStateAction<string> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const {active} = event;
    setActiveId(active.id);
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    // console.log('active', active)
    // console.log('over', over)
    let newArray: string[];
    if (over !== null && active.id !== over.id) {
      const itemIds = items!.dappletsNames;
      // console.log('itemIds', itemIds)
      const oldIndex = itemIds.indexOf(active.id);
      // console.log('oldIndex', oldIndex)
      const newIndex = itemIds.indexOf(over.id);
      // console.log('newIndex', newIndex)
      newArray = arrayMove(items!.dappletsNames, oldIndex, newIndex);
    } else {
      newArray = items!.dappletsNames;
    }
    // console.log('newArray', newArray)
    const newDappletsList: IDappletsList = { listName: items!.listName, dappletsNames: newArray };
    saveListToLocalStorage(newDappletsList);
    setItems(newDappletsList);
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
        {children}
      </SortableContext>
      <DragOverlay>
        {activeId ? <Item id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
};