"use client";

import { ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MenuItem } from "@/types/layout.types";
import { menuItems } from "./MenuItems";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export function AppSidebar() {
  const { open } = useSidebar()
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({});

  const pathname = usePathname();

  const renderMenuItem = (item: MenuItem, isSubmenu = false) => {
    // const isActive = item.url && pathname === item.url;
    const isActive = item.url && (pathname === item.url || pathname.startsWith(item.url + "/"));

    const isParentActive = item.subitems?.some((sub) => sub.url && (pathname === sub.url || pathname.startsWith(sub.url + "/"))) ?? false;


    const isOpen = openStates[item.title] ?? isParentActive;
    return (
      <SidebarMenuItem key={item.title}   >
        {item.subitems ? (
          <Collapsible
            className={`${open ? "py-2 px-2" : " px-0 py-1"} group/collapsible rounded text-[#EBEEF0] hover:text-[#EBEEF0] `}
            defaultOpen={isParentActive}
            onOpenChange={(open) => setOpenStates((prev) => ({ ...prev, [item.title]: open }))}
          //   ${isParentActive ? "bg-[#142680] font-medium py-2" : ""}  
          >

            <CollapsibleTrigger asChild >
              <SidebarMenuButton className={`font-sans w-full flex items-center gap-2 rounded-md p-2 hover:text-slate-200 text-sm whitespace-nowrap hover:bg-(--primary-active) capitalize cursor-pointer  ${isParentActive && !isOpen ? "bg-(--primary-active)" : ""}`}
              >
                {item.icon && (
                  <img src={item.icon} className="h-4" alt="" />
                )}
                <span>{item.title}</span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 h-4" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu className={`w-full mt-1 ${isSubmenu ? "pl-4" : open ? "pl-2" : "pl-0"}`}>
                {item.subitems.map((subitem) => renderMenuItem(subitem, true))}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <>
            <SidebarMenuButton asChild className={`font-sans w-full flex items-center gap-2 rounded-md px-4 text-[#EBEEF0] hover:bg-(--primary-active) hover:text-[#EBEEF0] ${isActive ? "bg-(--primary-active) " : ""}`}>
              <Link href={item.url || "#"}>
                {item.icon && (
                  <img
                    src={item.icon}
                    className={isSubmenu ? "w-2 h-2 ml-1" : "h-4"}
                    alt=""
                  />
                )}
                {!item.icon && isSubmenu && <span className="h-4 inline-block" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            {item.badge !== undefined && (
              <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
            )}
          </>
        )
        }
      </SidebarMenuItem >
    );
  };

  return (
    <Sidebar collapsible="icon" className="z-30">
      <SidebarContent>
        <SidebarGroup >
          {open ? (
            <Image src={"/assets/logos/logo_w.png"} alt="" width={180} height={25} />
          ) : (
            <Image
              src="/assets/logos/Vector-rectangle.png"
              alt="logo"
              width={40}
              height={40}
              className="mx-auto"
            />
          )}


          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => renderMenuItem(item))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
