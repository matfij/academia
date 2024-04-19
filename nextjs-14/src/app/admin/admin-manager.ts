import { prisma } from '../../shared/db/db-client';
import { wait } from '../../shared/lib/utils';

export class AdminManager {
    public static async getSalesData() {
        const data = await prisma.order.aggregate({
            _sum: { pricePaid: true },
            _count: true,
        });
        await wait(1000);
        return {
            amount: (data._sum.pricePaid ?? 0) / 100,
            noSales: data._count,
        };
    }

    public static async getUserData() {
        const [noUsers, orderData] = await Promise.all([
            prisma.user.count(),
            prisma.order.aggregate({
                _sum: { pricePaid: true },
            }),
        ]);
        await wait(1000);
        const avgValPerUser = noUsers === 0 ? 0 : (orderData._sum.pricePaid ?? 0) / noUsers;
        return {
            noUsers,
            avgValPerUser,
        };
    }

    public static async getProductData() {
        const [noActive, noInactive] = await Promise.all([
            prisma.product.count({ where: { available: true } }),
            prisma.product.count({ where: { available: false } }),
        ]);
        await wait(1000);
        return {
            noActive,
            noInactive,
        };
    }
}
