"use client";
import React from "react";
import { Typography, Table, Button, Switch, Input, InputNumber } from "antd";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ClassCodePage = () => {
  const { Column } = Table;
  interface DataType {
    key: React.Key;
    name?: string;
    modul?: string;
    classroom?: string;
    floor?: string;
    program?: string;
  }

  const data: DataType[] = [
    {
      key: "1",
      name: "A06",
      modul: "M20",
      classroom: "S07",
      floor: "0",
      program: "Program1",
    },
    {
      key: "2",
      name: "A07",
      modul: "M01",
      classroom: "A09",
      floor: "1",
      program: "Program2",
    },
    {
      key: "3",
      name: "B08",
      modul: "K11",
      classroom: "M7",
      floor: "0",
      program: "Program3",
    },
  ];
  return (
    <div className="flex-row ">
      <Card>
        <CardHeader>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Module</Typography.Title>
              <Select value="2">
                <SelectTrigger className="w-full ">
                  <SelectValue placeholder="Modul Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* Kayıtlı moduller servisten gelecek. */}
                    <SelectItem value="mod1">Modul1</SelectItem>
                    <SelectItem value="mod2">Modul2</SelectItem>
                    <SelectItem value="mod3">Modul3</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Section Code</Typography.Title>
              <Input className="w-full" />
            </div>
            
            <div className="col-span-6 lg:col-span-3">
              <Typography.Title level={5}>Classroom</Typography.Title>
              <Select value="2">
                <SelectTrigger className="w-full ">
                  <SelectValue placeholder="Classroom Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* Kayıtlı clasrooms servisten gelecek. */}
                    <SelectItem value="a103">A103</SelectItem>
                    <SelectItem value="c203">C203</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-6 lg:col-span-3 content-end">
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
            <Column title="Section Name" dataIndex="name" key="name" />
            <Column title="Modul" dataIndex="modul" key="modul" />
            <Column title="Classroom" dataIndex="classroom" key="classroom" />
            <Column title="Floor" dataIndex="floor" key="floor" />
            <Column title="Program" dataIndex="program" key="program" />
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

export default ClassCodePage;
