import React, { useState, forwardRef, SetStateAction } from 'react';
import { Dropdown, Header } from 'semantic-ui-react';

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

import { ListDappletsProps } from './ListDapplets.props';
import ItemDapplet from '../ItemDapplet';

const Item = forwardRef(({id, ...props}: any, ref: any) => {
  return (
    <div {...props} ref={ref}>
      {id}
    </div>
  );
});

function ListDapplets({
  list,
  dappletsVersions,
  setSelectedDapplets,
  selectedDapplets,
  localDapplets,
  setLocalDapplets,
  selectedList,
  setSelectedList,
  dappletsTransactions,
}: ListDappletsProps): React.ReactElement {

  const [activeId, setActiveId] = useState<SetStateAction<string> | null>(null);
  const [items, setItems] = useState(list);
  //const { isOver, setNodeRef } = useDroppable({    id: 'droppable',  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [sortType, setSortType] = useState('A-Z');
  const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

  function handleDragStart(event: DragStartEvent) {
    const {active} = event;
    setActiveId(active.id);
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over !== null && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }

  return (
      <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
      >
          <SortableContext items={items.map((i) => i.name)} strategy={verticalListSortingStrategy}>
              <div
                  //ref={setNodeRef}
                  style={{
                      position: 'static',
                      padding: '0 !important',
                      margin: '0 !important',
                  }}
              >
                  <div
                      style={{
                          height: 'calc(100vh - 135px)',
                          overflow: 'auto',
                          padding: '0 !important',
                          margin: '0 !important',
                      }}
                  >
                      <div
                          style={{
                              display: 'flex',
                              margin: '30px 35px 15px',
                              alignItems: 'baseline',
                              justifyContent: 'space-between',
                              height: 30,
                          }}
                      >
                          <Header
                              as="h2"
                              className="infoTitle"
                              size="medium"
                              style={{
                                  flexGrow: 1,
                              }}
                          >
                              {selectedList ? selectedList.name : 'Dapplets'}
                          </Header>
                          {!selectedList && (
                              <Dropdown text={`Sort by: ${sortType}`} className="small-link">
                                  <Dropdown.Menu>
                                      <Dropdown.Item
                                          text="A-Z"
                                          onClick={() => setSortType('A-Z')}
                                      />
                                      <Dropdown.Item
                                          text="Z-A"
                                          onClick={() => setSortType('Z-A')}
                                      />
                                      <Dropdown.Item
                                          text="Newest"
                                          onClick={() => setSortType('Newest')}
                                      />
                                      <Dropdown.Item
                                          text="Oldest"
                                          onClick={() => setSortType('Oldest')}
                                      />
                                  </Dropdown.Menu>
                              </Dropdown>
                          )}
                          {selectedList && (
                              <button className="small-link" onClick={() => setSelectedList()}>
                                  Show all
                              </button>
                          )}
                      </div>
                      {list /*.sort((a, b) => {
                if (selectedList) return 0;
                if (sortType === 'A-Z') return collator.compare(a.title, b.title);
                if (sortType === 'Z-A') return collator.compare(b.title, a.title);
                if (sortType === 'Newest') return collator.compare(dappletsTransactions[b.name], dappletsTransactions[a.name]);
                return collator.compare(dappletsTransactions[a.name], dappletsTransactions[b.name]);
              })*/
                          .map((item, i) => {
                              return (
                                  <ItemDapplet
                                      key={i}
                                      item={item}
                                      dappletsVersions={dappletsVersions}
                                      selectedDapplets={selectedDapplets}
                                      setSelectedDapplets={setSelectedDapplets}
                                      localDapplets={localDapplets}
                                      setLocalDapplets={setLocalDapplets}
                                      selectedList={selectedList}
                                      setSelectedList={setSelectedList}
                                      dappletsTransactions={dappletsTransactions}
                                  />
                              );
                          })}
                  </div>
              </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? <Item id={activeId} /> : null}
          </DragOverlay>
      </DndContext>
  );
}

export default ListDapplets;
