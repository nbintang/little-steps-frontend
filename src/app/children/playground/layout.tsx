import { ChildrenLayout } from "@/features/children/components/children-layout";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <ChildrenLayout>
            {children}
        </ChildrenLayout>
    );
}