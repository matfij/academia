import Link from 'next/link';
import { Button } from '../../../shared/components/shadcn/button';
import PageHeaderComponent from '../_components/page-header';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../shared/components/shadcn/table';
import { prisma } from '../../../shared/db/db-client';
import { CheckCircle, MoreVertical, XCircle } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../../shared/lib/formatters';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../../shared/components/shadcn/dropdown-menu';
import { ProductActionActivateComponent, ProductActionDeleteComponent } from '../_components/product-actions';

export default async function AdminProductsPage() {
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
                    <ProductTableComponent />
                </TableBody>
            </Table>
        </>
    );
}

async function ProductTableComponent() {
    const products = await prisma.product.findMany({
        select: { id: true, name: true, price: true, available: true, _count: { select: { orders: true } } },
        orderBy: { createdAt: 'desc' },
    });

    if (products.length === 0) {
        return (
            <TableRow>
                <TableCell></TableCell>
                <TableCell>No Products</TableCell>
            </TableRow>
        );
    }

    return products.map((product) => (
        <TableRow key={product.id}>
            <TableCell>
                {product.available ? (
                    <>
                        <span className="sr-only">Available</span>
                        <CheckCircle />
                    </>
                ) : (
                    <>
                        <span className="sr-only">Unavailable</span>
                        <XCircle />
                    </>
                )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formatCurrency(product.price / 100)}</TableCell>
            <TableCell>{formatNumber(product._count.orders)}</TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <span className="sr-only"></span>
                        <MoreVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <a download href={`/admin/products/${product.id}/download`}>
                                Download
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <ProductActionActivateComponent id={product.id} isAvailable={product.available} />
                        <DropdownMenuSeparator />
                        <ProductActionDeleteComponent id={product.id} disabled={product._count.orders > 0} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    ));
}
