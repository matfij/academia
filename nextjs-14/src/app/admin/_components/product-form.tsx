'use client';

import { useState } from 'react';
import { formatCurrency } from '../../../shared/lib/formatters';
import { Input } from '../../../shared/components/shadcn/input';
import { Label } from '../../../shared/components/shadcn/label';
import { Textarea } from '../../../shared/components/shadcn/textarea';
import { Button } from '../../../shared/components/shadcn/button';
import { addProduct } from '../_actions/product-actions';

export default function ProductFormComponent() {
    const [price, setPrice] = useState<number>(0);

    return (
        <form action={addProduct} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Price [cents]</Label>
                <Input
                    id="name"
                    name="name"
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
                <div className="text-muted-foreground">{formatCurrency(price / 100)}</div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Description</Label>
                <Textarea id="description" name="description" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">File</Label>
                <Input id="file" name="file" type="file" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Image</Label>
                <Input id="image" name="image" type="file" required />
            </div>
            <Button type="submit">Save</Button>
        </form>
    );
}
