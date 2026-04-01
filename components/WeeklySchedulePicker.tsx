"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

// ─── Types ----

export interface TimeSlot {
  id: number;
  name: string;
  day: string;
  start_time: string;
  end_time: string;
}

export interface WeeklySchedulePickerProps {
  selected?: number[];
  onChange?: (selectedIds: number[]) => void;
  maxSelections?: number;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

/** Daha sonra görüntülemek için bir propla sadece görüntüleyebileceğimiz hale getirilebilinir.  */
//---------------- Component ------------------------------
export default function WeeklySchedulePicker({
  selected: controlledSelected,
  onChange,
  maxSelections,
}: WeeklySchedulePickerProps) {
  const [internalSelected, setInternalSelected] = useState<Set<number>>(
    new Set(controlledSelected ?? []),
  );
 const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  async function fetchSlots() {
    const res = await fetch("/api/time-slots", {
      cache: "force-cache", // browser cacheden al, hiç güncellenmeyen veri sonuçta
    });
    const data: TimeSlot[] = await res.json();
    setSlots(data);
    setLoading(false);
  }
  fetchSlots();
}, []);



  const selectedSet =
    controlledSelected !== undefined
      ? new Set(controlledSelected)
      : internalSelected;

  const toggle = useCallback(
    (id: number) => {
      const next = new Set(selectedSet);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (maxSelections && next.size >= maxSelections) return;
        next.add(id);
      }
      if (controlledSelected === undefined) setInternalSelected(next);
      onChange?.([...next].sort((a, b) => a - b));
    },
    [selectedSet, controlledSelected, onChange, maxSelections],
  );

  //tümünü temizle butonu
  const clearAll = () => {
    if (controlledSelected === undefined) setInternalSelected(new Set());
    onChange?.([]);
  };

  // gelen saatler kısaltılıyor. 15:00:00 - 15:00 gibi
  const times = [
    ...new Set(slots?.map((s) => s.start_time.slice(0, 5))),
  ].sort();

  // Slot lookup = day ve startTime - slot
  const slotMap = new Map<string, TimeSlot>(
    slots?.map((s) => [`${s.day}|${s.start_time.slice(0, 5)}`, s]),
  );

  const selectedSlots = [...selectedSet]
    .sort((a, b) => a - b)
    .map((id) => slots.find((s) => s.id === id))
    .filter(Boolean) as TimeSlot[];

  //max limit kontrolü
  const atMax =
    maxSelections !== undefined && selectedSet.size >= maxSelections;


      if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-400">
        Saatler Yükleniyor...
      </div>
    );
  }
  return (
    <div className="w-full space-y-4">
      {/* ── seçilen sayı kontrolü ve tümünü temizle alanı---- */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20">
            {selectedSet.size} saat seçildi
            {maxSelections ? ` / ${maxSelections}` : ""}
          </span>
          {atMax && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Maksimuma ulaşıldı
            </span>
          )}
        </div>

        <button
          onClick={clearAll}
          disabled={selectedSet.size === 0}
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Tümünü temizle
        </button>
      </div>

      {/* ── Tablo */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full min-w-[480px] border-collapse table-fixed">
          {/* Header  */}
          <thead>
            <tr>
              <th className="w-16 p-2 bg-gray-50 dark:bg-gray-800/60 border-b border-r border-gray-200 dark:border-gray-700" />
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 border-b border-r last:border-r-0 border-gray-200 dark:border-gray-700"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          {/* Time rows */}
          <tbody>
            {times.map((time, rowIdx) => (
              <tr key={time}>
                {/* Time Sutunu */}
                <td className="p-2 text-right text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 border-r border-b last:border-b-0 border-gray-200 dark:border-gray-700 font-mono select-none">
                  {time}
                </td>

                {/* Slotlar */}
                {DAYS.map((day) => {
                  const slot = slotMap.get(`${day}|${time}`);
                  const isSelected = slot ? selectedSet.has(slot.id) : false;
                  const isDisabled = !slot || (atMax && !isSelected);

                  return (
                    <td
                      key={day}
                      className={cn(
                        "p-1 border-r last:border-r-0 border-b border-gray-200 dark:border-gray-700",
                        rowIdx === times.length - 1 && "border-b-0",
                      )}
                    >
                      {slot ? (
                        <button
                          onClick={() => toggle(slot.id)}
                          disabled={isDisabled}
                          aria-pressed={isSelected}
                          aria-label={`${day} ${time}`}
                          className={cn(
                            "w-full h-10 rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center gap-1.5",
                            isSelected
                              ? "bg-emerald-500 dark:bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-600 dark:ring-emerald-500"
                              : isDisabled
                                ? "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-emerald-300 dark:hover:ring-emerald-700",
                          )}
                        >
                          <span className="tabular-nums">{time}</span>
                        </button>
                      ) : (
                        <div className="w-full h-10 rounded-lg bg-gray-50 dark:bg-gray-800/30 opacity-40" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Seçilen slotlar label alanı. büyük ekranda görünür. Üzerine tıklanılınca siler*/}
      <div className="space-y-2 hidden lg:block">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Seçilen saatler
        </p>

        {selectedSlots.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-600 italic">
            Henüz seçim yapılmadı
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => toggle(slot.id)}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              >
                <span>
                  {slot.day} {slot.start_time.slice(0, 5)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
