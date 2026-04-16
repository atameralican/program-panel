"use client";
import React, { useState } from "react";
import { Typography, Button, Input, InputNumber, message } from "antd";
import { IconXFilled, IconCheckFilled } from "@tabler/icons-react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import WeeklySchedulePicker from "@/components/WeeklySchedulePicker";

export type ProgramProps = {
  name: string;
  max_limit: number;
  timeSlots: number[];
};
const ProgramPage = () => {
  const [selectedData, setSelectedData] = useState<ProgramProps>({
    name: "",
    max_limit: 23,
    timeSlots: [],
  });

  const clearForm = () => {
    setSelectedData((prev) => ({ ...prev, name: "", timeSlots: [] }));
  };

  //seçilen slotlar değişimi
  const handleChangeSlotTable = async (ids: number[]) => {
    setSelectedData((prev) => ({ ...prev, timeSlots: ids }));
  };

  const handleSubmit = async () => {
    //validasyonlar
    if (selectedData.timeSlots.length > selectedData.max_limit) {
      message.error(`Seçilen saat sayısı, belirlenen maksimum limiti aşıyor! Lütfen en fazla ${selectedData.max_limit} saat seçin.`,
      );
      return;
    }
    if (selectedData.timeSlots.length === 0) {
      message.error(`Lütfen en az bir saat seçin!`,
      );
      return;
    }
    if (!selectedData.name.trim() ) {
      message.error(`Lütfen program adnı girin!`,
      );
      return;
    }
    if (selectedData.max_limit < 1 || selectedData.max_limit > 40) {
      message.error(`Lütfen 1 ile 40 arasında bir limit girin!`,
      );
      return;
    }
    //backende gönderme
    try {
      const response = await fetch("/api/program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedData),
      });

      const result = await response.json(); // Backendden gelen JSON

      if (!response.ok) {
        //hata varsa
        message.error(result.error || "Beklenmedik bir hata oluştu.",
        );
      } else {
        message.success(result.message || "Program başarıyla kaydedildi!",
        );

        clearForm();
      }
    } catch (error) {
      // Sunucuya erişememe durumu için.
      message.error(
          "Sunucuya ulaşılamıyor. Lütfen internetinizi kontrol edin.",
      );
    }
  };
  return (
    <div className="flex-row ">
      <Card>
        <CardHeader>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <Typography.Title level={5}>Program Name</Typography.Title>
              <Input
                className="w-full"
                value={selectedData?.name}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>


            <div className="col-span-4 md:col-span-4">
              <Typography.Title level={5}> Limit</Typography.Title>
              <InputNumber
                className="w-full"
                min={1}
                max={40}
                value={selectedData?.max_limit}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, max_limit: e || 23 }))
                }
              />
            </div>
          </div>
        </CardHeader>
        <hr />
        <CardContent>
          <WeeklySchedulePicker
            selected={selectedData.timeSlots}
            onChange={handleChangeSlotTable}
            maxSelections={selectedData.max_limit} // girilen max limiti yazacağız.
          />
        </CardContent>
        <hr />
        <CardFooter className="flex-row justify-end gap-1.5 text-sm ">
          <CardAction className="flex gap-1.5">
            <Button
              size="large"
              color="blue"
              onClick={handleSubmit}
              disabled={selectedData.timeSlots.length === 0}
              variant="filled"
              icon={<IconCheckFilled />}
            ></Button>
            <Button
              size="large"
              danger
              onClick={clearForm}
              color="danger"
              variant="filled"
              icon={<IconXFilled />}
            ></Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProgramPage;

/**
 * düzenleme modu olacak mı?
 * silme yaparsak eğr iki tablodanda silmesi.
 * auth sistemi
 */
