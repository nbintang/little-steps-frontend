import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" 
import SettingAccount from "@/features/admin/components/setting-account"

export default function Page() {
  return (
    <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-pretty text-2xl">Edit Profile</CardTitle>
          <CardDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam rerum deleniti voluptates.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingAccount />
        </CardContent>
      </Card> 
  )
}