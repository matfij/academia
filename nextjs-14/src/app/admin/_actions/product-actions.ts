'use server';

import fs from 'fs/promises';
import { prisma } from '../../../shared/db/db-client';
import { ProductNewSchema } from '../_models/product-models';
import { redirect } from 'next/navigation';
import { wait } from '../../../shared/lib/utils';

export const addProduct = async (_prev: unknown, formData: FormData) => {
    await wait(1000);

    const result = ProductNewSchema.safeParse(Object.fromEntries(formData.entries()));
    if (result.success === false) {
        return result.error.formErrors.fieldErrors;
    }
    const data = result.data;

    await fs.mkdir('products', { recursive: true });
    const filePath = `products/${crypto.randomUUID()}-${result.data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

    await fs.mkdir('public/products', { recursive: true });
    const imagePath = `public/products/${crypto.randomUUID()}-${result.data.file.name}`;
    await fs.writeFile(imagePath, Buffer.from(await data.file.arrayBuffer()));

    await prisma.product.create({
        data: {
            name: data.name,
            price: data.price,
            description: data.description,
            filePath,
            imagePath,
            available: false,
        },
    });

    redirect('/admin/products');
};
