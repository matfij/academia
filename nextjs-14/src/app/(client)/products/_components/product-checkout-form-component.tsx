'use client';

import { Product } from '@prisma/client';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY } from '../../../../shared/config';
import Image from 'next/image';
import { getImagePath } from '../../../../shared/lib/utils';
import { formatCurrency } from '../../../../shared/lib/formatters';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../../../shared/components/shadcn/card';
import { Button } from '../../../../shared/components/shadcn/button';

const stripe$ = loadStripe(STRIPE_PUBLIC_KEY);

export const ProductCheckoutFormComponent = ({
    product,
    clientSecret,
}: {
    product: Product;
    clientSecret: string;
}) => {
    return (
        <div className="w-max-4xl w-full mx-auto space-y-8">
            <div className="flex gap-4 items-center">
                <figure className="aspect-video flex-shrink-0 w-1/3 relative object-cover">
                    <Image src={getImagePath(product.imagePath)} alt={product.name} fill />
                </figure>
                <section>
                    <p className="text-lg">{formatCurrency(product.price / 100)}</p>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="line-clamp-3 text-muted-foreground">{product.description}</p>
                </section>
            </div>
            <Elements stripe={stripe$} options={{ clientSecret, appearance: { theme: 'flat' } }}>
                <CheckoutForm />
            </Elements>
        </div>
    );
};

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    return (
        <form>
            <Card>
                <CardHeader>
                    <CardTitle>Checkout</CardTitle>
                </CardHeader>
                <CardContent>
                    <PaymentElement />
                </CardContent>
                <CardFooter className="block">
                    <Button className="w-full" disabled={!stripe || !elements}>
                        Purchase
                    </Button>
                    <p className="text-destructive space-y-4">Error</p>
                </CardFooter>
            </Card>
        </form>
    );
};
