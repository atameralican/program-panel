import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
import { Button, InputNumber, Switch } from 'antd';
import { Card } from '@/components/ui/card';

interface SortableListItemContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
}

type TeacherType = {
  id: number;
  name: string;
};

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
    ...(isDragging ? { position: 'relative', zIndex: 9999, opacity: 0.8 } : {}),
  };

  const memoizedValue = useMemo<SortableListItemContextProps>(
    () => ({ setActivatorNodeRef, listeners, attributes }),
    [setActivatorNodeRef, listeners, attributes],
  );

  return (
    <SortableListItemContext.Provider value={memoizedValue}>
      <Card ref={setNodeRef} style={style} className="mb-2 p-3">
        <div className="flex items-center gap-3">{children}</div>
      </Card>
    </SortableListItemContext.Provider>
  );
};

interface SortableListProps {
  teacherList?: TeacherType[]; // opsiyonel, boş gelebilir
  person_limit?: number; 
}

const SortableList: React.FC<SortableListProps> = ({ teacherList = [], person_limit }) => {
  const [data, setData] = useState<TeacherType[]>(teacherList);

  // teacherList prop'u değiştiğinde (API'den veri geldiğinde) state'i güncelle
  useEffect(() => {
    setData(teacherList);
  }, [teacherList]);

 const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!active || !over || active.id === over.id) return;
    setData((prevState) => {
      const activeIndex = prevState.findIndex((i) => i.id === active.id);
      const overIndex = prevState.findIndex((i) => i.id === over.id);
      return arrayMove(prevState, activeIndex, overIndex);
    });
  };

  if (data.length === 0) {
    return <p className="text-center text-gray-400">Listelenecek öğretmen bulunamadı.</p>;
  }

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
      id="list-drag-sorting-handler"
    >
      <SortableContext items={data.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="w-full space-y-2">
          {data.map((item) => (
            <SortableListItem key={item.id} itemKey={item.id}>
              <DragHandle />
              <Switch defaultValue={false} />
              <span className="flex-1">{item.name}</span>
              <InputNumber
                className="w-full"
                min={0}
                max={person_limit??0}
                defaultValue={0}
                //value={teacherPayload?.section_limit}
                //onChange={(e) =>
                //  setTeacherPayload((prev) => ({
                //    ...prev,
                //    section_limit: e || 23,
                //  }))
                //}
              />
            </SortableListItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableList;