import { prisma } from '../../../../../shared/db/db-client';
import PageHeaderComponent from '../../../_components/page-header';
import ProductFormComponent from '../../../_components/product-form';

export default async function AdminProductEditPage({ params: { id } }: { params: { id: string } }) {
    const product = await prisma.product.findUnique({ where: { id } });

    return (
        <>
            <PageHeaderComponent>Edit Product</PageHeaderComponent>
            <ProductFormComponent product={product} />
        </>
    );
}
