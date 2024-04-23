import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import { prisma } from '../../../../../shared/db/db-client';

export const GET = async (req: NextRequest, { params: { id } }: { params: { id: string } }) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
        return notFound();
    }

    const { size } = await fs.stat(product.filePath);
    const file = await fs.readFile(product.filePath);
    const extension = product.filePath.split('.').pop();

    return new NextResponse(file, {
        headers: {
            'Content-Disposition': `attachment; filename="${product.name}.${extension}"`,
            'Content-Length': size.toString(),
        },
    });
};
