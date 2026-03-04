  "use client"
  import React from "react";
  import {  Typography, Table, Button ,Switch,Input,InputNumber} from 'antd';
  import { IconXFilled, IconCheckFilled } from "@tabler/icons-react"
  import {
    Card,
    CardAction,
    CardContent,
    //CardDescription,
    CardFooter,
    CardHeader,
    //CardTitle,
  } from "@/components/ui/card"

  const ProgramPage = () => {
    
  const { Column } = Table;
  interface DataType {
    key: React.Key;
      title?:string;
    monday?:boolean;
    tuesday?:boolean;
    wednesday?:boolean;
    thursday?:boolean;
    friday?:boolean;
  }

  const data: DataType[] = [
    {
      key: '1',
      title:"09.00 - 09.50",
      monday:true,
      tuesday:true,
      wednesday:true,
      thursday:true,
      friday:true,
    },
    {
      key: '2',
      title:"10.00 - 10.50",
      monday:true,
      tuesday:true,
      wednesday:true,
      thursday:true,
      friday:true,
    },
    {
      key: '3',
      title:"11.00 - 11.50",
      monday:true,
      tuesday:true,
      wednesday:true,
      thursday:true,
      friday:true,
    },
    {
      key: '4',
      title:"12.00 - 12.50",
      monday:false,
      tuesday:true,
      wednesday:true,
      thursday:true,
      friday:true,
    },
    {
      key: '5',
      title:"13.00 - 13.50",
      monday:true,
      tuesday:true,
      wednesday:false,
      thursday:true,
      friday:false,
    },
    {
      key: '6',
      title:"14.00 - 14.50",
      monday:true,
      tuesday:true,
      wednesday:false,
      thursday:true,
      friday:true,
    },
    {
      key: '7',
      title:"15.00 - 15.50",
      monday:false,
      tuesday:true,
      wednesday:true,
      thursday:false,
      friday:false,
    },
    {
      key: '8',
      title:"16.00 - 16.50",
      monday:true,
      tuesday:true,
      wednesday:false,
      thursday:true,
      friday:false,
    },
    
  ];
    return (
      <div className="flex-row ">
        <Card >
          <CardHeader>
          <div className="md:flex flex-row gap-5">
          <div>
            <Typography.Title level={5}>Program Name</Typography.Title>

            <Input />
          </div>
          <div>
            <Typography.Title level={5}>Program Limit</Typography.Title>

            <InputNumber min={1} max={22} defaultValue={3} />
          </div>
          <div>
            <Typography.Title level={5}>Program Code</Typography.Title>

            <Input />
          </div></div>
        </CardHeader><hr/>
        <CardContent>
  <Table<DataType> dataSource={data}>
          <Column title="" dataIndex="title" key="title" />
          <Column
            title="Monday"
            dataIndex="monday"
            key="monday"
            render={(monday: boolean) => <Switch value={monday} />}
          />
          <Column
            title="Tuesday"
            dataIndex="friday"
            key="tuesday"
            render={(tuesday: boolean) => <Switch value={tuesday} />}
          />
          <Column
            title="Wednesday"
            dataIndex="wednesday"
            key="wednesday"
            render={(wednesday: boolean) => <Switch value={wednesday} />}
          />
          <Column
            title="Thursday"
            dataIndex="thursday"
            key="thursday"
            render={(thursday: boolean) => <Switch value={thursday} />}
          />
          <Column
            title="Friday"
            dataIndex="friday"
            key="friday"
            render={(friday: boolean) => <Switch value={friday} />}
          />
        </Table>
        </CardContent>
        <hr/>
          <CardFooter className="flex-row justify-end gap-1.5 text-sm ">
            <CardAction className="flex gap-1.5">
              <Button size="large"   color="blue" variant="filled"  icon={<IconCheckFilled />}></Button>
              <Button size="large" danger color="danger" variant="filled" icon={<IconXFilled />}></Button>
            </CardAction>
          </CardFooter>
        </Card>
    
      </div>
    );
  }

  export default ProgramPage