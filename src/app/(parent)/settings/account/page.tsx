"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" 
import SettingAccount from "@/components/setting-account"
import useProfile from "@/hooks/use-profile"
import useProfileDetail from "@/hooks/use-profile-with-location"

export default function Page() {
  const  {data: profile, isLoading, isError} = useProfileDetail()
  if (isLoading) return <div>Loading...</div>;
  if (isError || !profile) return <div>Error</div>;
  return (
    <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-pretty text-2xl">Edit Profile</CardTitle>
          <CardDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam rerum deleniti voluptates.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingAccount profile={profile}  />
        </CardContent>
      </Card> 
  )
}