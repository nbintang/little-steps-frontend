import { cookies } from "next/headers";
import { redirect } from "next/navigation";

 
 export default async function Playground () {
  const cookieStore = await cookies();
  const status = cookieStore.get("childStatus");
  if(!status) return null;
  redirect("/children/playground/stories")
 }