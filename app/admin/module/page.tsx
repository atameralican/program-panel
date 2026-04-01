"use client";
import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  Button,
  Switch,
  Select,
  Input,
  InputNumber,
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
import { ProgramProps } from "../program/page";
import { useNotify } from "@/components/ui/notify-ant-rev";

type ModuleProps = {
  id: number | null;
  name: string;
  program_id: number | null;
  code: string;
  programs?: {
    name: string;
  };
};

const ModulePage = () => {
  const { Column } = Table;
  const notify = useNotify();
  const [programList, setProgramList] = useState<ProgramProps[]>();
  const [moduleList, setModuleList] = useState<ModuleProps[]>([]);
  const [selectedData, setSelectedData] = useState<ModuleProps>({
    name: "",
    code: "",
    program_id: null,
    id: null,
  });

  useEffect(() => {
    getProgramList();
    getModuleList();
  }, []);

  ////// CRUD START /////
  //Get
  const getModuleList = () => {
    fetch("/api/module", {})
      .then((res) => res?.json())
      .then((res) => {
        setModuleList(res || []);
      });
  };
  const getProgramList = () => {
    fetch("/api/program", {})
      .then((res) => res?.json())
      .then((res) => {
        setProgramList(res || []);
      });
  };
  //Save
  const handleSave = () => {
    //validasyonlar
    if (selectedData.name.trim() === "") {
      notify.error({
        title: "Fail",
        description: "Modül adı boş bırakılamaz!",
      });
      return;
    }
    if (selectedData.code.trim() === "") {
      notify.error({
        title: "Fail",
        description: "Modül kodu boş bırakılamaz!",
      });
      return;
    }
    if (selectedData.program_id === null) {
      notify.error({
        title: "Fail",
        description: "Program seçilmedi!",
      });
      return;
    }
    //Save Action
    fetch("/api/module", {
      method: selectedData.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...selectedData }),
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
        getModuleList();
        handleClear();
      })
      .catch((err) => {
        return notify.error({
          title: "Fail",
          description: err.message ?? err,
        });
      });
  };

  const handleDelete = (id: number | null) => {
    fetch("/api/module", {
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
        getModuleList();
      })
      .catch((err) => {
        return notify.error({
          title: "Fail",
          description: err.message ?? err,
        });
      });
  };
  ////// CRUD END /////

  ///// Temizle Button Click /////
  const handleClear = () => {
    setSelectedData({ name: "", code: "", program_id: null, id: null });
  };

  ///// Datagrid Edit Button Click /////
  const handleEdit = (record: ModuleProps) => {
    setSelectedData({
      id: record.id,
      name: record.name,
      code: record.code,
      program_id: record.program_id,
    });
  };

  return (
    <div className="flex-row ">
      <Card>
        <CardHeader>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Modul Name</Typography.Title>
              <Input
                className="w-full"
                value={selectedData?.name}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Code</Typography.Title>
              <Input
                className="w-full"
                value={selectedData?.code}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, code: e.target.value }))
                }
              />
            </div>
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Program</Typography.Title>
              <Select
                fieldNames={{ label: "name", value: "id" }}
                className="w-full"
                options={programList}
                value={selectedData?.program_id || undefined}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, program_id: e }))
                }
              />
            </div>
            <div className="col-span-6 lg:col-span-3 content-end ">
              <Button
                size="large"
                color="blue"
                variant="filled"
                onClick={handleSave}
                icon={<IconCheckFilled />}
              ></Button>
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
          <Table<ModuleProps> rowKey="id" dataSource={moduleList}>
            <Column title="Module Name" dataIndex="name" key="name" />
            <Column title="Module Code" dataIndex="code" key="code" />
            <Column
              title="Program"
              key="program_name"
              dataIndex={["programs", "name"]}
            />
            <Column
              title="Actions"
              key="actions"
              render={(
                _,
                record: ModuleProps, // record burada satırın tam objesidir
              ) => (
                <div className="flex gap-2">
                  <Button
                    size="small"
                    color="default"
                    variant="filled"
                    icon={<IconEdit />}
                    onClick={() => handleEdit(record)} // Düzenle'ye basınca formu doldurur
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

export default ModulePage;

/**
 * ekleme silme güncellemeden önce soru sorulacak
 *
 */
