"use client";
import React, { useEffect, useState } from "react";
import { Typography, Button, Select, InputNumber, message, Modal, Tooltip, Spin } from "antd";
import { IconXFilled, IconEyeCheck } from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SortableList from "@/components/dnd-list";
import WeeklySchedulePicker from "@/components/WeeklySchedulePicker";
import {
  AssignmentRow,
  GenericDataType,
  ProgramTimeSlot,
  ScheduleDataType,
  SelectedDataType,
  TeacherCountType,
  TeacherType,
} from "./types";
import { buildAssignmentBalanced, toPreviewSchedule } from "./utils";

const InstructorPage = () => {
  const [periodList, setPeriodList] = useState();
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [classcodeList, setClasscodeList] = useState<GenericDataType[]>([]);
  const [assignmentRows, setAssignmentRows] = useState<AssignmentRow[]>([]);
  const [previewSchedule, setPreviewSchedule] = useState<ScheduleDataType[]>(
    [],
  );
  const [classroomList, setClassroomList] = useState<GenericDataType[]>([]);
  const [teacherList, setTeacherList] = useState<TeacherType[]>([]);
  const [teacherState, setTeacherState] = useState<TeacherType[]>([]);
  const [scheduleListbyClasscode, setScheduleListbyClasscode] = useState<
    ScheduleDataType[]
  >([]);
  const [scheduleListbyClassroom, setScheduleListbyClassroom] = useState<
    number[]
  >([]); //seçilen periodda classroom seçilince dolu olan slot idleri gelir.
  const [timeSlotList, setTimeSlotList] = useState<number[]>([]);
  const [selectedData, setSelectedData] = useState<SelectedDataType>({
    classcode_id: null,
    person_limit: 0,
    period_id: null,
    classroom_id: null,
  });

  /////// ------- FIRST GET FETC FUNCTIONS START ------- ///////
  useEffect(() => {
    getResponseList();
  }, []);

  //Form elementlerine veri çekme
  const getResponseList = async () => {
  setLoading(true);
  try {
    // 1. Period
    const resPeriod = await fetch("/api/period/period-name");
    const dataPeriod = await resPeriod.json();
    setPeriodList(dataPeriod || []);

    // 2. Classcode
    const resClasscode = await fetch("/api/classcode/classcode-name");
    const dataClasscode = await resClasscode.json();
    setClasscodeList(dataClasscode || []);

    // 3. Classroom
    const resClassroom = await fetch("/api/classroom/classroom-name");
    const dataClassroom = await resClassroom.json();
    setClassroomList(dataClassroom || []);

    // 4. Teacher
    const resTeacher = await fetch("/api/teacher/teacher-name");
    const dataTeacher = await resTeacher.json();
    const updatedList = (dataTeacher || []).map((prev: TeacherType) => ({
      ...prev,
      lesson_count: 0,
      maxSlot: 0,
      enabled: false,
    }));
    setTeacherList(updatedList);

  } catch (error:any) {
    message.error("Veri çekme hatası:", error);
  } finally {
    setLoading(false); // Her durumda çalışır
  }
};
  /////// ------- FIRST GET FETC FUNCTIONS END ------- ///////

  /////// ------- PERIOD CHANGE START ------- ///////
  //Period değişince diğer alanlar ve değerler boşaltılır ve diğer selectboxların içeriği çekilir
  useEffect(() => {
    if (selectedData?.period_id) {
      setSelectedData((prev) => ({
        ...prev,
        classcode_id: null,
        person_limit: 0,
        classroom_id: null,
      }));
    }
    setTimeSlotList([]);
    setTeacherList((prev) =>
      prev.map((t) => {
        return { ...t, lesson_count: 0 };
      }),
    );

    setScheduleListbyClassroom([]);
    getTeacherSlotCount();
    setScheduleListbyClasscode([]);
  }, [selectedData?.period_id]);

  //Period değişince o periodda teacherın kaç slotu var onu getiriyor.
  const getTeacherSlotCount = async () => {
    try {
      const response = await fetch(
        `/api/schedule/teacherSlotCountforPeriod/${selectedData.period_id}`,
      );
      const data: TeacherCountType[] = await response.json();
      if (data.length > 0) {
        setTeacherList((prev) =>
          prev.map((t) => {
            const found = data.find((d) => d.teacher_id === t.id);
            return found ? { ...t, lesson_count: found.lesson_count } : t;
          }),
        );
      } else {
        setTeacherList((prev) =>
          prev.map((t) => {
            return { ...t, lesson_count: 0 };
          }),
        );
      }
    } catch (error:any) {
      message.error(error);
    }
  };
  /////// ------- PERIOD CHANGE END ------- ///////

  /////// ------- CLASSCODE CHANGE START ------- ///////
  useEffect(() => {
    //seçilen classcode içerisinden programİd alınıyor ve o programid ile servisten slotlar getiriliyor
    if (selectedData?.classcode_id) {
      const selectClasscode = classcodeList.find(
        (c) => c.id === selectedData?.classcode_id,
      );
      if (selectClasscode) {
        const programId = selectClasscode?.modules?.program_id;
        getTimeSlotandSchedulebyClasscode(programId); //program Slotları getiriyoruz. Getirmek için.
      }
    } else {
      setTimeSlotList([]);
      setScheduleListbyClasscode([]);
    }
  }, [selectedData?.classcode_id]);

  const getTimeSlotandSchedulebyClasscode = async (programId: number) => {
    setScheduleLoading(true)
    try {
      const responseSlot = await fetch(`/api/program-time-slot/${programId}`);
      const responseSchedulebyClasscode = await fetch(
        `/api/schedule/byClasscode/${selectedData.classcode_id}/${selectedData.period_id}`,
      );

      const dataSchedulebyClasscode: ScheduleDataType[] =
        await responseSchedulebyClasscode.json();
      const dataSlot: ProgramTimeSlot[] = await responseSlot.json();

      const timeSlotIds = dataSlot.map((item) => item?.time_slot_id);

      setScheduleListbyClasscode(dataSchedulebyClasscode);

      // Artık state'e bağlı değil, direkt veriyi geçiyoruz
      controleClasscode(timeSlotIds, dataSchedulebyClasscode);
    } catch (error:any) {
      message.error("Veri çekilirken hata oluştu:", error);
    } finally{setScheduleLoading(false)}
  };

  //classcode'a göre time slot çekme
  const controleClasscode = (
    currentTimeSlotIds: number[],
    currentScheduleByClasscode: ScheduleDataType[],
  ) => {
    if (currentTimeSlotIds.length > 0) {
      const usedTimeSlotIds = new Set(
        currentScheduleByClasscode?.map((item) => item.time_slot_id),
      );
      const filteredIds = currentTimeSlotIds.filter(
        (id) => !usedTimeSlotIds.has(id),
      );
      setTimeSlotList(filteredIds);
    }
  };
  /////// ------- CLASSCODE CHANGE END ------- ///////

  /////// ------- CLASSROOM CHANGE START ------- ///////
  //classroom değiştiğinde o classroomun schedulerda o proiodda timeSlotlarında çakışma var mı kontrol için
  useEffect(() => {
    if (selectedData.period_id && selectedData.classroom_id) {
      getSchedulebyClassroom();
    } else {
      setScheduleListbyClassroom([]);
    }
  }, [selectedData?.classroom_id]);

  const getSchedulebyClassroom = async () => {
    setScheduleLoading(true)
    try {
      const response = await fetch(
        `/api/schedule/byClassroom/${selectedData.classroom_id}/${selectedData.period_id}`,
      );
      const data: ScheduleDataType[] = await response.json();
      const usedTimeSlotIds = [
        ...new Set(data?.map((item) => item.time_slot_id)),
      ];
      setScheduleListbyClassroom(usedTimeSlotIds);
    } catch (error:any) {
      message.error("Veri çekilirken hata oluştu:", error);
    } finally{setScheduleLoading(false)}
  };
  /////// ------- CLASSROOM CHANGE END ------- ///////

  /////// ------- CLEAR START ------- ///////
  const handleClear = () => {
    setSelectedData({
      classcode_id: null,
      person_limit: 0,
      period_id: null,
      classroom_id: null,
    });
    setTeacherList((prev) =>
      prev.map((t) => {
        return { ...t, lesson_count: 0 };
      }),
    );
  };
  /////// ------- CLEAR START ------- ///////

  /////// ------- PREVİEW START ------- ///////
  const handlePreview = () => {
    if (
      !selectedData?.period_id ||
      !selectedData?.classcode_id ||
      !selectedData?.classroom_id ||
      !selectedData?.person_limit
    ) {
      message.warning("Lütfen İlgili Alanları Doldurunuz");
      return;
    }
    if (timeSlotList.length < 1) {
      message.warning("Atanacak Uygun Saat Bulunmamaktadır");
      return;
    }
    if (!teacherState.some((t) => t.enabled && (t.maxSlot ?? 0) > 0)) {
      message.warning("Teacher Max Ders Saati Girilmemiştir");
      return;
    }
    const classroom = classroomList.find(
      (c) => c.id === selectedData.classroom_id,
    );
    const classroomName =
      classroom?.name ?? `Derslik #${selectedData.classroom_id}`;

    const newTimeSlotList = timeSlotList.filter(
      (item) => !scheduleListbyClassroom?.includes(item),
    ); //eğer seçilen classroomda ders varsa(sarı) o slota eklememesi için.
    const rows = buildAssignmentBalanced(
      teacherState,
      newTimeSlotList,
      selectedData.classroom_id,
      classroomName,
    );

    setAssignmentRows(rows);
    setPreviewSchedule(toPreviewSchedule(rows));
    setShowPreview(true);
  };
  /////// ------- PREVİEW END ------- ///////

  /////// ------- SAVE START ------- ///////
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

    // Toplu kayıt payloadı
    const records = assignmentRows.flatMap((row) =>
      row.time_slot_ids.map((slotId) => ({
        classcode_id: selectedData.classcode_id,
        teacher_id: row.teacher_id,
        time_slot_id: slotId,
        period_id: selectedData.period_id,
        classroom_id: row.classroom_id,
      })),
    );
    try {
      const res = await fetch("/api/schedule/save-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(records),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Sunucu hatası");
      }

      message.success(data.message || "Kayıt başarılı!");
      setShowPreview(false);
      handleClear();
    } catch (err: any) {
      message.error(`Kayıt başarısız: ${err.message}`);
    }
  };
  /////// ------- SAVE END ------- ///////
  return (
    <div className="flex-row ">
      <Card>
        <CardHeader className="">
          <div className="grid  grid-cols-12 gap-4">
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Period</Typography.Title>
              <Select
                fieldNames={{ label: "name", value: "id" }}
                className="w-full"
                options={periodList}
                value={selectedData?.period_id}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, period_id: e }))
                }
              />
            </div>
            <div className="col-span-6 lg:col-span-2">
              <Typography.Title level={5}>ClassCode</Typography.Title>
              <Select
                fieldNames={{ label: "name", value: "id" }}
                className="w-full"
                options={classcodeList}
                value={selectedData?.classcode_id}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, classcode_id: e }))
                }
              />
            </div>
            <div className="col-span-6 lg:col-span-2">
              <Typography.Title level={5}>Classroom</Typography.Title>
              <Select
                fieldNames={{ label: "name", value: "id" }}
                className="w-full"
                options={classroomList}
                value={selectedData?.classroom_id}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, classroom_id: e }))
                }
              />
            </div>

            <div className="col-span-6 lg:col-span-2">
              <Typography.Title level={5}>
                One Person Max Limit
              </Typography.Title>
              <InputNumber
                className="w-full"
                min={0}
                max={timeSlotList.length || 40}
                value={selectedData?.person_limit}
                onChange={(e) =>
                  setSelectedData((prev) => ({
                    ...prev,
                    person_limit: e || 0,
                  }))
                }
              />
            </div>

            <div className="col-span-12 lg:col-span-8">
              <Typography.Title level={5}>Teacher List</Typography.Title>
              <ScrollArea className="h-64 w-full p-2 rounded-md border">
                <SortableList
                  teacherList={teacherList}
                  person_limit={selectedData?.person_limit}
                  onTeacherStateChange={setTeacherState}
                />
              </ScrollArea>
            </div>
            <div className="col-span-6 lg:col-span-2 content-end   ">
              <Tooltip title="Preview" placement="bottom">
                <Button
                  size="large"
                  color="blue"
                  variant="filled"
                  disabled={
                    !selectedData?.period_id ||
                    !selectedData?.classcode_id ||
                    !selectedData?.classroom_id ||
                    !selectedData?.person_limit ||
                    timeSlotList.length < 1 ||
                    !teacherState.some((t) => t.enabled && (t.maxSlot ?? 0) > 0)
                  }
                  onClick={handlePreview}
                  icon={<IconEyeCheck />}
                />
              </Tooltip>
              <Tooltip title="Clear" placement="bottom">
                {" "}
                <Button
                  size="large"
                  danger
                  className="ms-2"
                  onClick={handleClear}
                  color="danger"
                  variant="filled"
                  icon={<IconXFilled />}
                />
              </Tooltip>
            </div>
          </div>
        </CardHeader>

        <hr />
        <CardContent>
          <Typography.Title level={5} className="mb-2">
            Mevcut Program{" "}
            <span className="text-xs font-normal text-gray-400">
              (Yeşil = boş atanabilir • Kırmızı = dolu • Sarı = derslik
              çakışması)
            </span>
          </Typography.Title>
          <Spin spinning={scheduleLoading}>
            <WeeklySchedulePicker
              selected={timeSlotList}
              scheduleListbyClasscode={scheduleListbyClasscode}
              scheduleListbyClassroom={scheduleListbyClassroom}
              viewMode
            />
          </Spin>
        </CardContent>
      </Card>
      {showPreview && (
        <Modal
          title={`Assign Preview - ${assignmentRows?.[0]?.classroom_name}`}
          centered
          open={showPreview}
          onOk={handleSave}
          onCancel={() => setShowPreview(false)}
          width={1000}
          mask={{ blur: true }}
        >
          <div className="my-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
            {assignmentRows.map((row) => (
              <div
                key={row.teacher_id}
                className="flex items-center gap-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2"
              >
                <span className="font-medium text-sm text-emerald-800 dark:text-emerald-300 min-w-32 truncate">
                  {row.teacher_name}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                  {row.time_slot_ids?.length} slot atandı
                </span>
              </div>
            ))}
          </div>
          <WeeklySchedulePicker
            viewMode
            scheduleListbyClasscode={scheduleListbyClasscode}
            previewSlotList={previewSchedule}
          />
        </Modal>
      )}
      {loading && <Spin spinning={loading} description="Loading" fullscreen />}
    </div>
  );
};

export default InstructorPage;

/**
 * Yeşil: Ders atanabilir.
 * Sarı: o Classroomda o saatte ders var
 * Border-Sarı: O Classroomda o saatte ders var. Assignto denildiğinde uyaracak ve oraya atama yapmayacak.
 * Kırmızı: O Classcode da o saate ders ataması daha önce yapılmış . Onu geçip diğerlerine atama yapacak.
 */
