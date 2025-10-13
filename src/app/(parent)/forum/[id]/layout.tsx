export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section className="max-w-4xl min-h-screen mx-auto ">
            {children}
        </section>
    );
}