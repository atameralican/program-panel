"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { HolderOutlined } from "@ant-design/icons";
import type { DragEndEvent, DraggableAttributes } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, InputNumber, Switch } from "antd";
import { Card } from "@/components/ui/card";
import { TeacherType } from "@/app/admin/instructor/page";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TeacherState extends TeacherType {
  enabled: boolean;
  maxSlots: number;
}

interface SortableListProps {
  teacherList?: TeacherType[];
  person_limit?: number;
  /** Sıralı öğretmen listesi her değiştiğinde (switch/input/drag) çağrılır */
  onTeacherStateChange?: (teachers: TeacherState[]) => void;
}

// ─── Drag Handle Context ──────────────────────────────────────────────────────

interface SortableListItemContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
}

const SortableListItemContext = createContext<SortableListItemContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners, attributes } = useContext(
    SortableListItemContext
  );
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: "move" }}
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
    />
  );
};

// ─── SortableListItem ─────────────────────────────────────────────────────────

interface SortableListItemProps {
  itemKey: number;
  children: React.ReactNode;
}

const SortableListItem: React.FC<SortableListItemProps> = ({
  itemKey,
  children,
}) => {
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
    ...(isDragging
      ? { position: "relative", zIndex: 9999, opacity: 0.8 }
      : {}),
  };

  const memoizedValue = useMemo<SortableListItemContextProps>(
    () => ({ setActivatorNodeRef, listeners, attributes }),
    [setActivatorNodeRef, listeners, attributes]
  );

  return (
    <SortableListItemContext.Provider value={memoizedValue}>
      <Card ref={setNodeRef} style={style} className="mb-2 p-3">
        <div className="flex items-center gap-3">{children}</div>
      </Card>
    </SortableListItemContext.Provider>
  );
};

// ─── SortableList ─────────────────────────────────────────────────────────────

const DenemeSortableList: React.FC<SortableListProps> = ({
  teacherList = [],
  person_limit,
  onTeacherStateChange,
}) => {
  const [teachers, setTeachers] = useState<TeacherState[]>([]);

  // teacherList prop değiştiğinde (API'den veri gelince) state'i sıfırla
  useEffect(() => {
    const initialized: TeacherState[] = teacherList.map((t) => ({
      ...t,
      enabled: false,
      maxSlots: 0,
    }));
    setTeachers(initialized);
  }, [teacherList]);

  // Her state değişiminde parent'ı bilgilendir
  const notify = (updated: TeacherState[]) => {
    onTeacherStateChange?.(updated);
  };
/**Arrayden sıralamayı değiştiriyor sıralama değişince*/
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!active || !over || active.id === over.id) return;
    setTeachers((prev) => {
      const activeIndex = prev.findIndex((i) => i.id === active.id);
      const overIndex = prev.findIndex((i) => i.id === over.id);
      const newIndex = arrayMove(prev, activeIndex, overIndex);
      //notify(newIndex);//parentı bilgilendir. 
      onTeacherStateChange=()=>(newIndex)
      return newIndex;
    });
  };

  const handleToggle = (id: number, enabled: boolean) => {
    setTeachers((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, enabled } : t
      );
      notify(next);
      return next;
    });
  };

  const handleMaxSlots = (id: number, value: number | null) => {
    setTeachers((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, maxSlots: value ?? 0 } : t
      );
      notify(next);
      return next;
    });
  };

  if (teachers.length === 0) {
    return (
      <p className="text-center text-gray-400">
        Listelenecek öğretmen bulunamadı.
      </p>
    );
  }

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
      id="list-drag-sorting-handler"
    >
      <SortableContext
        items={teachers.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="w-full space-y-2">
          {teachers.map((item, index) => (
            <SortableListItem key={item.id} itemKey={item.id}>
              {/* Öncelik sırası */}
              <span className="text-xs text-gray-400 font-mono w-4 shrink-0">
                {index + 1}
              </span>

              <DragHandle />

              <Switch
                checked={item.enabled}
                onChange={(val) => handleToggle(item.id, val)}
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
                  className="w-16"
                  min={0}
                  max={person_limit ?? 999}
                  value={item.maxSlots}
                  disabled={!item.enabled}
                  onChange={(val) => handleMaxSlots(item.id, val)}
                />
              </div>
            </SortableListItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DenemeSortableList;