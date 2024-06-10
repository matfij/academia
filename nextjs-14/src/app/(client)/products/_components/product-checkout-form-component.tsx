'use client';

import { Product } from '@prisma/client';
import {
    Elements,
    LinkAuthenticationElement,
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PUBLIC_URL, STRIPE_PUBLIC_KEY } from '../../../../shared/config';
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
import { FormEvent, useState } from 'react';
import { userOrderExists } from '../../../actions/orders';

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
                <CheckoutForm product={product} />
            </Elements>
        </div>
    );
};

const CheckoutForm = ({ product }: { product: Product }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        if (email && (await userOrderExists(email, product.id))) {
            setErrorMessage('Product already owned, check "My Orders"');
        }
        setLoading(true);
        stripe
            .confirmPayment({
                elements,
                confirmParams: { return_url: `${PUBLIC_URL}/stripe/purchase-success` },
            })
            .then(({ error }) => {
                if (error.type === 'card_error' || error.type === 'validation_error') {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage('Unknown error, please try again later');
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Checkout</CardTitle>
                </CardHeader>
                <CardContent>
                    <PaymentElement />
                    <div className="mt-2" />
                    <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
                </CardContent>
                <CardFooter className="block">
                    <Button className="w-full" disabled={!stripe || !elements || loading}>
                        Purchase
                    </Button>
                    {errorMessage && <p className="text-destructive mt-2">{errorMessage}</p>}
                </CardFooter>
            </Card>
        </form>
    );
};
