import { CreateThreadForm } from "@/features/parent/components/form/create-thread-form";

 
export default function CreateForumPage() {
  return (
    <div className="max-w-4xl min-h-screen mx-auto ">
      <div>
        <h1 className="text-2xl font-semibold text-balance">Buat Forum</h1>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
          asperiores veritatis esse.
        </p>
      </div>
      <CreateThreadForm />
    </div>
  );
}
