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
import { TeacherType } from '@/app/admin/instructor/page';

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
  onTeacherStateChange?: (teachers: TeacherType[]) => void;
}

const SortableList: React.FC<SortableListProps> = ({ teacherList = [], person_limit,onTeacherStateChange }) => {
  const [teachers, setTeachers] = useState<TeacherType[]>(teacherList);

  // teacherList prop'u değiştiğinde (API'den veri geldiğinde) state'i güncelle
  useEffect(() => {
    setTeachers(teacherList);
    console.log("teacherList",teacherList)
  }, [teacherList]);


  
  // Her değişiklik üst sayfaya haber veriyor. 
  const notify = (updated: TeacherType[]) => {
    onTeacherStateChange?.(updated);
  };
  //sıralama
   const onDragEnd = ({ active, over }: DragEndEvent) => {
      if (!active || !over || active.id === over.id) return;
      setTeachers((prev) => {
        const activeIndex = prev.findIndex((i) => i.id === active.id);
        const overIndex = prev.findIndex((i) => i.id === over.id);
        const newArrayIndex = arrayMove(prev, activeIndex, overIndex);
        notify(newArrayIndex);//parentı bilgilendir. 
        return newArrayIndex;
      });
    };

    //switch değişimi
    const handleSwitch = (id: number, enabled: boolean) => {
      setTeachers((prev) => {
        const newEnable = prev.map((item) =>
          item.id === id ? { ...item, enabled } : item,
        );
        notify(newEnable);
        return newEnable;
      });
    };
//maxSlot Değişimi
    const handleMaxSlot = (id: number, value: number | null) => {
      setTeachers((prev) => {
        const newMaxSlot = prev.map((item) =>
          item.id === id ? { ...item, maxSlot: value ?? 0 } : item,
        );
        notify(newMaxSlot);
        return newMaxSlot;
      });
    };
  
  if (teachers.length === 0) {
    return <p className="text-center text-gray-400">Listelenecek öğretmen bulunamadı.</p>;
  }

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
      id="list-drag-sorting-handler"
    >
      <SortableContext
        items={teachers.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="w-full space-y-2">
          {teachers.map((item) => (
            <SortableListItem key={item.id} itemKey={item.id}>
              <DragHandle />
              <Switch
                checked={item.enabled}
                onChange={(value) => handleSwitch(item.id, value)}
              />
              <span className="flex-1 text-sm truncate">
                {item.name ?? "-"}
                <span className="ml-1 text-xs text-gray-400">
                  ({item.lesson_count ?? 0} atanmış)
                </span>
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-gray-500 hidden sm:inline">
                  Maks:
                </span>
                <InputNumber
                  className="w-full"
                  min={0}
                  max={person_limit ?? 0}
                  defaultValue={0}
                  value={item.maxSlot??0}
                  disabled={!item.enabled}
                  onChange={(value) => handleMaxSlot(item.id, value)}
                />
              </div>
            </SortableListItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableList;