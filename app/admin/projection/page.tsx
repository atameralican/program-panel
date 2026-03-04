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

  const ProjectionPage = () => {
    
  const { Column } = Table;
  interface DataType {
    key: React.Key;
      brand?:string;
    serino?:string;
    color?:string;
    active?:boolean;
  }

  const data: DataType[] = [
    {
      key: '1',
      brand:"Brand 1",
      serino:"Seri No 1",
      color:"White",
      active:true,
    },
    {
      key: '2',
      brand:"Brand 2",
      serino:"Seri No 2",
      color:"Black",
      active:false,
    },
    {
      key: '3',
      brand:"Brand 3",
      serino:"Seri No 3",
      color:"Black",
      active:true,
    },
    
    
  ];
    return (
      <div className="flex-row ">
        <Card>
          <CardHeader className="md:flex flex-row gap-5 items-end">
            <div>
              <Typography.Title level={5}>Brand</Typography.Title>

              <Input />
            </div>
            <div>
              <Typography.Title level={5}>Seri No</Typography.Title>

              <Input />
            </div>
            <div>
              <Typography.Title level={5}>Color</Typography.Title>

              <Select value="2">
                <SelectTrigger className="w-full min-w-100">
                  <SelectValue placeholder="Program Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* başka renkler varsa eklenecek. */}
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
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
                title="Brand"
                dataIndex="brand"
                key="brand"
              />
              <Column
                title="Seri No"
                dataIndex="serino"
                key="serino"
              />
              <Column
                title="Color"
                dataIndex="color"
                key="color"
              />
              <Column
                title="Active"
                dataIndex="active"
                key="active"
                            render={(active: boolean) => <Switch value={active} />}
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

  export default ProjectionPage