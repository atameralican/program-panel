"use client";
import * as React from "react";
import { useState, useEffect } from "react";

import {
  Typography,
  Table,
  Button,
  Input,
  Select,
  Modal,
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
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useNotify } from "@/components/ui/notify-ant-rev";
import { DeleteDataType } from "@/lib/types";
interface ClassroomDataType {
  id: React.Key | null;
  name?: string;
  floor?: string;
  projection_id?: number | string | null;
}
interface ProjectionDataType {
  id: React.Key;
  brand?: string;
  info?: string;
  serino?: string;
  color?: string;
  active?: boolean;
}
const ClassRoomPage = () => {
  const [projectionList, setProjectionList] = useState<ProjectionDataType[]>(
    [],
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState<DeleteDataType>({
    id: null,
    visible: false,
  });
  const [classroomList, setClassroomList] = useState<ClassroomDataType[]>([]);
  const [classroomPayload, setClassroomPayload] = useState<ClassroomDataType>({
    id: null,
    name: "",
    floor: "",
    projection_id: null,
  });

  const [loadingButton, setLoadingButton] = useState(false);
  const { Column } = Table;
  const notify = useNotify();

  //GET
  const getProjectionList = () => {
    fetch("/api/projection/brands")
      .then((res) => res.json())
      .then((res) => {
        const options = (res || []).map((item: ProjectionDataType) => ({
          ...item,
          label: `${item.brand ?? ""} - ${item.color ?? ""} - ${item.info ?? ""} - ${item.serino ?? ""}`,
        }));

        setProjectionList(options);
      })
      .catch((err) => console.error("Error fetching projection list:", err));
  };

  const getClassroomList = () => {
    fetch("/api/classroom")
      .then((res) => res.json())
      .then((res) => {
        const options = (res || []).map((item: any) => ({
          ...item,
          projection: item.projections?.id
            ? item.projections?.brand +
                " - " +
                item.projections?.color +
                " - " +
                item.projections?.info +
                " - " +
                item.projections?.serino || ""
            : "",
        }));
        setClassroomList(options);
      })
      .catch((err) => console.error("Error fetching projection list:", err));
  };
  useEffect(() => {
    getProjectionList();
    getClassroomList();
  }, []);

  //ADD & UPDATE
  const handleSave = () => {
    if (classroomPayload?.name) {
      fetch("/api/classroom", {
        method: classroomPayload?.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...classroomPayload }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            setLoadingButton(false);
            return notify.error({
              title: "Fail",
              description: res.error,
            });
          } else {
            notify.success({ title: "Success", description: "Saved" });
            handleClear();
            getClassroomList();
            setLoadingButton(false);
          }
        })
        .catch((err) => {
          setLoadingButton(false);
          return notify.error({
            title: "Fail",
            description: err.message ?? err,
          });
        });
    } else {
      setLoadingButton(false);
      return notify.error({
        title: "Fail",
        description: "Name not null",
      });
    }
  };

  //DELETE
  const handleDelete = (id: React.Key | null) => {
    fetch("/api/classroom", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.error) {
          return notify.error({
            title: "Fail",
            description: data.error,
          });
        }

        notify.success({
          title: "Success",
          description: "Deleted",
        });

        getClassroomList();
      })
      .catch((err) => {
        notify.error({
          title: "Fail",
          description: err.message ?? err,
        });
      });
  };
  //CLEAR
  const handleClear = () => {
    setClassroomPayload({
      id: null,
      name: "",
      floor: "",
      projection_id: null,
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
                onSelect={(e) => {
                  setClassroomPayload((prev) => ({
                    ...prev,
                    projection_id: e,
                  }));
                }}
                value={classroomPayload?.projection_id}
                className="w-full"
                fieldNames={{ label: "label", value: "id" }}
                loading={projectionList.length === 0}
                options={projectionList}
              />
            </div>
            <div className="col-span-6 lg:col-span-2 content-end   ">
              <Button
                size="large"
                color="blue"
                loading={loadingButton}
                variant="filled"
                onClick={() => {
                  setLoadingButton(true);
                  handleSave();
                }}
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
              key="actions"
              render={(_, record: ClassroomDataType) => (
                <div className="flex gap-2">
                  <Button
                    size="small"
                    color="default"
                    onClick={() =>
                      setClassroomPayload({
                        id: record.id,
                        name: record?.name,
                        floor: record?.floor,
                        projection_id: record?.projection_id,
                      })
                    }
                    variant="filled"
                    icon={<IconEdit />}
                  ></Button>
                  <Button
                    size="small"
                    color="default"
                    onClick={() =>
                      setDeleteModalVisible({
                        id: record.id ?? null,
                        visible: true,
                      })
                    }
                    variant="text"
                    icon={<IconTrash />}
                  />
                </div>
              )}
            />
          </Table>
        </CardContent>
      </Card>
      {deleteModalVisible.visible && (
        <Modal
          title="Delete Confirmation"
          open={deleteModalVisible.visible}
          okText="Yes"
          onOk={() => {
            handleDelete(deleteModalVisible.id!);
            setDeleteModalVisible({ id: null, visible: false });
          }}
          onCancel={() => setDeleteModalVisible({ id: null, visible: false })}
        >
          <p>Are you sure you want to delete this entry?</p>
          <p style={{ color: "gray", fontSize: "12px" }}>
            This action is permanent and cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default ClassRoomPage;
