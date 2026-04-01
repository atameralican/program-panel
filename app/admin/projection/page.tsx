"use client";
import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  Button,
  Switch,
  Input,
  Select,
  Modal,
} from "antd";
import {
  IconXFilled,
  IconCheckFilled,
  IconPencilCheck,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useNotify } from "@/components/ui/notify-ant-rev";
import { DeleteDataType } from "@/lib/types";

interface ProjectionDataType {
  id: React.Key | null;
  brand?: string;
  serino?: string;
  info?:string;
  color?: string;
  active?: boolean;
}


const ProjectionPage = () => {
  const { Column } = Table;
  const notify = useNotify();
  const [loadingButton, setLoadingButton] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<DeleteDataType>({
    id: null,
    visible: false,
  });
  const [projectionList, setProjectionList] = useState<ProjectionDataType[]>(
    [],
  );
  const [selectedData, setSelectedData] = useState<ProjectionDataType>({
    brand: "",
    active: true,
    id: null,
    serino: "",
    info: "",
    color: "",
  });
  const getProjectionList = () => {
    fetch("/api/projection", {})
      .then((res) => res.json())
      .then((res) => {
        setProjectionList(res || []);
      })
      .catch((err) =>
        notify.error({
          title: "Fail",
          description: `Error fetching game list: ${err}`,
        }),
      );
  };
  useEffect(() => {
    getProjectionList();
  }, []);

  const handleClear = () => {
    setSelectedData({
      brand: "",
      id: null,
      serino: "",
      info: "",
      color: "",
      active: true,
    });
  };

  const handleSave = () => {
    if (selectedData.brand) {
      fetch("/api/projection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...selectedData }),
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
            getProjectionList();
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
        description: "Brand not null",
      });
    }
  };

  const handleUpdate = () => {
    if (selectedData.brand) {
      fetch("/api/projection", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...selectedData }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoadingButton(false);
          if (data?.error) {
            return notify.error({
              title: "Fail",
              description: data.error,
            });
          }
          notify.success({ title: "Success", description: "Updated" });
          handleClear();
          getProjectionList();
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
        description: "Brand not null",
      });
    }
  };

  const changeActive = ({ element }: { element: ProjectionDataType }) => {
    fetch("/api/projection", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...element, active: !element.active }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.error) {
          return notify.error({
            title: "Fail",
            description: data.error,
          });
        }
        notify.success({ title: "Success", description: "Changed Active" });

        getProjectionList();
      })
      .catch((err) => {
        notify.error({
          title: "Fail",
          description: err.message ?? err,
        });
      });
  };
  const handleDelete = (id: React.Key | null) => {
    fetch("/api/projection", {
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

        getProjectionList();
      })
      .catch((err) => {
        notify.error({
          title: "Fail",
          description: err.message ?? err,
        });
      });
  };

  return (
    <div className="flex-row ">
      <Card>
        <CardHeader>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Brand</Typography.Title>
              <Input
                className="w-full"
                value={selectedData?.brand}
                onChange={(e) => {
                  setSelectedData((prev) => ({
                    ...prev,
                    brand: e?.target?.value,
                  }));
                }}
              />
            </div>
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Info</Typography.Title>
              <Input
                className="w-full"
                value={selectedData?.info}
                onChange={(e) => {
                  setSelectedData((prev) => ({
                    ...prev,
                    info: e?.target?.value,
                  }));
                }}
              />
            </div>
            <div className="col-span-4 lg:col-span-2">
              <Typography.Title level={5}>Serial No</Typography.Title>
              <Input
                className="w-full"
                value={selectedData?.serino}
                onChange={(e) => {
                  setSelectedData((prev) => ({
                    ...prev,
                    serino: e?.target?.value,
                  }));
                }}
              />
            </div>
            <div className="col-span-4 lg:col-span-2">
              <Typography.Title level={5}>Color</Typography.Title>
              <Select
                className="w-full"
                placeholder="Select color"
                value={selectedData?.color}
                onSelect={(e) => {
                  setSelectedData((prev) => ({
                    ...prev,
                    color: e,
                  }));
                }}
                options={[
                  { label: "Black", value: "black" },
                  { label: "White", value: "white" },
                  { label: "Gray", value: "gray" },
                ]}
              />
            </div>
            <div className="col-span-4 lg:col-span-2 content-end ">
              <Button
                size="large"
                color="blue"
                loading={loadingButton}
                variant="filled"
                onClick={() => {
                  setLoadingButton(true);
                  if (selectedData.id) {
                    handleUpdate();
                  } else {
                    handleSave();
                  }
                }}
                icon={
                  selectedData.id ? <IconPencilCheck /> : <IconCheckFilled />
                }
              />
              <Button
                size="large"
                danger
                className="ms-2"
                color="danger"
                variant="filled"
                onClick={handleClear}
                icon={<IconXFilled />}
              ></Button>
            </div>
          </div>
        </CardHeader>

        <hr />
        <CardContent>
          <Table<ProjectionDataType> rowKey="id" dataSource={projectionList}>
            <Column title="Brand" dataIndex="brand" key="brand" />
            <Column title="Serial No" dataIndex="serino" key="serino" />
            <Column title="Color" dataIndex="color" key="color" />
            <Column title="Info" dataIndex="info" key="info" />
            <Column
              title="Actions"
              key="actions"
              render={(_, record: ProjectionDataType) => (
                <div className="flex gap-2">
                 
                  <Button
                    size="small"
                    color="default"
                    onClick={() =>
                      setSelectedData({
                        brand: record.brand,
                        id: record.id,
                        info:record.info,
                        active: record.active,
                        serino: record?.serino ?? "",
                        color: record?.color ?? "",
                      })
                    }
                    variant="filled"
                    icon={<IconEdit />}
                  ></Button>
                  <Button
                    size="small"
                    color="default"
                    onClick={() =>
                      setDeleteModalVisible({ id: record.id, visible: true })
                    }
                    variant="text"
                    icon={<IconTrash />}
                  ></Button>
                    <Switch
                  checked={record?.active}
                  onChange={() => {
                    changeActive({ element: record });
                  }}
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

export default ProjectionPage;
