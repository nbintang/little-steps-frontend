"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useChildProfile from "@/hooks/use-child-profile";

export default function Page() {
  const child = useChildProfile();
  return (
    <div>
      <Avatar>
        <AvatarImage src={child.data?.avatarUrl} alt={child.data?.name} />
        <AvatarFallback>{child.data?.name.charAt(0)}</AvatarFallback>
      </Avatar>
    </div>
  );
}
