import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../shared/db/db-client';

export async function GET(req: NextRequest, params: { params: { downloadVerificationId: string } }) {
    const data = await prisma.downloadVerification.findUnique({
        where: { id: params.params.downloadVerificationId, expiresAt: { gt: new Date() } },
        select: { product: { select: { filePath: true, name: true } } },
    });
    if (!data) {
        return NextResponse.redirect(new URL('/products/download/expired'));
    }
    
    const { size } = await fs.stat(data.product.filePath);
    const file = await fs.readFile(data.product.filePath);
    const extension = data.product.filePath.split('.').pop();

    return new NextResponse(file, {
        headers: {
            'Content-Disposition': `attachment; filename="${data.product.name}.${extension}"`,
            'Content-Length': size.toString(),
        },
    });
}
