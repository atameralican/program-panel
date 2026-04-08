

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

interface ProgramTimeSlot {
  time_slot_id: number;
  program_id: number;
  time_slots: {
    id: number;
    day: string;
    name: string;
    end_time: string;
    start_time: string;
  }
}

interface SelectedDataType {
  classcode_id: number | null;
  person_limit: number;
  // Diğer alanlar burada tanımlanabilir  
}
  const InstructorPage = () => {
    const [periodList, setPeriodList] = useState();
    const [termList, setTermList] = useState([]);
const [classcodeList, setClasscodeList] = useState<GenericDataType[]>([]);
const [classroomList, setClassroomList] = useState<GenericDataType[]>([]);
const [teacherList, setTeacherList] = useState([]);
const [timeSlotList, setTimeSlotList] = useState<number[]>([]);
const [selectedData, setSelectedData] = useState({classcode_id:null, person_limit: 0});
useEffect(() => {
getResponseList();
}, []);

const getResponseList=async()=>{
await fetch("/api/period", {})
      .then((res) => res?.json())
      .then((res) => {
        setPeriodList(res || []);
      });
      await fetch("/api/classcode/name", {})
      .then((res) => res?.json())
      .then((res) => {
        setClasscodeList(res || []);
      });
await fetch("/api/classroom/name", {})
      .then((res) => res?.json())
      .then((res) => {
        setClassroomList(res || []);
      });
await fetch("/api/teacher/name", {})
      .then((res) => res?.json())
      .then((res) => {
        setTeacherList(res || []);
      });
}
const getTimeSlotbyClasscode = async (programId: number) => {
  try {
    const response = await fetch(`/api/program-time-slot/${programId}`);
    const data: ProgramTimeSlot[] = await response.json(); // Tipi burada belirttik
    
    const timeSlotIds = data.map(item => item?.time_slot_id);
    setTimeSlotList(timeSlotIds);
  } catch (error) {
    console.error("Veri çekilirken hata oluştu:", error);
  }
};
useEffect(() => {

  if (selectedData?.classcode_id) {
    const selectClasscode= classcodeList.find((c) => c.id === selectedData?.classcode_id)
    if (selectClasscode) {
    const programId=selectClasscode?.modules?.program_id
    console.log("programId",programId);
    getTimeSlotbyClasscode(programId);
  }
  }
  console.log("classcode_id",selectedData?.classcode_id);
  
}, [selectedData?.classcode_id]);

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
                              />
              </div>
   <div className="col-span-6 lg:col-span-3">
                <Typography.Title level={5}>ClassCode</Typography.Title>
                  <Select
                                fieldNames={{ label: "full_name", value: "id" }}
                                className="w-full"
                                options={classcodeList}
                                value={selectedData?.classcode_id }
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
                              />
              </div>

    <div className="col-span-6 lg:col-span-3">
                <Typography.Title level={5}>One Person Max Limit</Typography.Title>
                <InputNumber
                                className="w-full"
                                min={0}
                                max={40}
                                value={selectedData?.person_limit}
                                onChange={(e) =>
                                  setSelectedData((prev) => ({
                                    ...prev,
                                    person_limit: e ||0,
                                  }))
                                }
                              />
              </div>
              {/*
   <div className="col-span-6 lg:col-span-3">
                <Typography.Title level={5}>TotalLimit ?</Typography.Title>
                 <Input
                  className="w-full"
                />
              </div> */}

             

              <div className="col-span-6">
                <Typography.Title level={5}>Teacher List</Typography.Title>
                <ScrollArea className="h-50 w-full p-2  rounded-md border">
                  <SortableList teacherList={teacherList} person_limit={selectedData?.person_limit} />
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
                  color="danger"
                  variant="filled"
                  icon={<IconXFilled />}
                ></Button>
              </div>
            </div>
          </CardHeader>

          <hr />
          <CardContent>
            seçime göre tablo burada olacak
            {/* <Table
        columns={columns}
        dataSource={dummy}
        pagination={false}
        bordered
        rowKey="time"
      /> */}
      <WeeklySchedulePicker
                  selected={timeSlotList}
                  viewMode
                //  onChange={handleChangeSlotTable}
                 // maxSelections={selectedData.max_limit} // girilen max limiti yazacağız.
                />
          </CardContent>
        </Card>
      </div>
    );
  }

  export default InstructorPage;