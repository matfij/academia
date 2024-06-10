import Image from 'next/image';
import { getEnvVar, getImagePath } from '../../../../shared/lib/utils';
import Stripe from 'stripe';
import { useMemo } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '../../../../shared/db/db-client';
import { formatCurrency } from '../../../../shared/lib/formatters';
import { Button } from '../../../../shared/components/shadcn/button';
import Link from 'next/link';

const stripe = new Stripe(getEnvVar<string>('STRIPE_SECRET_KEY'));

export default async function StripePurchaseSuccessPage({
    searchParams,
}: {
    searchParams: { payment_intent: string };
}) {
    const paymentIntent = await useMemo(
        async () => await stripe.paymentIntents.retrieve(searchParams.payment_intent),
        [searchParams.payment_intent],
    );
    if (!paymentIntent.metadata.productId) {
        return notFound();
    }

    const product = await prisma.product.findUnique({ where: { id: paymentIntent.metadata.productId } });
    if (!product) {
        return notFound();
    }

    const isSuccess = paymentIntent.status === 'succeeded';

    return (
        <div className="w-max-4xl w-full mx-auto space-y-8">
            <h1 className="text-3xl font-bold">{isSuccess ? 'Purchase completed' : 'Purchase error'}</h1>
            <div className="flex gap-4 items-center">
                <figure className="aspect-video flex-shrink-0 w-1/3 relative object-cover">
                    <Image src={getImagePath(product.imagePath)} alt={product.name} fill />
                </figure>
                <section>
                    <p className="text-lg">{formatCurrency(product.price / 100)}</p>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="line-clamp-3 text-muted-foreground">{product.description}</p>
                </section>
                <Button className="mt-4" size="lg" asChild>
                    {isSuccess ? <a></a> : <Link href={`/products/${product.id}/purchase`}>Try Again</Link>}
                </Button>
            </div>
        </div>
    );
}
