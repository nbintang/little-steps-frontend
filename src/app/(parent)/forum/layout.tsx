
export default  function Layout({
  children,
}: {
  children: React.ReactNode;
}) { 
  return <div className=" container mx-auto px-4  my-7">{children}</div>;
}
