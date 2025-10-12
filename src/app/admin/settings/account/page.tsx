import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" 
import SettingAccount from "@/features/admin/components/setting-account"

export default function Page() {
  return (
    <Card className="shadow-none ">
        <CardHeader>
          <CardTitle className="text-pretty text-2xl">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingAccount />
        </CardContent>
      </Card> 
  )
}