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

  const ClassRoomPage = () => {
    
  const { Column } = Table;
  interface DataType {
    key: React.Key;
      name?:string;
    floor?:string;
    projectionId?:string;
    projection?:string;
  }

  const data: DataType[] = [
    {
      key: '1',
      name:"A06",
      floor:"0",
      projection:"Brand1 - White",
      projectionId:"b1w"
    },
    {
      key: '2',
      name:"C203",
      floor:"2",
      projection:"Brand2 - Black",
      projectionId:"b2b"
    },
    {
      key: '3',
      name:"B105",
      floor:"1",
      projection:"Brand3 - Black",
      projectionId:"b3b"
    },
    
    
    
  ];
    return (
      <div className="flex-row ">
        <Card>
          <CardHeader className="md:flex flex-row gap-5 items-end">
            <div>
              <Typography.Title level={5}>Classroom Name</Typography.Title>

              <Input />
            </div>
            <div>
              <Typography.Title level={5}>Floor</Typography.Title>

              <Input />
            </div>
            <div>
              <Typography.Title level={5}>Projection</Typography.Title>

              <Select value="2">
                <SelectTrigger className="w-full min-w-100">
                  <SelectValue placeholder="Projection Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* Kayıtlı projectionlar servisten gelecek. */}
                    <SelectItem value="b1w">Brand1 - White</SelectItem>
                    <SelectItem value="b2b">Brand2 - Black</SelectItem>
                    <SelectItem value="b3b">Brand3 - Black</SelectItem>
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
                title="Name"
                dataIndex="name"
                key="name"
              />
              <Column
                title="Floor"
                dataIndex="floor"
                key="floor"
              />
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

  export default ClassRoomPage