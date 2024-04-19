import { NavComponent, NavLink } from '../../shared/components/nav-component';

// don't cache admin pages
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavComponent>
                <NavLink href={'/admin'}>Dashboard</NavLink>
                <NavLink href={'/admin/products'}>Products</NavLink>
                <NavLink href={'admin/users'}>Users</NavLink>
                <NavLink href={'admin/orders'}>Orders</NavLink>
            </NavComponent>
            <main className="container my-6">{children}</main>
        </>
    );
}
