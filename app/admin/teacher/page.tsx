"use client";
import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  Button,
  Input,
  InputNumber,
  Select,
} from "antd";
import {
  IconXFilled,
  IconCheckFilled,
  IconEdit,
  IconTrash,
  IconPencilCheck,
} from "@tabler/icons-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useNotify } from "@/components/ui/notify-ant-rev";
interface TeacherDataType {
  id: number | null;
  name: string;
  room?: string;
  phone_number?: string;
  room_tel?: string;
  classcode_id?: number | null;
  section_limit: number;
  max_limit: number;
  stable?: number | null;
}
type ClassCodeNameType = {
  id: number;
  full_name: string;
};
const TeacherPage = () => {
  const [teacherList, setTeacherList] = useState<TeacherDataType[]>([]);
  const [classCodeList, setClassCodeList] = useState<ClassCodeNameType[]>([]);
  const [teacherPayload, setTeacherPayload] = useState<TeacherDataType>({
    id: null,
    name: "",
    room: "",
    phone_number: "",
    room_tel: "",
    classcode_id: null,
    section_limit: 1,
    max_limit: 1,
    stable: null,
  });
  const { Column } = Table;
  const notify = useNotify();

  useEffect(() => {
    getTeacherList();
    getClassCodeList();
  }, []);

//düzenlemeler
  const stableOptions = teacherList
    ?.filter((t) => t.id !== teacherPayload.id)
    ?.map((t) => ({ label: t.name, value: t.id }));

  const classCodeMap = React.useMemo(() => {
    return new Map(classCodeList.map((c) => [c.id, c.full_name]));
  }, [classCodeList]);

  const teacherMap = React.useMemo(() => {
    return new Map(teacherList.map((t) => [t.id, t.name]));
  }, [teacherList]);

  //CLEAR
  const handleClear = () => {
    setTeacherPayload({
      id: null,
      name: "",
      room: "",
      phone_number: "",
      room_tel: "",
      classcode_id: null,
      section_limit: 1,
      max_limit: 1,
      stable: null,
    });
  };

  ///////// CRUD İŞLEMLERİ ////////
  //GET
  const getTeacherList = () => {
    fetch("/api/teacher", {})
      .then((res) => res?.json())
      .then((res) => {
        setTeacherList(res || []);
      });
  };
  const getClassCodeList = () => {
    fetch("/api/classcode/name", {})
      .then((res) => res?.json())
      .then((res) => {
        setClassCodeList(res || []);
      });
  };
  //ADD & UPDATE
  const handleSave = () => {
    //validasyonlar
    if (teacherPayload.name.trim() === "") {
      notify.error({
        title: "Fail",
        description: "Teacher Name cannot be empty!",
      });
      return;
    }
    if (!teacherPayload.section_limit || teacherPayload.section_limit < 1) {
      notify.error({
        title: "Fail",
        description: "Section limit cannot be zero!",
      });
      return;
    }
    if (!teacherPayload.max_limit || teacherPayload.max_limit < 1) {
      notify.error({
        title: "Fail",
        description: "Max limit cannot be zero!",
      });
      return;
    }

    //Save Action
    fetch("/api/teacher", {
      method: teacherPayload.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...teacherPayload }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return notify.error({
            title: "Fail",
            description: res.error,
          });
        }
        notify.success({
          title: "Success",
          description: res.message || "Saved!",
        });
        getTeacherList();
        handleClear();
      })
      .catch((err) => {
        return notify.error({
          title: "Fail",
          description: err.message ?? err,
        });
      });
  };
  //DELETE
  const handleDelete = (id: number | null) => {
    fetch("/api/teacher", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return notify.error({
            title: "Fail",
            description: res.error,
          });
        }
        notify.success({
          title: "Success",
          description: res.message || "Deleted!",
        });
        getTeacherList();
      })
      .catch((err) => {
        return notify.error({
          title: "Fail",
          description: err.message ?? err,
        });
      });
  };

  return (
    <div className="flex-row ">
      <Card>
        <CardHeader>
          <div className="grid grid-cols-12  gap-5">
            <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 ">
              <Typography.Title level={5}>Name</Typography.Title>
              <Input
                className="w-full"
                value={teacherPayload?.name}
                onChange={(e) => {
                  setTeacherPayload((prev) => ({
                    ...prev,
                    name: e?.target?.value,
                  }));
                }}
              />
            </div>

            <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2">
              <Typography.Title level={5}>Room</Typography.Title>
              <Input
                className="w-full"
                value={teacherPayload?.room}
                onChange={(e) => {
                  setTeacherPayload((prev) => ({
                    ...prev,
                    room: e?.target?.value,
                  }));
                }}
              />
            </div>

            <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2">
              <Typography.Title level={5}>Phone Number</Typography.Title>
              <Input
                className="w-full"
                value={teacherPayload?.phone_number}
                onChange={(e) => {
                  setTeacherPayload((prev) => ({
                    ...prev,
                    phone_number: e?.target?.value,
                  }));
                }}
              />
            </div>

            <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2">
              <Typography.Title level={5}>Room Tel</Typography.Title>
              <Input
                className="w-full"
                value={teacherPayload?.room_tel}
                onChange={(e) => {
                  setTeacherPayload((prev) => ({
                    ...prev,
                    room_tel: e?.target?.value,
                  }));
                }}
              />
            </div>

            <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
              <Typography.Title level={5}>
                Selectionnable ClassCode
              </Typography.Title>
              <Select
                fieldNames={{ label: "full_name", value: "id" }}
                className="w-full"
                options={classCodeList}
                value={teacherPayload?.classcode_id || undefined}
                onChange={(e) =>
                  setTeacherPayload((prev) => ({ ...prev, classcode_id: e }))
                }
              />
            </div>

            <div className="col-span-6 md:col-span-3 lg:col-span-2 xl:col-span-2">
              <Typography.Title level={5}>Section Limit</Typography.Title>
              <InputNumber
                className="w-full"
                min={1}
                max={40}
                value={teacherPayload?.section_limit}
                onChange={(e) =>
                  setTeacherPayload((prev) => ({
                    ...prev,
                    section_limit: e || 23,
                  }))
                }
              />
            </div>

            <div className="col-span-6 md:col-span-3 lg:col-span-2 xl:col-span-2">
              <Typography.Title level={5}>Max Limit</Typography.Title>
              <InputNumber
                className="w-full"
                min={1}
                max={40}
                value={teacherPayload?.max_limit}
                onChange={(e) =>
                  setTeacherPayload((prev) => ({ ...prev, max_limit: e || 23 }))
                }
              />
            </div>

            <div className="col-span-12 md:col-span-6 lg:col-span-4 cl:col-span-3">
              <Typography.Title level={5}>Stable</Typography.Title>
              <Select
                className="w-full"
                options={stableOptions}
                value={teacherPayload?.stable || undefined}
                onChange={(e) =>
                  setTeacherPayload((prev) => ({ ...prev, stable: e }))
                }
              />
            </div>

            <div className="col-span-12 md:col-span-3 content-end lg:col-span-4 xl:col-span-2">
              <CardAction className="flex gap-1.5">
                <Button
                  size="large"
                  color="blue"
                  variant="filled"
                  onClick={handleSave}
                  icon={
                    teacherPayload?.id ? (
                      <IconPencilCheck />
                    ) : (
                      <IconCheckFilled />
                    )
                  }
                />
                <Button
                  size="large"
                  danger
                  className="ms-2"
                  color="danger"
                  onClick={() => handleClear()}
                  variant="filled"
                  icon={<IconXFilled />}
                ></Button>
              </CardAction>
            </div>
          </div>
        </CardHeader>

        <hr />
        <CardContent>
          <Table<TeacherDataType> dataSource={teacherList} rowKey="id">
            <Column title="Name" dataIndex="name" key="name" />
            <Column title="Room" dataIndex="room" key="room" />
            <Column
              title="Phone Number"
              dataIndex="phone_number"
              key="phone_number"
            />
            <Column title="Room Tel" dataIndex="room_tel" key="room_tel" />
            <Column
              title="Selectionnable Section"
              dataIndex="classcode_id"
              render={(id) => classCodeMap.get(id) ?? id}
            />
            <Column
              title="Section Limit"
              dataIndex="section_limit"
              key="section_limit"
            />
            <Column title="Max Limit" dataIndex="max_limit" key="max_limit" />
            <Column
              title="Stable"
              dataIndex="stable"
              render={(id) => teacherMap.get(id) ?? id}
            />
            <Column
              title="Actions"
              key="actions"
              render={(_, record: TeacherDataType) => (
                <div className="flex gap-2">
                  <Button
                    size="small"
                    color="default"
                    variant="filled"
                    icon={<IconEdit />}
                    onClick={() => {
                      setTeacherPayload({
                        id: record.id,
                        name: record?.name,
                        room: record?.room,
                        phone_number: record?.phone_number,
                        room_tel: record?.room_tel,
                        classcode_id: record?.classcode_id,
                        section_limit: record?.section_limit || 1,
                        max_limit: record?.max_limit || 1,
                        stable: record?.stable,
                      });
                    }}
                  />
                  <Button
                    size="small"
                    color="default"
                    variant="text"
                    icon={<IconTrash />}
                    onClick={() => handleDelete(record.id)}
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

export default TeacherPage;
