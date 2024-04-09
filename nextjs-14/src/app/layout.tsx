export const metadata = {
    title: 'Next 14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}

const Header = () => {
    return (
        <header>
            Header
            <hr />
        </header>
    );
};

const Footer = () => {
    return (
        <footer>
            <hr />
            Footer
        </footer>
    );
};
