import { Button } from "@/components/ui/button"
import { LoginForm } from "@/features/auth/components/login-form"
import { GalleryVerticalEnd, Tornado } from "lucide-react"
import Image from "next/image"
 

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Button    variant={"ghost"}>
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Tornado className="size-4 rotate-180" />
            </div>
           Little Steps
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
              
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/images/auth/children.png"
          alt="Image"
          width={1000}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute inset-0 h-full w-full z-10 bg-black/40"/>
      </div>
    </div>
  )
}
