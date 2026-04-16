"use client";
import * as React from "react";
import { useState, useEffect } from "react";

import { Typography, Table, Button, Input, Select, Modal, message } from "antd";
import {
  IconXFilled,
  IconCheckFilled,
  IconEdit,
  IconTrash,
  IconPencilCheck,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
interface ClassroomDataType {
  id: number | null;
  name: string;
  projection?: string;
  info?: string;
}

const ClassRoomPage = () => {
  const [classRoomList, setClassRoomList] = useState<ClassroomDataType[]>([]);
  const [classroomPayload, setClassroomPayload] = useState<ClassroomDataType>({
    id: null,
    name: "",
    projection: "",
    info: "",
  });
  const { Column } = Table;

  useEffect(() => {
    getClassroomList();
  }, []);

  //CLEAR
  const handleClear = () => {
    setClassroomPayload({
      id: null,
      name: "",
      projection: "",
      info: "",
    });
  };

  ///////// CRUD İŞLEMLERİ ////////
  //GET
  const getClassroomList = () => {
    fetch("/api/classroom", {})
      .then((res) => res?.json())
      .then((res) => {
        setClassRoomList(res || []);
      });
  };
  //ADD & UPDATE
  const handleSave = () => {
    //validasyonlar
    if (classroomPayload.name.trim() === "") {
      message.error("Classroom Adı Boş Olamaz!",
   );
      return;
    }

    //Save Action
    fetch("/api/classroom", {
      method: classroomPayload.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...classroomPayload }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return message.error(res.error,
          );
        }
        message.success(res.message || "Saved!",
        );
        getClassroomList();
        handleClear();
      })
      .catch((err) => {
        return message.error(err.message ?? err,
        );
      });
  };
  //DELETE
  const handleDelete = (id: number | null) => {
    fetch("/api/classroom", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return message.error( res.error,
          );
        }
        message.success( res.message || "Deleted!",
        );
        getClassroomList();
      })
      .catch((err) => {
        return message.error(err.message ?? err,
        );
      });
  };
  return (
    <div className="flex-row ">
      <Card>
        <CardHeader className="">
          <div className="grid  grid-cols-12 gap-4">
            <div className="col-span-6 lg:col-span-3 ">
              <Typography.Title level={5}>Classroom Name</Typography.Title>
              <Input
                className="w-full"
                value={classroomPayload?.name}
                onChange={(e) => {
                  setClassroomPayload((prev) => ({
                    ...prev,
                    name: e?.target?.value,
                  }));
                }}
              />
            </div>
            
            <div className="col-span-6 lg:col-span-4 ">
              <Typography.Title level={5}>Projection</Typography.Title>
              <Input
                className="w-full"
                value={classroomPayload?.projection}
                onChange={(e) => {
                  setClassroomPayload((prev) => ({
                    ...prev,
                    projection: e?.target?.value,
                  }));
                }}
              />
            </div>
            <div className="col-span-6 lg:col-span-4 ">
              <Typography.Title level={5}>Info</Typography.Title>
              <Input
                className="w-full"
                value={classroomPayload?.info}
                onChange={(e) => {
                  setClassroomPayload((prev) => ({
                    ...prev,
                    info: e?.target?.value,
                  }));
                }}
              />
            </div>
            <div className="col-span-6 lg:col-span-2 content-end   ">
              <Button
                size="large"
                color="blue"
                variant="filled"
                onClick={handleSave}
                icon={
                  classroomPayload?.id ? (
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
            </div>
          </div>
        </CardHeader>

        <hr />
        <CardContent>
          <Table<ClassroomDataType> dataSource={classRoomList} rowKey="id">
            <Column title="Name" dataIndex="name" key="name" />
            <Column
              title="Projection"
              dataIndex="projection"
              key="projection"
            />
            <Column title="Info" dataIndex="info" key="info" />
            <Column
              title="Actions"
              key="actions"
              render={(_, record: ClassroomDataType) => (
                <div className="flex gap-2">
                  <Button
                    size="small"
                    color="default"
                    variant="filled"
                    icon={<IconEdit />}
                    onClick={() =>
                      setClassroomPayload({
                        id: record.id,
                        name: record?.name,
                        projection: record?.projection,
                        info: record?.info,
                      })
                    }
                  ></Button>
                  <Button
                    size="small"
                    color="default"
                    variant="text"
                    icon={<IconTrash />}
                    onClick={() => handleDelete(record.id)} // Silme işlemi için gerekirse
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
