"use client";
import * as React from "react";
import { useState, useEffect } from "react";

import {
  Typography,
  Table,
  Button,
  Switch,
  Input,
  InputNumber,
  Select,
} from "antd";
import {
  IconXFilled,
  IconCheckFilled,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import {
  Card,
  CardAction,
  CardContent,
  //CardDescription,
  //CardContent,
  CardFooter,
  CardHeader,
  //CardTitle,
} from "@/components/ui/card";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface ClassroomDataType {
  id?: React.Key|null;
  name?: string;
  floor?: string;
  projection?: string;
  projection_id?: number|string|null;
  projections?: ProjectionDataType;
}
interface ProjectionDataType {
  id: React.Key;
  brand?: string;
  serino?: string;
  color?: string;
  active?: boolean;
}
const ClassRoomPage = () => {
  const [projectionList, setProjectionList] = useState<ProjectionDataType[]>(
    [],
  );
  const [classroomList, setClassroomList] = useState<ClassroomDataType[]>([]);
const [classroomPayload, setClassroomPayload] = useState<ClassroomDataType | null>({id:null,name:"",floor:"",projection_id:null});
  
  const { Column } = Table;

  // const data: ClassroomDataType[] = [
  //   {
  //     id: '1',
  //     name:"A06",
  //     floor:"0",
  //     projection:"Brand1 - White",
  //     projectionId:"b1w"
  //   },
  //   {
  //     id: '2',
  //     name:"C203",
  //     floor:"2",
  //     projection:"Brand2 - Black",
  //     projectionId:"b2b"
  //   },
  //   {
  //     id: '3',
  //     name:"B105",
  //     floor:"1",
  //     projection:"Brand3 - Black",
  //     projectionId:"b3b"
  //   },
  // ];
  const getProjectionList = () => {
    fetch("/api/projection/brands")
      .then((res) => res.json())
      .then((res) => {
        const options = (res || []).map((item: any) => ({
          label: `${item.brand ?? ""} - ${item.color ?? ""} - ${item.serino ?? ""}`,
          id: item.id,
          brand: item.brand,
          color: item.color,
          projections: item.projections,
        }));

        setProjectionList(options);
      })
      .catch((err) => console.error("Error fetching projection list:", err));
  };
  const getClassroomList = () => {
    fetch("/api/classroom")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        const options = (res || []).map((item: any) => ({
          name: item.name,
          floor: item.floor,
          projection:
            item.projections?.brand +
              " - " +
              item.projections?.color +
              " - " +
              item.projections?.serino || "",
        }));

        setClassroomList(options);
      })
      .catch((err) => console.error("Error fetching projection list:", err));
  };
  useEffect(() => {
    getProjectionList();
    getClassroomList();
  }, []);
  return (
    <div className="flex-row ">
      <Card>
        <CardHeader className="">
          <div className="grid  grid-cols-12 gap-4">
            <div className="col-span-6 lg:col-span-3 ">
              <Typography.Title level={5}>Classroom Name</Typography.Title>
              <Input
                className="w-100"
                value={classroomPayload?.name}
                onChange={(e) => {
                  setClassroomPayload((prev) => ({
                    ...prev,
                    name: e?.target?.value,
                  }));
                }}
              />
            </div>
            <div className="col-span-6 lg:col-span-3 ">
              <Typography.Title level={5}>Floor</Typography.Title>
              <Input
                className="w-100"
                value={classroomPayload?.floor}
                onChange={(e) => {
                  setClassroomPayload((prev) => ({
                    ...prev,
                    floor: e?.target?.value,
                  }));
                }}
              />
            </div>
            <div className="col-span-6 lg:col-span-4 ">
              <Typography.Title level={5}>Projection</Typography.Title>

              <Select
                // defaultValue="lucy"
                onSelect={(e) => {
                  setClassroomPayload((prev) => ({
                    ...prev,
                    projectionId: e,
                  }));
                }}
                value={classroomPayload?.projection_id}
                className="w-full"
                // onSelect={(e) => console.log(e)}
                // onChange={()=>}
                fieldNames={{ label: "label", value: "id" }}
                loading={projectionList.length === 0}
                options={projectionList}
              />
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
          <Table<ClassroomDataType> dataSource={classroomList} rowKey="id">
            <Column title="Name" dataIndex="name" key="name" />
            <Column title="Floor" dataIndex="floor" key="floor" />
            <Column
              title="Projection"
              dataIndex="projection"
              key="projection"
            />
            <Column
              title="Actions"
              dataIndex="wednesday"
              key="wednesday"
              render={() => (
                <div className="flex gap-2">
                  <Button
                    size="small"
                    color="default"
                    variant="filled"
                    icon={<IconEdit />}
                  ></Button>
                  <Button
                    size="small"
                    color="default"
                    variant="text"
                    icon={<IconTrash />}
                  ></Button>
                </div>
              )}
            />
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassRoomPage;
