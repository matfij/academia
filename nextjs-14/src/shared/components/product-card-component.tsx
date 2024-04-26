import { Product } from '@prisma/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './shadcn/card';
import { Button } from './shadcn/button';
import Link from 'next/link';
import Image from 'next/image';
import { getImagePath } from '../lib/utils';
import { formatCurrency } from '../lib/formatters';

export function ProductCardComponent(product: Product) {
    return (
        <Card className="flex overflow-hidden flex-col">
            <div className="relative w-full h-auto aspect-video">
                <Image src={getImagePath(product.imagePath)} alt={product.name} fill />
            </div>
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{formatCurrency(product.price / 100)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="line-clamp-3">{product.description}</p>
            </CardContent>
            <CardFooter>
                <Button asChild size="lg" className="w-full">
                    <Link href={`/products/${product.id}/purchase`}>Purchase</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
