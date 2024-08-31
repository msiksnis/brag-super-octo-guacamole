"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import {
  CheckIcon,
  ComputerIcon,
  LogOutIcon,
  Monitor,
  Moon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useSession } from "@/app/(main)/SessionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import { logout } from "@/app/(auth)/actions/logoutAction";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();

  const { setTheme, theme } = useTheme();

  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn("flex-none rounded-full outline-none", className)}
        >
          <UserAvatar
            avatarUrl={user.avatarUrl}
            size={50}
            className="size-8 md:size-12 border border-muted-foreground hover:-rotate-10 transition-all duration-300 ease-in-out"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="size-4 mr-2" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="size-4 mr-2" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <ComputerIcon className="size-4 mr-2" />
                <div className="flex justify-between items-center w-full">
                  System default
                </div>
                <div className="">
                  {theme === "system" && <CheckIcon className="size-4 ml-2" />}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <SunIcon className="size-4 mr-2" />
                <div className="flex justify-between items-center w-full">
                  Light
                </div>
                <div>
                  {theme === "light" && <CheckIcon className="size-4 ml-2" />}
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="size-4 mr-2" />
                <div className="flex justify-between items-center w-full">
                  Dark
                </div>
                <div className="">
                  {theme === "dark" && <CheckIcon className="size-4 ml-2" />}
                </div>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            queryClient.clear();
            logout();
          }}
        >
          <LogOutIcon className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
