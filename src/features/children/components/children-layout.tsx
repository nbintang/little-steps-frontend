import ChildHeader from "./child-header";

export const ChildrenLayout = ({ children }: { children: React.ReactNode }) => {
  

  return (
    <>
      <ChildHeader  />
      {children}
    </>
  );
};
