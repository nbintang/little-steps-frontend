 
import { Metadata } from "next";

type Params = { slug: string };
 
export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <main className="my-10" >
            {children}
        </main>
    );
}