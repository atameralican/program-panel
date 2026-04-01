"use client"

import * as React from "react"
import Link from "next/link" 
import {
  IconLayoutDashboard,   
  IconBooks,             
  IconBlocks,            
  IconDeviceProjector,   
  IconSchool,            
  IconUserCheck,         
  IconColumns,           
  IconPresentation,      
  IconInnerShadowTop,
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
type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
};
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
      icon: IconLayoutDashboard,
    },
    {
      title: "Program Add",
      url: "/admin/program",
      icon: IconBooks,
    },
    {
      title: "Module Add",
      url: "/admin/module",
      icon: IconBlocks,
    },
    {
      title: "Projection Add",
      url: "/admin/projection",
      icon: IconDeviceProjector,
    },
    {
      title: "Classroom Add",
      url: "/admin/classroom",
      icon: IconSchool,
    },
    {
      title: "Teacher Add",
      url: "/admin/teacher",
      icon: IconUserCheck,
    },
    {
      title: "Class Code Add",
      url: "/admin/class-code",
      icon: IconColumns,
    },
    {
      title: "Instructor Add",
      url: "/admin/instructor",
      icon: IconPresentation,
    },
  ],
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {

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
        <NavUser user={user??data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
