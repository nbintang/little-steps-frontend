export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" container mx-auto px-4  my-7">
      <div className="mb-4">
        <h1 className="text-3xl font-semibold text-pretty">Forum</h1>
        <p className="text-muted-foreground mt-2">
          Insights and deep dives across design, performance, and architecture.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}
