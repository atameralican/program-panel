"use client";
import React, { useEffect, useState } from "react";
import { Typography, Table, Button, Select, Input, InputNumber, message } from "antd";
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
  //CardDescription,
  //CardContent,
  CardFooter,
  CardHeader,
  //CardTitle,
} from "@/components/ui/card";
type ClasscodeType = {
  id: number | null;
  name?: string ;
  code: string ;
  module_id: number | null;
};


type ModuleType={
  id: number | null;
  name: string;
  program_id: number | null;
  code: string;
}


const ClassCodePage = () => {
  const { Column } = Table;
  const [classcodePayload, setClasscodePayload] = useState<ClasscodeType>({
    id: null,
    name: "",
    code: "",
    module_id: null,
  });
  const [classCodeList, setClassCodeList] = useState<ClasscodeType[]>([]);
  const [moduleList, setModuleList] = useState<ModuleType[]>([]);
  useEffect(() => {
    getClasscodeList();
    getModulesandClassrooms();
  }, []);

  const handleClear = () => {
    setClasscodePayload({ id: null, name: "", code: "", module_id: null });
  };

  const moduleMap = React.useMemo(() => {
    return new Map(moduleList.map((m) => [m.id, m.code]));
  }, [moduleList]);

  ///////// CRUD İŞLEMLERİ ////////
  //GET
  const getClasscodeList = () => {
    fetch("/api/classcode", {})
      .then((res) => res?.json())
      .then((res) => {
        setClassCodeList(res || []);
      });
  };
  const getModulesandClassrooms = async () => {
    await fetch("/api/module", {})
      .then((res) => res?.json())
      .then((res) => {
        setModuleList(res || []);
      });
  };

  //SAVE AND UPDATE
  const handleSave = async () => {
    if (classcodePayload.code.trim() === "") {
      message.error("The class code cannot be empty!");
      return;
    }

    if (classcodePayload.module_id === null) {
      message.error("The module cannot be empty!");
      return;
    }
    const name =
      (await moduleList?.find((m) => m.id === classcodePayload.module_id)
        ?.code) +
      "-" +
      classcodePayload.code;

    //Save Action
    await fetch("/api/classcode", {
      method: classcodePayload.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...classcodePayload, name: name }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return message.error(res.error);
        }
        message.success( res.message || "Saved!");
        getClasscodeList();
        handleClear();
      })
      .catch((err) => {
        return message.error( err.message ?? err);
      });
  };

  //DELETE
  const handleDelete = (id: number | null) => {
    fetch("/api/classcode", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return message.error(res.error);
        }
        message.success( res.message || "Deleted!");
        getClasscodeList();
      })
      .catch((err) => {
        return message.error(err.message ?? err);
      });
  };

  return (
    <div className="flex-row ">
      <Card>
        <CardHeader>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Module</Typography.Title>
              <Select
                fieldNames={{ label: "code", value: "id" }}
                className="w-full"
                options={moduleList}
                value={classcodePayload?.module_id}
                onChange={(e) =>
                  setClasscodePayload((prev) => ({ ...prev, module_id: e }))
                }
              />
            </div>
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Class Code</Typography.Title>
              <Input
                className="w-full"
                value={classcodePayload?.code}
                onChange={(e) => {
                  setClasscodePayload((prev) => ({
                    ...prev,
                    code: e?.target?.value,
                  }));
                }}
              />
            </div>

            <div className="col-span-6 lg:col-span-3 content-end">
              <Button
                size="large"
                color="blue"
                variant="filled"
                onClick={handleSave}
                icon={
                  classcodePayload?.id ? (
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
              />
            </div>
          </div>
        </CardHeader>

        <hr />
        <CardContent>
          <Table<ClasscodeType> dataSource={classCodeList} rowKey="id">
            <Column
              title="Section Name"
              dataIndex="name"
              key="name"
            />
            <Column title="Code" dataIndex="code" key="code" />
            <Column
              title="Module"
              dataIndex="module_id"
              render={(id) => moduleMap.get(id) ?? id}
            />
            <Column
              title="Actions"
              key="actions"
              render={(_, record: ClasscodeType) => (
                <div className="flex gap-2">
                  <Button
                    size="small"
                    color="default"
                    variant="filled"
                    icon={<IconEdit />}
                    onClick={() =>
                      setClasscodePayload({
                        id: record.id,
                        code: record?.code,
                        module_id: record?.module_id,
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

export default ClassCodePage;
