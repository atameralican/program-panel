
import { Button, ConfigProvider, Flex } from 'antd';
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Sitepath from "./site-path"
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';

export function SiteHeader() {



  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Sitepath />
        {/* <h1 className="text-base font-medium">Documents</h1> */}
        <div className="ml-auto flex items-center gap-2">
        
          <Button
            href="https://github.com/atameralican"
            target="_blank"
            rel="noopener noreferrer"
            color="default"
            variant="text"
            icon={<IconBrandGithub />}
          />
          <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
          <Button
            href="https://www.linkedin.com/in/alican-atamer/"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            variant="text"
            icon={<IconBrandLinkedin />}
          />
        </div>
      </div>
    </header>
  );
}
