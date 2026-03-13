"use client";

import { notification } from "antd";
import React, { createContext, useContext, ReactNode } from "react";

// Tipleri
type NotifyType = "success" | "error" | "info" | "warning";

interface NotifyOptions {
  title: string;
  description?: string;
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

interface NotifyContextType {
  notify: {
    success: (opts: NotifyOptions) => void;
    error: (opts: NotifyOptions) => void;
    info: (opts: NotifyOptions) => void;
    warning: (opts: NotifyOptions) => void;
  };
}

const NotifyContext = createContext<NotifyContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  const notify = {
    success: (opts: NotifyOptions) =>
      api.success({
        title: opts.title,
        description: opts.description,
        placement: opts.placement ?? "topRight",
        duration: opts.duration ?? 3,
      }),
    error: (opts: NotifyOptions) =>
      api.error({
        title: opts.title,
        description: opts.description,
        placement: opts.placement ?? "topRight",
        duration: opts.duration ?? 3,
      }),
    info: (opts: NotifyOptions) =>
      api.info({
        title: opts.title,
        description: opts.description,
        placement: opts.placement ?? "topRight",
        duration: opts.duration ?? 3,
      }),
    warning: (opts: NotifyOptions) =>
      api.warning({
        title: opts.title,
        description: opts.description,
        placement: opts.placement ?? "topRight",
        duration: opts.duration ?? 3,
      }),
  };

  return (
    <NotifyContext.Provider value={{ notify }}>
      {contextHolder}
      {children}
    </NotifyContext.Provider>
  );
};

// Hook
export const useNotify = () => {
  const context = useContext(NotifyContext);
  if (!context) {
    throw new Error("useNotify must be used within NotificationProvider");
  }
  return context.notify;
};
