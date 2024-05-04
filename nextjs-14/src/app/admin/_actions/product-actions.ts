'use server';

import fs from 'fs/promises';
import { prisma } from '../../../shared/db/db-client';
import { ProductEditSchema, ProductNewSchema } from '../_models/product-models';
import { notFound, redirect } from 'next/navigation';
import { wait } from '../../../shared/lib/utils';
import { revalidatePath } from 'next/cache';

const revalidateClientProducts = () => {
    revalidatePath('/');
    revalidatePath('/products');
};

export const addProduct = async (_prev: unknown, formData: FormData) => {
    await wait(1000);

    const result = ProductNewSchema.safeParse(Object.fromEntries(formData.entries()));
    if (result.success === false) {
        return result.error.formErrors.fieldErrors;
    }
    const data = result.data;

    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

    const imagePath = `public/products/${crypto.randomUUID()}-${result.data.image.name}`;
    await fs.writeFile(imagePath, Buffer.from(await data.image.arrayBuffer()));

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

    revalidateClientProducts();
    redirect('/admin/products');
};

export const editProduct = async (id: string, _prev: unknown, formData: FormData) => {
    await wait(1000);

    const result = ProductEditSchema.safeParse(Object.fromEntries(formData.entries()));
    if (result.success === false) {
        return result.error.formErrors.fieldErrors;
    }
    const data = result.data;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
        return notFound();
    }

    let filePath = product.filePath;
    if (data.file && data.file.size > 0) {
        await fs.unlink(product.filePath);
        filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
        await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
    }

    let imagePath = product.imagePath;
    if (data.image && data.image.size > 0) {
        imagePath = `public/products/${crypto.randomUUID()}-${data.image.name}`;
        await fs.writeFile(imagePath, Buffer.from(await data.image.arrayBuffer()));
    }

    await prisma.product.update({
        where: { id },
        data: {
            name: data.name,
            price: data.price,
            description: data.description,
            filePath,
            imagePath,
        },
    });

    revalidateClientProducts();
    redirect('/admin/products');
};

export const toggleProductAvailability = async ({
    id,
    isAvailable,
}: {
    id: string;
    isAvailable: boolean;
}) => {
    await prisma.product.update({ where: { id }, data: { available: isAvailable } });

    revalidateClientProducts();
};

export const deleteProduct = async ({ id }: { id: string }) => {
    const product = await prisma.product.delete({ where: { id } });
    if (!product) {
        return notFound();
    }

    await fs.unlink(product.filePath);
    await fs.unlink(product.imagePath);

    revalidateClientProducts();
};
