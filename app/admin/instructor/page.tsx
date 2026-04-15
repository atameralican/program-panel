

    "use client"
    import React, { JSX, useEffect, useState } from "react";
    import {  Typography, Table, Button ,Select,Input,InputNumber, message, Modal} from 'antd';
    import { IconXFilled, IconCheckFilled,IconEdit,IconTrash, IconEyeCheck } from "@tabler/icons-react"
    import { ScrollArea } from "@/components/ui/scroll-area"
    import type { ColumnsType } from 'antd/es/table';
    import {
      Card,
      CardAction,
      CardContent,
      //CardDescription,
      //CardContent,
      CardFooter,
      CardHeader,
      //CardTitle,
    } from "@/components/ui/card"
  import SortableList from "@/components/dnd-list";
  import WeeklySchedulePicker from "@/components/WeeklySchedulePicker";
  


  

  interface GenericDataType {
    id: number | null;
    name?: string;
    modules?:any;
  }
  export type TeacherType = {
    id: number;
    name: string;
    lesson_count?:number;
    maxSlot:number;
    enabled?:boolean;
  };
  interface ProgramTimeSlot {
    time_slot_id: number;
  }

  interface SelectedDataType {
    classcode_id: number | null;
    period_id: number | null;
    classroom_id: number | null;
    person_limit: number;
    // Diğer alanlar burada tanımlanabilir  
  }
  export interface ScheduleDataType {
    id: number | null;
    time_slot_id: number ;
    teachers:{id:number,name:string} | null;
    classrooms:{id:number,name:string} | null;
    classcodes?:{id:number,name:string} | null;
  }

  export type TeacherCountType={
    teacher_id:number;
    lesson_count:number;
  }
  
  interface AssignmentRow {
  teacher_id: number;
  teacher_name: string;
  classroom_id: number;
  classroom_name: string;
  time_slot_ids: number[];
}




function groupConsecutiveSlots(slots: number[]): number[][] {
  if (slots.length === 0) return [];

  const groups: number[][] = [];
  let currentGroup = [slots[0]];

  for (let i = 1; i < slots.length; i++) {
    if (slots[i] === slots[i - 1] + 1) {
      currentGroup.push(slots[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [slots[i]];
    }
  }

  groups.push(currentGroup);
  return groups;
}
function buildAssignmentBalanced(
  teachers: TeacherType[],
  availableSlots: number[],
  classroomId: number,
  classroomName: string
): AssignmentRow[] {
console.log("availableSlots",availableSlots)
  const activeTeachers = teachers
    .filter(t => t.enabled && t.maxSlot > 0)
    .map(t => ({
      ...t,
      remaining: t.maxSlot,
      slots: [] as number[],
    }));

  if (activeTeachers.length === 0) return [];

  const groups = groupConsecutiveSlots(availableSlots);

  let teacherIndex = 0;

  for (const group of groups) {

    let assigned = false;

    // 1️⃣ sıradaki hocadan başlayarak uygun olanı bul
    for (let i = 0; i < activeTeachers.length; i++) {
      const idx = (teacherIndex + i) % activeTeachers.length;
      const teacher = activeTeachers[idx];

      if (teacher.remaining >= group.length) {
        teacher.slots.push(...group);
        teacher.remaining -= group.length;

        // ✅ KRİTİK: blok bitince sırayı ilerlet
        teacherIndex = (idx + 1) % activeTeachers.length;

        assigned = true;
        break;
      }
    }

    // 2️⃣ blok verilemezse fallback (tek tek)
    if (!assigned) {
   let lastAssignedTeacherId: number | null = null;

  for (const slot of group) {

    const availableTeachers = activeTeachers.filter(t => t.remaining > 0);
    if (availableTeachers.length === 0) break;

    let selectedTeacher;

    // 🔥 1. ÖNCE aynı hocayı devam ettir
    if (lastAssignedTeacherId) {
      const sameTeacher = availableTeachers.find(
        t => t.id === lastAssignedTeacherId
      );

      if (sameTeacher) {
        selectedTeacher = sameTeacher;
      }
    }

    // 🔥 2. yoksa en çok remaining
    if (!selectedTeacher) {
      availableTeachers.sort((a, b) => {
        if (b.remaining !== a.remaining) {
          return b.remaining - a.remaining;
        }
        return (a.lesson_count ?? 0) - (b.lesson_count ?? 0);
      });

      selectedTeacher = availableTeachers[0];
    }

    selectedTeacher.slots.push(slot);
    selectedTeacher.remaining--;

    // ✅ BURASI KRİTİK
    lastAssignedTeacherId = selectedTeacher.id;

    teacherIndex = activeTeachers.findIndex(t => t.id === selectedTeacher.id);
  }
    }
  }

  return activeTeachers
    .filter(t => t.slots.length > 0)
    .map(t => ({
      teacher_id: t.id,
      teacher_name: t.name,
      classroom_id: classroomId,
      classroom_name: classroomName,
      time_slot_ids: t.slots,
    }));
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
    const InstructorPage = () => {
      const [periodList, setPeriodList] = useState();
      const [showPreview, setShowPreview] = useState(false);
      const [classcodeList, setClasscodeList] = useState<GenericDataType[]>([]);
        const [assignmentRows, setAssignmentRows] = useState<AssignmentRow[]>([]);
          const [previewSchedule, setPreviewSchedule] = useState<ScheduleDataType[]>(
            []
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
      useEffect(() => {
        console.log("teacherState",teacherState)
      }, [teacherState]);
      useEffect(() => {
        getResponseList();
      }, []);

      //Form elementlerine veri çekme
      const getResponseList = async () => {
        await fetch("/api/period/period-name", {})
          .then((res) => res?.json())
          .then((res) => {
            setPeriodList(res || []);
          });
        await fetch("/api/classcode/classcode-name", {})
          .then((res) => res?.json())
          .then((res) => {
            setClasscodeList(res || []);
          });
        await fetch("/api/classroom/classroom-name", {})
          .then((res) => res?.json())
          .then((res) => {
            setClassroomList(res || []);
          });
        await fetch("/api/teacher/teacher-name", {})
          .then((res) => res?.json())
          .then((res) => {
            const updatedList = (res || []).map((prev: TeacherType) => ({
              ...prev,
              lesson_count: 0,
              maxSlot:0,
              enabled:false
            }));
            setTeacherList(updatedList || []);
          });
      };
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
        } catch (error) {
          console.error(error);
        }
      };
      

      //Şu an da yapı classcode seçilince servislere gidiyor. yaptığı işlem
      /**OLMASI GEREKEN
       * PERİOD VE CLASSCODE SEÇİLİNCE O CLASSCODEUN O PERİODDAKİ SCHEDULE BİLGİSİNİ GETİR.
       * PROGRAM I GETİR BOŞ SAATLERİ BİLELİM.
       * PROGRAMI DİREK YERLEŞTİR SETLE SEÇİLMİŞ ADI ALTINDA OLSUN.
       ****Bİ FUNCTİON OLUŞTRU İSMİ CLASSCODECONTROL TARZINDA.
       * BU FUNCTİON DERSİ OLAN VARSA BU CLASSCODEDA ONLARI BULUP ATADIĞIMIZ KAYITTAN SİLECEK.
       * AYNI İŞLEMİ CLASSROOM İÇİNDE YAPACAĞIZ.
       */
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
      const getSchedulebyClassroom = async () => {
        try {
          const response = await fetch(
            `/api/schedule/byClassroom/${selectedData.classroom_id}/${selectedData.period_id}`,
          );
          const data: ScheduleDataType[] = await response.json();
          const usedTimeSlotIds = [
            ...new Set(data?.map((item) => item.time_slot_id)),
          ];
          setScheduleListbyClassroom(usedTimeSlotIds);
        } catch (error) {}
      };
      const getTimeSlotandSchedulebyClasscode = async (programId: number) => {
        try {
          const responseSlot = await fetch(
            `/api/program-time-slot/${programId}`,
          );
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
        } catch (error) {
          console.error("Veri çekilirken hata oluştu:", error);
        }
      };
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

      useEffect(() => {
        if (selectedData.period_id && selectedData.classroom_id) {
          getSchedulebyClassroom();
        } else {
          setScheduleListbyClassroom([]);
        }
      }, [selectedData?.classroom_id]);
      //classroom değiştiğinde o classroomun schedulerda o proiodda timeSlotlarında çakışma var mı kontrol için

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
        ); //eğer seçilen classroomda ders varsa o slota eklememesi için.
        const rows = buildAssignmentBalanced  (
          teacherState,
          newTimeSlotList,
          selectedData.classroom_id,
          classroomName,
        );

        setAssignmentRows(rows);
        setPreviewSchedule(toPreviewSchedule(rows));
        setShowPreview(true);
      };

useEffect(() => {
  console.log("previewSchedule",previewSchedule)
  console.log("assignmentRows",assignmentRows)
}, [previewSchedule]);

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
      try {
    const res = await fetch("/api/schedule/save-bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(records), // ✅ KRİTİK
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
                <div className="col-span-6 lg:col-span-3">
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
                <div className="col-span-6 lg:col-span-3">
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

                <div className="col-span-6 lg:col-span-3">
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
                  <Button
                    size="large"
                    color="blue"
                    variant="filled"
                    disabled={!selectedData?.period_id||!selectedData?.classcode_id||!selectedData?.classroom_id||!selectedData?.person_limit||timeSlotList.length<1||!teacherState.some(t => t.enabled && (t.maxSlot ?? 0) > 0)}
                    onClick={handlePreview}
                    icon={<IconEyeCheck />}
                  ></Button>
                  <Button
                    size="large"
                    danger
                    className="ms-2"
                    onClick={handleClear}
                    color="danger"
                    variant="filled"
                    icon={<IconXFilled />}
                  ></Button>
                </div>
              </div>
            </CardHeader>

            <hr />
            <CardContent>
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
                // onChange={handleChangeSlotTable}
                // maxSelections={selectedData.max_limit} // girilen max limiti yazacağız.
              />
            </CardContent>
          </Card>
          {showPreview&&
          <Modal
        title={`Assign Preview - ${assignmentRows?.[0]?.classroom_name}`}
        centered
        open={showPreview}
        onOk={handleSave}
        onCancel={() => setShowPreview(false)}
        width={1000}
        mask={{blur:true}}
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
             //   selected={timeSlotList}
                viewMode
                scheduleListbyClasscode={scheduleListbyClasscode}
                previewSlotList={previewSchedule}
                //  onChange={handleChangeSlotTable}
                // maxSelections={selectedData.max_limit} // girilen max limiti yazacağız.
              />
      </Modal>}
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