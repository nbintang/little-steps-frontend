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
import {
  LogOut,
  LogInIcon,
  Baby,
  Settings,
  UserCog,
} from "lucide-react";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { ProfileAPI } from "@/types/profile";
import { UseQueryResult } from "@tanstack/react-query";
import { useOpenChildAccessDialog } from "@/features/parent/hooks/use-open-child-access-dialog";

export const NavbarProfile = ({
  userProfile: { data: user, isError },
}: {
  userProfile: UseQueryResult<ProfileAPI | undefined, unknown>;
}) => {
  const { handleLogout } = useLogout();
  const setOpenDialog = useOpenChildAccessDialog((state) => state.setOpenDialog);

  const handleOpenChildAccessDialog = () => setOpenDialog(true);
  // guest
  if (isError || !user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/login" className="gap-2">
          <LogInIcon className="h-4 w-4" />
          Login
        </Link>
      </Button>
    );
  }
 
  const userName = user?.user?.name || "User";
  const userEmail = user?.user?.email || "No email";
  const avatarUrl = user?.avatarUrl || undefined;
  const fallback = userName.charAt(0).toUpperCase();

 
  const menuItems = [
    {
      label: "Account Settings",
      icon: <Settings className="h-4 w-4" />,
      href: "/settings/account",
    },
    {
      label: "Child Settings",
      icon: <UserCog className="h-4 w-4" />,
      href: "/settings/children",
    },
    {
      label: "Child Mode",
      icon: <Baby className="h-4 w-4" />,
      onClick: handleOpenChildAccessDialog,
    },
  ];

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

        <DropdownMenuContent className="w-56 rounded-lg" align="end" sideOffset={4}>
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
            {menuItems.map((item, index) =>
              item.href ? (
                <DropdownMenuItem asChild key={index}>
                  <Link href={item.href} className="cursor-pointer">
                    {item.icon}
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  key={index}
                  onClick={item.onClick}
                  className="cursor-pointer"
                >
                  {item.icon}
                  {item.label}
                </DropdownMenuItem>
              )
            )}
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
