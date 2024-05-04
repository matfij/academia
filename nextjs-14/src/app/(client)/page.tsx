import { Product } from '@prisma/client';
import { prisma } from '../../shared/db/db-client';
import { Button } from '../../shared/components/shadcn/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
    ProductCardComponent,
    ProductCardSkeletonComponent,
} from '../../shared/components/product-card-component';
import { wait } from '../../shared/lib/utils';
import { Suspense } from 'react';
import { cache } from '../../shared/lib/cacher';

const getMostPopularProducts = cache(
    async () => {
        await wait(1000);
        return prisma.product.findMany({ orderBy: { orders: { _count: 'desc' } }, take: 3 });
    },
    ['/', 'getMostPopularProducts'],
    { revalidate: 60 * 60 * 24 },
);

const getLatestProducts = cache(
    async () => {
        await wait(1000);
        return prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 3 });
    },
    ['/', 'getLatestProducts'],
    { revalidate: 60 * 60 * 24 },
);

export default function HomePage() {
    return (
        <section className="space-y-4">
            <ProductGridSection title="Latest" productFetcher={getLatestProducts} />
            <ProductGridSection title="Hot" productFetcher={getMostPopularProducts} />
        </section>
    );
}

const ProductGridSection = async ({
    title,
    productFetcher,
}: {
    title: string;
    productFetcher: () => Promise<Product[]>;
}) => {
    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <h2 className="text-3xl font-bold">{title}</h2>
                <Button asChild variant="outline">
                    <Link href="/products">
                        <span>See All</span>
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Suspense
                    fallback={
                        <>
                            <ProductCardSkeletonComponent />
                            <ProductCardSkeletonComponent />
                            <ProductCardSkeletonComponent />
                        </>
                    }>
                    <ProductSuspense productFetcher={productFetcher} />
                </Suspense>
            </div>
        </div>
    );
};

const ProductSuspense = async ({ productFetcher }: { productFetcher: () => Promise<Product[]> }) => {
    return (
        <>
            {(await productFetcher()).map((product) => (
                <ProductCardComponent key={product.id} {...product} />
            ))}
        </>
    );
};
