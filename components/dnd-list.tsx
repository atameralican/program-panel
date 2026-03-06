import React, { createContext, useContext, useMemo, useState } from 'react';
import { HolderOutlined } from '@ant-design/icons';
import type { DragEndEvent, DraggableAttributes } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Switch } from 'antd';
import { Card } from '@/components/ui/card';

interface SortableListItemContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
}

const SortableListItemContext = createContext<SortableListItemContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners, attributes } = useContext(SortableListItemContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
    />
  );
};

interface SortableListItemProps {
  itemKey: number;
  children: React.ReactNode;
}

const SortableListItem: React.FC<SortableListItemProps> = ({ itemKey, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemKey });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { 
      position: 'relative', 
      zIndex: 9999,
      opacity: 0.8
    } : {}),
  };

  const memoizedValue = useMemo<SortableListItemContextProps>(
    () => ({ setActivatorNodeRef, listeners, attributes }),
    [setActivatorNodeRef, listeners, attributes],
  );

  return (
    <SortableListItemContext.Provider value={memoizedValue}>
      <Card 
        ref={setNodeRef} 
        style={style}
        className="mb-2 p-3"
      >
        <div className="flex items-center gap-3">
          {children}
        </div>
      </Card>
    </SortableListItemContext.Provider>
  );
};

const SortableList: React.FC = () => {
  const [data, setData] = useState([
    { key: 1, content: 'Ali Veli' },
    { key: 2, content: 'John Doe' },
    { key: 3, content: 'Ayşe Fatma' },
    { key: 4, content: 'Jennifer Lopez' },
    { key: 5, content: 'Müslüm Gürses' },
  ]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!active || !over) {
      return;
    }
    if (active.id !== over.id) {
      setData((prevState) => {
        const activeIndex = prevState.findIndex((i) => i.key === active.id);
        const overIndex = prevState.findIndex((i) => i.key === over.id);
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
  };

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
      id="list-drag-sorting-handler"
    >
      <SortableContext items={data.map((item) => item.key)} strategy={verticalListSortingStrategy}>
        <div className="w-full space-y-2">
          {data.map((item) => (
            <SortableListItem key={item.key} itemKey={item.key}>
              <DragHandle />
              <Switch key={item.key} defaultValue={false} />
              <span className="flex-1">{item.content}</span>
            </SortableListItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableList;