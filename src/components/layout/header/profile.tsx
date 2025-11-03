import React from "react";
import { LockIcon, LogOutIcon, UserIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function Profile() {
  const router = useRouter();

const fName = Cookies.get("full_name");
  const logOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });  
    // router.push("/login");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full flex items-center gap-2 px-2 py-1.5"
            >
              <Avatar className="h-8 w-8  cursor-pointer">
                <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
               <AvatarFallback>{fName?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
            <span className="text-sm font-medium">{fName}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LockIcon className="mr-2 h-4 w-4" />
            Change Password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={logOut}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
