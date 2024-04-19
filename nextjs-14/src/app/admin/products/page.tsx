import Link from 'next/link';
import { Button } from '../../../shared/components/shadcn/button';
import PageHeaderComponent from '../_components/page-header';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../../shared/components/shadcn/table';

export default function AdminProductsPage() {
    return (
        <>
            <div className="flex justify-between items-center gap-4">
                <PageHeaderComponent>Products</PageHeaderComponent>
                <Button>
                    <Link href="/admin/products/new">Add Product</Link>
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-0">
                            <span className="sr-only">Available for purchase</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead className="w-0">
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                </TableBody>
            </Table>
        </>
    );
}
