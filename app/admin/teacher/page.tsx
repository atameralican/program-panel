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

  const TeacherPage = () => {
    
  const { Column } = Table;
  interface DataType {
    key: React.Key;
      name?:string;
      gender?:string;
      room?:string;
      phone?:string;
      roomTelephone?:string;
      selectionnableSection?:string;
      sectionLimit?:number|string ;
      fullLimit?:number|string ;
      stable?:string;

  }

  const data: DataType[] = [
    {
      key: '1',
      name:"Ayşe Yılmaz",
      gender:"Woman",
      room:"S07",
      phone:"1234567890",
      roomTelephone:"0987654321",
      selectionnableSection:"M101",
      sectionLimit:10,
      fullLimit:20,
      stable:"Ali Veli"  
    },
    {
      key: '2',
      name:"Fatma Şahin",
      gender:"Woman",
      room:"444",
      phone:"1234567890",
      roomTelephone:"0987654321",
      selectionnableSection:"M102",
      sectionLimit:12,
      fullLimit:23,
      stable:"Kamuran Akkoş"  
    },
    
    
    
    
    
  ];
    return (
      <div className="flex-row ">
        <Card>
          <CardHeader>
            <div className="grid grid-cols-12  gap-5">
              <div className="col-span-12 md:col-span-6 lg:col-span-3 ">
                <Typography.Title level={5}>Name</Typography.Title>
                <Input className="w-100" />
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-2">
                <Typography.Title level={5}>Gender</Typography.Title>
                <Select value="2">
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Gender Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* Kayıtlı sectionlr servisten gelecek. */}
                      <SelectItem value="woman">Woman</SelectItem>
                      <SelectItem value="man">Man</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-2">
                <Typography.Title level={5}>Room</Typography.Title>
                <Input className="w-100" />
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-2">
                <Typography.Title level={5}>Phone Number</Typography.Title>
                <Input className="w-100" />
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-2">
                <Typography.Title level={5}>Room Tel</Typography.Title>
                <Input className="w-100" />
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-3">
                <Typography.Title level={5}>
                  Selectionnable Section
                </Typography.Title>
                <Select value="2">
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Selectionnable Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* Kayıtlı sectionlr servisten gelecek. */}
                      <SelectItem value="m101">M101</SelectItem>
                      <SelectItem value="m103">M103</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-2">
 <Typography.Title level={5}>Section Limit</Typography.Title>
                <Input className="w-100" />
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-2">
 <Typography.Title level={5}>Full Limit</Typography.Title>
                <Input className="w-100" />
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-3">
                <Typography.Title level={5}>
                  Stable
                </Typography.Title>
                <Select value="2">
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Stable Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* Kayıtlar servisten gelecek. */}
                      <SelectItem value="ush2">Ali Veli</SelectItem>
                      <SelectItem value="fmh78">Ayşe Fatma</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-12 md:col-span-3 content-end lg:col-span-1">
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
  }

  export default TeacherPage