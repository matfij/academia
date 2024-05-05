import { notFound } from 'next/navigation';
import { prisma } from '../../../../../shared/db/db-client';
import Stripe from 'stripe';
import { getEnvVar } from '../../../../../shared/lib/utils';
import { ProductCheckoutFormComponent } from '../../_components/product-checkout-form-component';

const stripe = new Stripe(getEnvVar<string>('STRIPE_SECRET_KEY'));

export default async function ProductPurchasePage({ params: { id } }: { params: { id: string } }) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        return notFound();
    }

    const intent = await stripe.paymentIntents.create({
        amount: product.price,
        currency: 'EUR',
        metadata: { productId: product.id },
    });

    if (!intent.client_secret) {
        throw new Error('Stripe failed, try again later');
    }

    return <ProductCheckoutFormComponent product={product} clientSecret={intent.client_secret} />;
}
