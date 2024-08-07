import { Suspense } from 'react';
import {
    ProductCardComponent,
    ProductCardSkeletonComponent,
} from '../../../shared/components/product-card-component';
import { prisma } from '../../../shared/db/db-client';
import { wait } from '../../../shared/lib/utils';
import { cache } from '../../../shared/lib/cacher';

export default function ProductsPages() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg-grid-cols-3 gap-4">
            <Suspense
                fallback={
                    <>
                        <ProductCardSkeletonComponent />
                        <ProductCardSkeletonComponent />
                        <ProductCardSkeletonComponent />
                        <ProductCardSkeletonComponent />
                        <ProductCardSkeletonComponent />
                        <ProductCardSkeletonComponent />
                    </>
                }>
                <ProductsSuspense />
            </Suspense>
        </div>
    );
}

const getProducts = cache(async () => {
    await wait(1000);
    return prisma.product.findMany({ where: { available: true }, orderBy: { createdAt: 'desc' } });
}, ['/products', 'getProducts']);

const ProductsSuspense = async () => {
    const products = await getProducts();
    return products.map((product) => <ProductCardComponent key={product.id} {...product} />);
};
