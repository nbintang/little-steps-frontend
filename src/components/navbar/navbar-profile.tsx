"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BadgeCheck, Bell, LogOut, LogInIcon } from "lucide-react";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { ProfileAPI } from "@/types/profile";
import { UseQueryResult } from "@tanstack/react-query";

export const NavbarProfile = ({
  userProfile: { data: user },
}: {
  userProfile: UseQueryResult<ProfileAPI | undefined, unknown>;
}) => {
  const { handleLogout } = useLogout();

  // Jika user tidak ada (guest/tidak login)
  if (!user) {
    return (
      <Button asChild variant="default" size="sm">
        <Link href="/login" className="gap-2">
          <LogInIcon className="h-4 w-4" />
          Login
        </Link>
      </Button>
    );
  }

  // User logged in
  const userName = user?.user?.name || "User";
  const userEmail = user?.user?.email || "No email";
  const avatarUrl = user?.avatarUrl || undefined;
  const fallback = userName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
              {fallback}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                  {fallback}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {userEmail}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings/account" className="cursor-pointer">
                <BadgeCheck className="h-4 w-4 mr-2" />
                Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/admin/settings/notifications"
                className="cursor-pointer"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
