"use client";
import React, { useState } from "react";
import { Typography, Button, Input, InputNumber } from "antd";
import { IconXFilled, IconCheckFilled } from "@tabler/icons-react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import WeeklySchedulePicker from "@/components/WeeklySchedulePicker";
import { useNotify } from "@/components/ui/notify-ant-rev";

type ProgramProps = {
  name: string;
  code: string;
  max_limit: number;
  timeSlots: number[];
};
const ProgramPage = () => {
  const notify = useNotify();
  const [selectedData, setSelectedData] = useState<ProgramProps>({
    name: "",
    code: "",
    max_limit: 23,
    timeSlots: [],
  });

  const clearForm = () => {
    setSelectedData((prev) => ({ ...prev, name: "", code: "", timeSlots: [] }));
  };

  //seçilen slotlar değişimi
  const handleChangeSlotTable = async (ids: number[]) => {
    setSelectedData((prev) => ({ ...prev, timeSlots: ids }));
  };

  const handleSubmit = async () => {
    //validasyonlar
    if (selectedData.timeSlots.length > selectedData.max_limit) {
      notify.error({
        title: "Fail",
        description: `Seçilen saat sayısı, belirlenen maksimum limiti aşıyor! Lütfen en fazla ${selectedData.max_limit} saat seçin.`,
      });
      return;
    }
    if (selectedData.timeSlots.length === 0) {
      notify.error({
        title: "Fail",
        description: `Lütfen en az bir saat seçin!`,
      });
      return;
    }
    if (!selectedData.name.trim() || !selectedData.code.trim()) {
      notify.error({
        title: "Fail",
        description: `Lütfen program adı ve kodunu girin!`,
      });
      return;
    }
    if (selectedData.max_limit < 1 || selectedData.max_limit > 40) {
      notify.error({
        title: "Fail",
        description: `Lütfen 1 ile 40 arasında bir limit girin!`,
      });
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
        notify.error({
          title: "Kayıt Başarısız",
          description: result.error || "Beklenmedik bir hata oluştu.",
        });
      } else {
        notify.success({
          title: "Başarılı",
          description: result.message || "Program başarıyla kaydedildi!",
        });

        clearForm();
      }
    } catch (error) {
      // Sunucuya erişememe durumu için.
      notify.error({
        title: "Bağlantı Hatası",
        description:
          "Sunucuya ulaşılamıyor. Lütfen internetinizi kontrol edin.",
      });
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
                className="w-100"
                value={selectedData?.name}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="col-span-8 md:col-span-4">
              <Typography.Title level={5}>Program Code</Typography.Title>
              <Input
                className="w-100"
                value={selectedData?.code}
                onChange={(e) =>
                  setSelectedData((prev) => ({ ...prev, code: e.target.value }))
                }
              />
            </div>

            <div className="col-span-4 md:col-span-4">
              <Typography.Title level={5}> Limit</Typography.Title>
              <InputNumber
                className="w-100"
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
