"use client";

import React, { useEffect, useState } from "react";
import { Typography, Table, Button, Select, InputNumber, message } from "antd";
import {
  IconXFilled,
  IconCheckFilled,
  IconPlayerPlay,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import WeeklySchedulePicker from "@/components/WeeklySchedulePicker";
import DenemeSortableList,{ TeacherState } from "./componentDeneme";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GenericDataType {
  id: number | null;
  name?: string;
  full_name?: string;
  modules?: any;
}

export type TeacherType = {
  id: number;
  name: string;
  lesson_count?: number;
};

interface ProgramTimeSlot {
  time_slot_id: number;
}

interface SelectedDataType {
  classcode_id: number | null;
  teacher_id: number | null;
  period_id: number | null;
  classroom_id: number | null;
  person_limit: number;
}

export interface ScheduleDataType {
  id: number | null;
  time_slot_id: number;
  teachers: { id: number; name: string } | null;
  classrooms: { id: number; name: string } | null;
}

export type TeacherCountType = {
  teacher_id: number;
  lesson_count: number;
};

// ─── Atama Algoritması ────────────────────────────────────────────────────────

interface AssignmentRow {
  teacher_id: number;
  teacher_name: string;
  classroom_id: number;
  classroom_name: string;
  time_slot_ids: number[];
}

/**
 * Etkin öğretmenleri sırayla doldurarak slot atar.
 * Üstten alta: ilk öğretmenin maxSlots dolana kadar slot verilir, sonra ikinciye, vs.
 */
function buildAssignment(
  sortedTeachers: TeacherState[],// teacherStates,
  availableSlots: number[], // timeSlotList – boş slotlar//   timeSlotList,
  classroomId: number,//   selectedData.classroom_id,
  classroomName: string//   classroomName
): AssignmentRow[] {

  const result: AssignmentRow[] = [];
  let slotCursor = 0;

  for (const teacher of sortedTeachers) {
    if (!teacher.enabled || teacher.maxSlots <= 0) continue;
    if (slotCursor >= availableSlots.length) break;

    const assigned: number[] = [];
    while (
      assigned.length < teacher.maxSlots &&
      slotCursor < availableSlots.length
    ) {
      assigned.push(availableSlots[slotCursor]);
      slotCursor++;
    }

    if (assigned.length > 0) {
      result.push({
        teacher_id: teacher.id,
        teacher_name: teacher.name,
        classroom_id: classroomId,
        classroom_name: classroomName,
        time_slot_ids: assigned,
      });
    }
  }
console.log("result",result)
  return result;
}

/** AssignmentRow[] → WeeklySchedulePicker'ın beklediği ScheduleDataType[] */
function toPreviewSchedule(rows: AssignmentRow[]): ScheduleDataType[] {
  return rows.flatMap((row) =>
    row.time_slot_ids.map((slotId) => ({
      id: null,
      time_slot_id: slotId,
      teachers: { id: row.teacher_id, name: row.teacher_name },
      classrooms: { id: row.classroom_id, name: row.classroom_name },
    }))
  );
}

// ─── Sayfa ────────────────────────────────────────────────────────────────────

const InstructorPage = () => {
  const [periodList, setPeriodList] = useState<GenericDataType[]>([]);
  const [classcodeList, setClasscodeList] = useState<GenericDataType[]>([]);
  const [classroomList, setClassroomList] = useState<GenericDataType[]>([]);
  const [teacherList, setTeacherList] = useState<TeacherType[]>([]);

  const [scheduleListbyClasscode, setScheduleListbyClasscode] = useState<
    ScheduleDataType[]
  >([]);
  const [scheduleListbyClassroom, setScheduleListbyClassroom] = useState<
    number[]
  >([]);
  const [timeSlotList, setTimeSlotList] = useState<number[]>([]);

  const [selectedData, setSelectedData] = useState<SelectedDataType>({
    classcode_id: null,
    person_limit: 0,
    teacher_id: null,
    period_id: null,
    classroom_id: null,
  });

  // SortableList'ten gelen sıralı + işaretli öğretmen listesi
  const [teacherStates, setTeacherStates] = useState<TeacherState[]>([]);

  // Atama önizlemesi
  const [assignmentRows, setAssignmentRows] = useState<AssignmentRow[]>([]);
  const [previewSchedule, setPreviewSchedule] = useState<ScheduleDataType[]>(
    []
  );
  const [showPreview, setShowPreview] = useState(false);

  const [saving, setSaving] = useState(false);

  // ── Veri çekme ──────────────────────────────────────────────────────────────

  useEffect(() => {
    getResponseList();
  }, []);

  const getResponseList = async () => {
    const [periods, classcodes, classrooms, teachers] = await Promise.all([
      fetch("/api/period/period-name").then((r) => r.json()),
      fetch("/api/classcode/classcode-name").then((r) => r.json()),
      fetch("/api/classroom/classroom-name").then((r) => r.json()),
      fetch("/api/teacher/teacher-name").then((r) => r.json()),
    ]);

    setPeriodList(periods ?? []);
    setClasscodeList(classcodes ?? []);
    setClassroomList(classrooms ?? []);
    setTeacherList(
      (teachers ?? []).map((t: TeacherType) => ({ ...t, lesson_count: 0 }))
    );
  };

  const getTeacherSlotCount = async () => {
    try {
      const data: TeacherCountType[] = await fetch(
        `/api/schedule/teacherSlotCountforPeriod/${selectedData.period_id}`
      ).then((r) => r.json());

      setTeacherList((prev) =>
        prev.map((t) => {
          const found = data.find((d) => d.teacher_id === t.id);
          return found ? { ...t, lesson_count: found.lesson_count } : { ...t, lesson_count: 0 };
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedData.period_id) getTeacherSlotCount();
  }, [selectedData.period_id]);

  const controleClasscode = (
    currentTimeSlotIds: number[],
    currentScheduleByClasscode: ScheduleDataType[]
  ) => {
    if (currentTimeSlotIds.length > 0) {
      const usedSet = new Set(
        currentScheduleByClasscode.map((s) => s.time_slot_id)
      );
      setTimeSlotList(currentTimeSlotIds.filter((id) => !usedSet.has(id)));
    }
  };

  const getSchedulebyClassroom = async () => {
    try {
      const data: ScheduleDataType[] = await fetch(
        `/api/schedule/byClassroom/${selectedData.classroom_id}/${selectedData.period_id}`
      ).then((r) => r.json());
      setScheduleListbyClassroom([
        ...new Set(data.map((s) => s.time_slot_id)),
      ]);
    } catch {}
  };

  const getTimeSlotandSchedulebyClasscode = async (programId: number) => {
    try {
      const [slotData, scheduleData] = await Promise.all([
        fetch(`/api/program-time-slot/${programId}`).then(
          (r) => r.json() as Promise<ProgramTimeSlot[]>
        ),
        fetch(
          `/api/schedule/byClasscode/${selectedData.classcode_id}/${selectedData.period_id}`
        ).then((r) => r.json() as Promise<ScheduleDataType[]>),
      ]);

      setScheduleListbyClasscode(scheduleData);
      controleClasscode(
        slotData.map((s) => s.time_slot_id),
        scheduleData
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedData.classcode_id) {
      const found = classcodeList.find(
        (c) => c.id === selectedData.classcode_id
      );
      if (found?.modules?.program_id) {
        getTimeSlotandSchedulebyClasscode(found.modules.program_id);
      }
    } else {
      setTimeSlotList([]);
      setScheduleListbyClasscode([]);
    }
    // Seçim değişince önizlemeyi sıfırla
    resetAssignment();
  }, [selectedData.classcode_id, selectedData.period_id]);

  useEffect(() => {
    if (selectedData.period_id && selectedData.classroom_id) {
      getSchedulebyClassroom();
    } else {
      setScheduleListbyClassroom([]);
    }
    resetAssignment();
  }, [selectedData.classroom_id, selectedData.period_id]);

  // ── Atama ──────────────────────────────────────────────────────────────────

  const resetAssignment = () => {
    setAssignmentRows([]);
    setPreviewSchedule([]);
    setShowPreview(false);
  };

  const handleAssign = () => {
    if (!selectedData.classroom_id) {
      message.warning("Lütfen önce bir derslik seçin.");
      return;
    }
    if (timeSlotList.length === 0) {
      message.warning("Atanabilir boş slot bulunamadı.");
      return;
    }

    const classroom = classroomList.find(
      (c) => c.id === selectedData.classroom_id
    );
    const classroomName = classroom?.name ?? `Derslik #${selectedData.classroom_id}`;

    const rows = buildAssignment(
      teacherStates,
      timeSlotList,
      selectedData.classroom_id,
      classroomName
    );
console.log("rows",rows)
console.log("toPreviewSchedule(rows)",toPreviewSchedule(rows))
    if (rows.length === 0) {
      message.loading(
        "Aktif ve maksimum slot girilmiş öğretmen bulunamadı. Switch'leri ve maks değerlerini kontrol edin."
      );
      return;
    }
console.log("rows",rows)
    setAssignmentRows(rows);
    setPreviewSchedule(toPreviewSchedule(rows));
    setShowPreview(true);
  };

  // ── Kaydet ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (assignmentRows.length === 0) return;
    if (
      !selectedData.classcode_id ||
      !selectedData.period_id ||
      !selectedData.classroom_id
    ) {
      message.error("Classcode, Period ve Classroom seçili olmalı.");
      return;
    }

    // Toplu kayıt payload'ı
    const records = assignmentRows.flatMap((row) =>
      row.time_slot_ids.map((slotId) => ({
        classcode_id: selectedData.classcode_id,
        teacher_id: row.teacher_id,
        time_slot_id: slotId,
        period_id: selectedData.period_id,
        classroom_id: row.classroom_id,
      }))
    );

    setSaving(true);
    try {
      const res = await fetch("/api/schedule/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? "Sunucu hatası");
      }

      message.success(`${records.length} kayıt başarıyla oluşturuldu.`);
      handleClear();
    } catch (err: any) {
      message.error(`Kayıt başarısız: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Temizle ────────────────────────────────────────────────────────────────

  const handleClear = () => {
    setSelectedData({
      classcode_id: null,
      person_limit: 0,
      teacher_id: null,
      period_id: null,
      classroom_id: null,
    });
    setTeacherList((prev) => prev.map((t) => ({ ...t, lesson_count: 0 })));
    resetAssignment();
  };

  // ── Yardımcılar ────────────────────────────────────────────────────────────

  const totalAssigned = assignmentRows.reduce(
    (acc, r) => acc + r.time_slot_ids.length,
    0
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">
      {/* ── Ayarlar Kartı ── */}
      <Card>
        <CardHeader>
          <div className="grid grid-cols-12 gap-4">
            {/* Period */}
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Period</Typography.Title>
              <Select
                fieldNames={{ label: "name", value: "id" }}
                className="w-full"
                options={periodList}
                value={selectedData.period_id}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, period_id: e }))
                }
              />
            </div>

            {/* ClassCode */}
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>ClassCode</Typography.Title>
              <Select
                fieldNames={{ label: "full_name", value: "id" }}
                className="w-full"
                options={classcodeList}
                value={selectedData.classcode_id}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, classcode_id: e }))
                }
              />
            </div>

            {/* Classroom */}
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Classroom</Typography.Title>
              <Select
                fieldNames={{ label: "name", value: "id" }}
                className="w-full"
                options={classroomList}
                value={selectedData.classroom_id}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, classroom_id: e }))
                }
              />
            </div>

            {/* Person Limit */}
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>One Person Max Limit</Typography.Title>
              <InputNumber
                className="w-full"
                min={0}
                max={timeSlotList.length || 40}
                value={selectedData.person_limit}
                onChange={(e) =>
                  setSelectedData((prev) => ({
                    ...prev,
                    person_limit: e || 0,
                  }))
                }
              />
            </div>

            {/* Teacher List */}
            <div className="col-span-12 lg:col-span-8">
              <Typography.Title level={5}>
                Öğretmen Listesi{" "}
                <span className="text-xs font-normal text-gray-400">
                  (sürükle ile sıralandır • switch ile etkinleştir • maks slot
                  gir)
                </span>
              </Typography.Title>
              <ScrollArea className="h-64 w-full p-2 rounded-md border">
                <DenemeSortableList
                  teacherList={teacherList}
                  person_limit={selectedData.person_limit}
                  onTeacherStateChange={setTeacherStates}
                />
              </ScrollArea>
            </div>

            {/* Aksiyon Butonları */}
            <div className="col-span-12 lg:col-span-4 flex flex-col justify-end gap-2">
              {/* Ata butonu */}
              <Button
                size="large"
                color="blue"
                variant="filled"
                icon={<IconPlayerPlay size={16} />}
                onClick={handleAssign}
                disabled={
                  !selectedData.classcode_id ||
                  !selectedData.classroom_id ||
                  !selectedData.period_id
                }
                className="w-full"
              >
                Ata (Önizle)
              </Button>

              {/* Temizle */}
              <Button
                size="large"
                danger
                variant="filled"
                icon={<IconXFilled size={16} />}
                onClick={handleClear}
                className="w-full"
              >
                Temizle
              </Button>
            </div>
          </div>
        </CardHeader>

        <hr />

        {/* ── Mevcut Durum (seçim görünümü) ── */}
        <CardContent className="pt-4">
          <Typography.Title level={5} className="mb-2">
            Mevcut Program{" "}
            <span className="text-xs font-normal text-gray-400">
              (Yeşil = boş atanabilir • Kırmızı = dolu • Sarı = derslik çakışması)
            </span>
          </Typography.Title>
          <WeeklySchedulePicker
            selected={timeSlotList}
            scheduleListbyClasscode={scheduleListbyClasscode}
            scheduleListbyClassroom={scheduleListbyClassroom}
            viewMode
          />
        </CardContent>
      </Card>

      {/* ── Atama Önizleme Kartı ── */}
      {showPreview && (
        <Card className="border-2 border-emerald-400 dark:border-emerald-600">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <Typography.Title level={4} className="!mb-0">
                  Atama Önizlemesi
                </Typography.Title>
                <p className="text-sm text-gray-500 mt-1">
                  {assignmentRows.length} öğretmene toplam{" "}
                  <strong>{totalAssigned}</strong> slot atandı. Uygun
                  buluyorsanız kaydedin.
                </p>
              </div>

              {/* Kaydet butonu */}
              <Button
                size="large"
                type="primary"
                icon={<IconDeviceFloppy size={16} />}
                loading={saving}
                onClick={handleSave}
              >
                Kaydet
              </Button>
            </div>

            {/* Atama özet tablosu */}
            <div className="mt-4 space-y-2">
              {assignmentRows.map((row) => (
                <div
                  key={row.teacher_id}
                  className="flex items-center gap-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2"
                >
                  <span className="font-medium text-sm text-emerald-800 dark:text-emerald-300 min-w-32 truncate">
                    {row.teacher_name}
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">
                    {row.time_slot_ids.length} slot atandı
                  </span>
                  <span className="ml-auto text-xs text-gray-400">
                    {row.classroom_name}
                  </span>
                </div>
              ))}
            </div>
          </CardHeader>

          <hr />

          {/* Atama sonrası program görünümü */}
          <CardContent className="pt-4">
            <Typography.Title level={5} className="mb-2">
              Atanmış Program Görünümü
            </Typography.Title>
            <WeeklySchedulePicker
              selected={[]}
              scheduleListbyClasscode={[
                // Mevcut program + yeni atamalar birleşik gösterilir
                ...scheduleListbyClasscode,
                ...previewSchedule,
              ]}
              scheduleListbyClassroom={scheduleListbyClassroom}
              viewMode
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstructorPage;