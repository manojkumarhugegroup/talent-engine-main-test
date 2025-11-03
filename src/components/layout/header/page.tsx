"use client";

import { BreadcrumbCSeparator } from "./breadcrumb";
import { Profile } from "./profile";
import { Notification } from "./notification";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
    const pathname = usePathname()
    return (
        <>
            <div className="flex justify-between items-center border-b py-2 px-4 sticky top-0 bg-card z-50 max-h-14">
                <span className="flex items-center gap-1">
                    <SidebarTrigger className="cursor-pointer" />
                    <BreadcrumbCSeparator />
                </span>
                <header className="flex  items-center justify-end gap-2">
                    {/* Notification */}
                    <Notification />
                    {/* Profile */}
                    <Profile />
                </header>
            </div>
        </>
    );
}