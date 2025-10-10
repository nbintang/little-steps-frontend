"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export const NavbarProfileError = () => {
  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            title="Error loading profile"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs">Error</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Profile Error</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-2 text-sm text-muted-foreground">
            Failed to load profile. Please try again.
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/login">Go to Login</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};