

  "use client"
  import React, { JSX } from "react";
  import {  Typography, Table, Button ,Switch,Input,InputNumber} from 'antd';
  import { IconXFilled, IconCheckFilled,IconEdit,IconTrash } from "@tabler/icons-react"
  import { ScrollArea } from "@/components/ui/scroll-area"
  import type { ColumnsType } from 'antd/es/table';
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
import SortableList from "@/components/dnd-list";
interface CellData {
  type: 'busy' | 'assigned';
  text: string;
}

interface ScheduleRow {
  time: string;
  monday: CellData | null;
  tuesday: CellData | null;
  wednesday: CellData | null;
  thursday: CellData | null;
  friday: CellData | null;
}
  const InstructorPage = () => {
   const dummy: ScheduleRow[] = [
    { time: '09:00 - 09:50', monday: null, tuesday: { type: 'busy', text: 'Ali Veli' }, wednesday: { type: 'assigned', text: 'Assignment to' }, thursday: null, friday: null },
    { time: '10:00 - 10:50', monday: null, tuesday: { type: 'busy', text: 'Ali Veli' }, wednesday: { type: 'assigned', text: 'Assignment to' }, thursday: null, friday: null },
    { time: '11:00 - 11:50', monday: null, tuesday: { type: 'assigned', text: 'Assignment to' }, wednesday: { type: 'busy', text: 'Ali Veli' }, thursday: null, friday: null },
    { time: '12:00 - 12:50', monday: null, tuesday: { type: 'assigned', text: 'Assignment to' }, wednesday: { type: 'assigned', text: 'Assignment to' }, thursday: { type: 'assigned', text: 'Assignment to' }, friday: { type: 'assigned', text: 'Assignment to' } },
    { time: '13:00 - 13:50', monday: null, tuesday: { type: 'assigned', text: 'Assignment to' }, wednesday: { type: 'assigned', text: 'Assignment to' }, thursday: { type: 'assigned', text: 'Assignment to' }, friday: { type: 'assigned', text: 'Assignment to' } },
    { time: '14:00 - 14:50', monday: null, tuesday: { type: 'assigned', text: 'Assignment to' }, wednesday: { type: 'assigned', text: 'Assignment to' }, thursday: { type: 'assigned', text: 'Assignment to' }, friday: { type: 'assigned', text: 'Assignment to' } },
    { time: '15:00 - 15:50', monday: null, tuesday: { type: 'assigned', text: 'Assignment to' }, wednesday: { type: 'assigned', text: 'Assignment to' }, thursday: { type: 'assigned', text: 'Assignment to' }, friday: { type: 'assigned', text: 'Ayşe Fatma' } },
    { time: '16:00 - 16:50', monday: null, tuesday: null, wednesday: { type: 'assigned', text: 'Assignment to' }, thursday: null, friday: { type: 'assigned', text: 'Ayşe Fatma' } },
  ];

  const columns: ColumnsType<ScheduleRow> = [
    {
      title: '',
      dataIndex: 'time',
      key: 'time',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Monday',
      dataIndex: 'monday',
      key: 'monday',
      render: (cell: CellData | null) => renderCell(cell),
    },
    {
      title: 'Tuesday',
      dataIndex: 'tuesday',
      key: 'tuesday',
      render: (cell: CellData | null) => renderCell(cell),
    },
    {
      title: 'Wednesday',
      dataIndex: 'wednesday',
      key: 'wednesday',
      render: (cell: CellData | null) => renderCell(cell),
    },
    {
      title: 'Thursday',
      dataIndex: 'thursday',
      key: 'thursday',
      render: (cell: CellData | null) => renderCell(cell),
    },
    {
      title: 'Friday',
      dataIndex: 'friday',
      key: 'friday',
      render: (cell: CellData | null) => renderCell(cell),
    },
  ];

  const renderCell = (cell: CellData | null): JSX.Element | null => {
    if (!cell) return null;
    
    const className = cell.type === 'busy' ? 'cell-busy' : 'cell-assigned';
    
    return (
      <div className={className}>
        {cell.text}
      </div>
    );
  };
  
    return (
      <div className="flex-row ">
        <Card>
          <CardHeader className="">
            <div className="grid  grid-cols-12 gap-4">
             
              <div className="col-span-6 lg:col-span-4 ">
                <Typography.Title level={5}>Section</Typography.Title>
                <Select >
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Section Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* Kayıtlı projectionlar servisten gelecek. */}
                      <SelectItem value="1">Ahmet Mehme t</SelectItem>
                      <SelectItem value="2">Ayşe Fatma</SelectItem>
                      <SelectItem value="3">Ali Veli</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-6">
                <Typography.Title level={5}>Teacher List</Typography.Title>
                <ScrollArea className="h-50 w-full p-2  rounded-md border">
                  <SortableList/>
                </ScrollArea>
              </div>
              <div className="col-span-6 lg:col-span-2 content-end   ">
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
             <Table
        columns={columns}
        dataSource={dummy}
        pagination={false}
        bordered
        rowKey="time"
      />
          </CardContent>
        </Card>
      </div>
    );
  }

  export default InstructorPage