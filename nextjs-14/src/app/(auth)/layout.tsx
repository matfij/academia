export const metadata = {
    title: 'Next.js',
    description: 'Generated by Next.js',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <h2>Auth Layout</h2>
            <hr />
            {children}
            <hr />
        </main>
    );
}