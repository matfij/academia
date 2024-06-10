'use server';

import { prisma } from '../../shared/db/db-client';

export const userOrderExists = async (email: string, productId: string) => {
    const order = prisma.order.findFirst({ where: { user: { email }, productId }, select: { id: true } });
    return !!order;
};
