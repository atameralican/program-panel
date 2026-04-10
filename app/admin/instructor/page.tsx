

    "use client"
    import React, { JSX, useEffect, useState } from "react";
    import {  Typography, Table, Button ,Select,Input,InputNumber} from 'antd';
    import { IconXFilled, IconCheckFilled,IconEdit,IconTrash } from "@tabler/icons-react"
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
    full_name?: string;
    modules?:any;
  }
  export type TeacherType = {
    id: number;
    name: string;
    lesson_count?:number;
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
    // Diğer alanlar burada tanımlanabilir  
  }
  export interface ScheduleDataType {
    id: number | null;
    time_slot_id: number ;
    teachers:{id:number,name:string} | null;
    classrooms:{id:number,name:string} | null;
  }

  export type TeacherCountType={
    teacher_id:number;
    lesson_count:number;
  }

    const InstructorPage = () => {
      const [periodList, setPeriodList] = useState();
      const [classcodeList, setClasscodeList] = useState<GenericDataType[]>([]);
      const [classroomList, setClassroomList] = useState<GenericDataType[]>([]);
      const [teacherList, setTeacherList] = useState<TeacherType[]>([]);
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
        teacher_id: null,
        period_id: null,
        classroom_id: null,
      });
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
      useEffect(() => {
        if (selectedData?.period_id) {
          getTeacherSlotCount();
        }
      }, [selectedData?.period_id]);
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
      }, [selectedData?.classcode_id, selectedData?.period_id]);

      useEffect(() => {
        if (selectedData.period_id && selectedData.classroom_id) {
          getSchedulebyClassroom();
        } else {
          setScheduleListbyClassroom([]);
        }
      }, [selectedData?.classroom_id, selectedData?.period_id]);

      //classroom değiştiğinde o classroomun schedulerda o proiodda timeSlotlarında çakışma var mı kontrol için

      const handleClear = () => {
        setSelectedData({
          classcode_id: null,
          person_limit: 0,
          teacher_id: null,
          period_id: null,
          classroom_id: null,
        });
        setTeacherList((prev) =>
              prev.map((t) => {
                return { ...t, lesson_count: 0 };
              }),
            );
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
                    fieldNames={{ label: "full_name", value: "id" }}
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

                <div className="col-span-6">
                  <Typography.Title level={5}>Teacher List</Typography.Title>
                  <ScrollArea className="h-50 w-full p-2  rounded-md border">
                    <SortableList
                      teacherList={teacherList}
                      person_limit={selectedData?.person_limit}
                    />
                  </ScrollArea>
                </div>
                <div className="col-span-6 lg:col-span-2 content-end   ">
                  <Button
                    size="large"
                    color="blue"
                    variant="filled"
                    icon={<IconCheckFilled />}
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
              <WeeklySchedulePicker
                selected={timeSlotList}
                scheduleListbyClasscode={scheduleListbyClasscode}
                scheduleListbyClassroom={scheduleListbyClassroom}
                viewMode
                //  onChange={handleChangeSlotTable}
                // maxSelections={selectedData.max_limit} // girilen max limiti yazacağız.
              />
            </CardContent>
          </Card>
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