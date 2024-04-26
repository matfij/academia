import { NavComponent, NavLink } from '../../shared/components/nav-component';

export const dynamic = 'force-dynamic';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavComponent>
                <NavLink href={'/'}>Home</NavLink>
                <NavLink href={'/products'}>Products</NavLink>
                <NavLink href={'/orders'}>My Orders</NavLink>
            </NavComponent>
            <main className="container my-6">{children}</main>
        </>
    );
}
