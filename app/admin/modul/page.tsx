  "use client"
  import React from "react";
  import {  Typography, Table, Button ,Switch,Input,InputNumber} from 'antd';
  import { IconXFilled, IconCheckFilled,IconEdit,IconTrash } from "@tabler/icons-react"
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

  const ModulPage = () => {
    
  const { Column } = Table;
  interface DataType {
    key: React.Key;
      modulName?:string;
    modulCode?:string;
    programId?:string;
    programName?:string;
  }

  const data: DataType[] = [
    {
      key: '1',
      modulName:"Module 1",
      modulCode:"AS562S",
      programId:"123",
      programName:"Program 1",
    },
    {
      key: '2',
      modulName:"Module 2",
      modulCode:"AS562T",
      programId:"124",
      programName:"Program 2",
    },
    {
      key: '3',
      modulName:"Module 3",
      modulCode:"ASD5S",
      programId:"435",
      programName:"Program 3",
    },
    
    
  ];
    return (
      <div className="flex-row ">
        <Card>
          <CardHeader className="md:flex flex-row gap-5 items-end">
            <div>
              <Typography.Title level={5}>Modul Name</Typography.Title>

              <Input />
            </div>
            <div>
              <Typography.Title level={5}>Code</Typography.Title>

              <Input />
            </div>
            <div>
              <Typography.Title level={5}>Program</Typography.Title>

              <Select value="2">
                <SelectTrigger className="w-full min-w-100">
                  <SelectValue placeholder="Program Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* servisten gelen programlar valueda id si content kısmında ise adı yazacak.*/}
                    <SelectItem value="1">Program 1</SelectItem>
                    <SelectItem value="2">Program 2</SelectItem>
                    <SelectItem value="3">Program 3</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <CardAction className="flex gap-1.5">
                <Button
                  size="large"
                  color="blue"
                  variant="filled"
                  icon={<IconCheckFilled />}
                ></Button>
                <Button
                  size="large"
                  danger
                  color="danger"
                  variant="filled"
                  icon={<IconXFilled />}
                ></Button>
              </CardAction>
            </div>
          </CardHeader>

          <hr />
          <CardContent>
            <Table<DataType> dataSource={data}>
              <Column
                title="Modul Name"
                dataIndex="modulName"
                key="modulName"
              />
              <Column
                title="Modul Code"
                dataIndex="modulCode"
                key="modulCode"
              />
              <Column
                title="Program"
                dataIndex="programName"
                key="programName"
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
                      icon={<IconEdit/>}
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
  }

  export default ModulPage