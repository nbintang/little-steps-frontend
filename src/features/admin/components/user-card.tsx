"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type UserDetailAPI } from "@/types/user";
import { cn } from "@/lib/utils";
import { UserDetailAPIWithLocation } from "../hooks/use-get-user-detail";
import { format } from "date-fns";

type Props = {
  user: UserDetailAPIWithLocation;
} & React.ComponentProps<typeof Card>;
 

export function UserDetailCard({ user, className, ...props }: Props) {
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("") || "U";

  return (
    <Card className={cn("bg-card", className)} {...props}>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarImage
              src={user.profile?.avatarUrl || "/placeholder.svg"}
              alt={`${user.name} avatar`}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="text-balance">{user.name}</CardTitle>
            <CardDescription className="text-pretty">
              {user.email}
            </CardDescription>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant={user.verified ? "default" : "secondary"}>
                {user.verified ? "Verified" : "Unverified"}
              </Badge>

              <Badge variant="secondary">
                Joined {format(user.createdAt || new Date(), "dd MMM yyyy")}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <section className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Full name
              </h3>
              <p className="mt-1">{user.profile?.fullName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
              <p className="mt-1 text-pretty">{user.profile?.bio ?? "—"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Birth date
                </h3>
                <p className="mt-1">{format(user.createdAt || new Date(), "dd MMM yyyy")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Phone
                </h3>
                <p className="mt-1">{user.profile?.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Location
                </h3>
                <p className="mt-1">{user.location}</p>
              </div>
            </div>
          </div>
        </section>
        <Separator className="my-6" />
        <section className="grid gap-4 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Profile ID
            </h3>
            <p className="mt-1">
              <code className="text-muted-foreground">{user.profile?.id}</code>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Account
            </h3>
            <p className="mt-1">
              {user.verified ? "Email verified" : "Pending verification"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Status
            </h3>
            <p className="mt-1">
              {user.isRegistered ? "Registered user" : "Guest"}
            </p>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
