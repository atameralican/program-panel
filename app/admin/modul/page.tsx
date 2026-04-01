"use client";
import React, { useEffect, useState } from "react";
import { Typography, Table, Button, Switch,Select, Input, InputNumber } from "antd";
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


const ModulPage = () => {
  const { Column } = Table;
  const [programList, setProgramList] = useState<ProgramProps[]>();
  interface DataType {
    key: React.Key;
    modulName?: string;
    modulCode?: string;
    programId?: string;
    programName?: string;
  }

  const data: DataType[] = [
    {
      key: "1",
      modulName: "Module 1",
      modulCode: "AS562S",
      programId: "123",
      programName: "Program 1",
    },
    {
      key: "2",
      modulName: "Module 2",
      modulCode: "AS562T",
      programId: "124",
      programName: "Program 2",
    },
    {
      key: "3",
      modulName: "Module 3",
      modulCode: "ASD5S",
      programId: "435",
      programName: "Program 3",
    },
  ];


    const getProgramList = () => {
      fetch("/api/program", {})
        .then((res) => res?.json())
        .then((res) => {
          setProgramList(res || []);
        })
    };
    useEffect(() => {
      getProgramList();
    }, []);
  return (
    <div className="flex-row ">
      <Card>
        <CardHeader>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Modul Name</Typography.Title>
              <Input className="w-full" />
            </div>
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Code</Typography.Title>
              <Input className="w-full" />
            </div>
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Program</Typography.Title>
              <Select
                fieldNames={{ label: "name", value: "id" }}
                className="w-full"
                options={programList}
              />
            </div>
            <div className="col-span-6 lg:col-span-3 content-end ">
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
          <Table<DataType> dataSource={data}>
            <Column title="Modul Name" dataIndex="modulName" key="modulName" />
            <Column title="Modul Code" dataIndex="modulCode" key="modulCode" />
            <Column title="Program" dataIndex="programName" key="programName" />
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

export default ModulPage;
