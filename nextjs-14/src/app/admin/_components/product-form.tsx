'use client';

import { useState } from 'react';
import { formatCurrency } from '../../../shared/lib/formatters';
import { Input } from '../../../shared/components/shadcn/input';
import { Label } from '../../../shared/components/shadcn/label';
import { Textarea } from '../../../shared/components/shadcn/textarea';
import { Button } from '../../../shared/components/shadcn/button';
import { addProduct, editProduct } from '../_actions/product-actions';
import { useFormState, useFormStatus } from 'react-dom';
import { Product } from '@prisma/client';
import Image from 'next/image';
import { getImagePath } from '../../../shared/lib/utils';

export default function ProductFormComponent({ product }: { product: Product | null }) {
    const [price, setPrice] = useState<number | undefined>(product?.price);
    const { pending } = useFormStatus();
    const [error, action] = useFormState(product ? editProduct.bind(null, product.id) : addProduct, {});

    return (
        <form action={action} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input defaultValue={product?.name} id="name" name="name" type="text" required />
                {error.name && <p className="text-destructive">{error.name}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Price [cents]</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
                <div className="text-muted-foreground">{formatCurrency((price ?? 0) / 100)}</div>
                {error.price && <p className="text-destructive">{error.price}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Description</Label>
                <Textarea defaultValue={product?.description} id="description" name="description" required />
                {error.description && <p className="text-destructive">{error.description}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">File</Label>
                <Input id="file" name="file" type="file" required={!product} />
                {error.file && <p className="text-destructive">{error.file}</p>}
                {product && <p className="text-muted-foreground">{product.filePath}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Image</Label>
                <Input id="image" name="image" type="file" required={!product} />
                {error.image && <p className="text-destructive">{error.image}</p>}
                {product && (
                    <Image
                        src={getImagePath(product.imagePath)}
                        height={200}
                        width={200}
                        alt={product.name}
                    />
                )}
            </div>
            <Button disabled={pending} type="submit">
                {pending ? 'Saving...' : 'Save'}
            </Button>
        </form>
    );
}
