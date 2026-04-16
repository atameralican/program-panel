"use client";
import React, { useEffect, useState } from "react";
import { Typography, Select, Segmented, message, Spin } from "antd";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import WeeklySchedulePicker from "@/components/WeeklySchedulePicker";
import { ScheduleDataType } from "../instructor/types";

interface DataType {
  term_id: number;
  period_id: number | null;
}
interface PayloadListType {
  classroomList: ListType[];
  teacherList: ListType[];
  classcodeList: ListType[];
}
export interface ListType {
  id: number;
  name: string;
}
const ScheduleViewPage = () => {
  const [viewType, setViewType] = useState<string>("Classroom");
  const [termList, setTermList] = useState([]);
  const [previewSchedule, setPreviewSchedule] = useState<ScheduleDataType[]>(
    [],
  );
  const [periodList, setPeriodList] = useState([]);
  const [payloadList, setPayloadList] = useState<PayloadListType>({
    classroomList: [],
    teacherList: [],
    classcodeList: [],
  });
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState<DataType>({
    term_id: 1,
    period_id: null,
  });
  // ===== TERMLIST VE PERIODLIST GET ========
  //termlist get ekran ilk açıldığında
  const getTermList = async () => {
    await fetch("/api/term", {})
      .then((res) => res?.json())
      .then((res) => {
        setTermList(res || []);
      });
  };

  useEffect(() => {
    getTermList();
  }, []);

  //periodList get termlist değiştiğinde
  const getPeriodList = async () => {
    await fetch(`/api/period/${selectedData?.term_id}`, {})
      .then((res) => res?.json())
      .then((res) => {
        setPeriodList(res || []);
      });
  };

  useEffect(() => {
    if (selectedData?.term_id) {
      getPeriodList();
    }
  }, [selectedData?.term_id]);

  // ======== VIEW TIPINE GÖRE SELECTBOX İÇİN GET LISTS  START ========
  //viewType seçildiğinde selectbox için payloadlar dolu değilse servise gidip classroom,code ve teacher listesini çekiyoruz. ve seçili ıd ve seçili previewi boşaltıyoruz.
  useEffect(() => {
    if (selectedData?.period_id) {
      setSelectedId(null);
      setPreviewSchedule([]);
      if (viewType === "Classroom" && payloadList.classroomList?.length < 1) {
        getClassroomList();
      }
      if (viewType === "Teacher" && payloadList.teacherList?.length < 1) {
        getTeacherList();
      }
      if (viewType === "Classcode" && payloadList.classcodeList?.length < 1) {
        getClasscodeList();
      }
    }
  }, [selectedData?.period_id, viewType]);

  const getClassroomList = async () => {
    await fetch("/api/classroom/classroom-name", {})
      .then((res) => res?.json())
      .then((res) => {
        setPayloadList((prev) => ({ ...prev, classroomList: res || [] }));
      });
  };
  const getTeacherList = async () => {
    await fetch("/api/teacher/teacher-name", {})
      .then((res) => res?.json())
      .then((res) => {
        setPayloadList((prev) => ({ ...prev, teacherList: res || [] }));
      });
  };
  const getClasscodeList = async () => {
    await fetch("/api/classcode/classcode-name", {})
      .then((res) => res?.json())
      .then((res) => {
        setPayloadList((prev) => ({ ...prev, classcodeList: res || [] }));
      });
  };
  // ======== VIEW TIPINE GÖRE SELECTBOX İÇİN GET LISTS  END ========

  // ======== SELECTBOXDAN SEÇİM YAPILINCA  UYGUN SLOTLAR GETİRİLİYOR START ========
  //eğer selectboxdan birisi seçildiyse servisten preview verilerini getir.
  useEffect(() => {
    if (selectedId && selectedData.period_id && selectedData.term_id) {
      setLoading(true);
      getScheduleforSelectType();
    }
  }, [selectedId]);


 // ======== GET SCHEDULE START ========
  const getScheduleforSelectType = async () => {
    try {
      const response = await fetch(
        `/api/schedule/${viewType === "Classroom" ? "byClassroom" : viewType === "Teacher" ? "byTeacher" : viewType === "Classcode" ? "byClasscode" : ""}/${selectedId}/${selectedData?.period_id}`,
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Sunucu hatası");
      }
      if (viewType === "Classroom") {
        const formattedData = data.map((item: ScheduleDataType) => {
          const { classcodes, ...rest } = item;
          return {
            ...rest,
            classrooms: classcodes, // classcodes ismini classrooms olarak değiştir
          };
        });
        setPreviewSchedule(formattedData);
      } else if (viewType === "Teacher") {
        const formattedData = data.map((item: ScheduleDataType) => {
          const { classcodes, ...rest } = item;
          return {
            ...rest,
            teachers: classcodes, // classcodes ismini teachers olarak değiştir
          };
        });
        setPreviewSchedule(formattedData);
      } else {
        setPreviewSchedule(data); //viewType Classcode ise normal gelen zaten classroom ile öğretmen ismi
      }
    } catch (err: any) {
      message.error(`Kayıt başarısız: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  // ======== SELECTBOXDAN SEÇİM YAPILINCA  UYGUN SLOTLAR GETİRİLİYOR END ========

  return (
    <div className="flex-row ">
      <Card>
        <CardHeader>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 lg:col-span-4">
              <Typography.Title level={5}>Term</Typography.Title>
              <Select
                fieldNames={{ label: "name", value: "id" }}
                className="w-full"
                options={termList}
                value={selectedData?.term_id}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, term_id: e }))
                }
              />
            </div>
            <div className="col-span-6 lg:col-span-4">
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
          </div>
        </CardHeader>

        <hr />
        <CardContent>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4 ">
              <Typography.Title level={5}>View Type</Typography.Title>
              <Segmented<string>
                options={["Classroom", "Teacher", "Classcode"]}
                value={viewType}
                onChange={setViewType}
                block
              />
            </div>
            <div className="col-span-12 lg:col-span-4 ">
              <Typography.Title level={5}>{viewType}</Typography.Title>
              <Select
                fieldNames={{ label: "name", value: "id" }}
                className="w-full"
                options={
                  viewType === "Classroom"
                    ? payloadList?.classroomList
                    : viewType === "Teacher"
                      ? payloadList?.teacherList
                      : viewType === "Classcode"
                        ? payloadList?.classcodeList
                        : []
                }
                value={selectedId}
                onChange={(e) => setSelectedId(e)}
              />
            </div>
            <div className="col-span-12">
              <Spin spinning={loading} >
                <WeeklySchedulePicker
                  viewMode
                  previewSlotList={previewSchedule}
                />
              </Spin>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleViewPage;
