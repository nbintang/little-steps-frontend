import { CreateForumForm } from "@/features/parent/components/create-forum-form";

export default function CreateForumPage() {
  return (
    <div className="container mx-auto max-w-4xl min-h-screen px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-balance">Buat Forum</h1>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
          asperiores veritatis esse.
        </p>
      </div>
      <CreateForumForm />
    </div>
  );
}
