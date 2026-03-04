"use client"

import * as React from "react"
import Link from "next/link" 
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    //Buraya daha sonra giriş yapan kullanıcının bilgileri gelecek
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Admin",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Program Add",
      url: "/admin/program",
      icon: IconListDetails,
    },
    {
      title: "Modul Add",
      url: "/admin/modul",
      icon: IconChartBar,
    },
    {
      title: "Projection Add",
      url: "/admin/projection",
      icon: IconFolder,
    },
    {
      title: "Classroom Add",
      url: "/admin/classroom",
      icon: IconUsers,
    },
    {
      title: "Teacher Add",
      url: "/admin/teacher",
      icon: IconUsers,
    },
    {
      title: "Section Add",
      url: "/admin/section",
      icon: IconUsers,
    },
    {
      title: "Instructor Add",
      url: "/admin/instructor",
      icon: IconUsers,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
               <Link href="/admin">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">HPYS</span>
              </Link>
            
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
