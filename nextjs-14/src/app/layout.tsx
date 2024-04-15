import '../shared/styles/globals.css';
import { Inter } from 'next/font/google';
import { cn } from '../shared/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
    title: 'Next 14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={cn('bg-background min-h-screen font-sans antialiased', inter.variable)}>
                {children}
            </body>
        </html>
    );
}
