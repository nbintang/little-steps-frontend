import { getFictionBySlug } from "@/lib/data";
import { Metadata } from "next";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const story = await getFictionBySlug(params.slug);
  if (!story) return { title: "Fiction" };
  return { title: story.title };
}

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="container mx-auto px-4 py-10">
            {children}
        </div>
    );
}