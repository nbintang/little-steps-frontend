import { Button } from "@/components/ui/button";
import { ArrowDown, LogIn } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans grid min-h-screen  place-items-center">
      <div className="flex flex-col gap-3">
        <div className="flex gap-1 items-center animate-bounce">
          <h1 className="text-2xl font-bold">Coba Login</h1>
          <ArrowDown className="size-9" />
        </div>
        <Button className="bg-gradient-to-r from-yellow-400  to-orange-500 text-white">
          <LogIn />
          Login
        </Button>
      </div>
    </div>
  );
}
