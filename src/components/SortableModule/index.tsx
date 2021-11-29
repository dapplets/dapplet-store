import React, { useState,  SetStateAction  } from 'react';
import Item from '../SortableOverlayItem/Item';

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

export default ({ children, ...props }: any) => {
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
    let newArray: any[];
    if (over !== null && active.id !== over.id) {
      const itemIds = items.map((item: any) => item.name)
      const oldIndex = itemIds.indexOf(active.id);
      const newIndex = itemIds.indexOf(over.id);
      newArray = arrayMove(items, oldIndex, newIndex);
    } else {
      newArray = items;
    }
    setItems(newArray);
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i: any) => i.name)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      <DragOverlay>
        {activeId ? <Item id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
};