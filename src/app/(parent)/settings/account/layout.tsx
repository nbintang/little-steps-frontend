import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-pretty text-2xl">Edit Profile</CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam rerum
          deleniti voluptates.
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
