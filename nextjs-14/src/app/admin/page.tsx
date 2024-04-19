import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../../shared/components/shadcn/card';
import { formatCurrency, formatNumber } from '../../shared/lib/formatters';
import { AdminManager } from './admin-manager';

export default async function AdminPage() {
    const [salesData, userData, productData] = await Promise.all([
        AdminManager.getSalesData(),
        AdminManager.getUserData(),
        AdminManager.getProductData(),
    ]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCardComponent
                title="Sales"
                subtitle={`No. sales: ${formatNumber(salesData.noSales)}`}
                body={`Total amount: ${formatCurrency(salesData.amount)}`}
            />
            <DashboardCardComponent
                title="Customers"
                subtitle={`No. customers: ${formatNumber(userData.noUsers)}`}
                body={`Average value: ${formatCurrency(userData.avgValPerUser)}`}
            />
            <DashboardCardComponent
                title="Products"
                subtitle={`No. inactive products: ${formatNumber(productData.noActive)}`}
                body={`No. active products: ${formatCurrency(productData.noInactive)}`}
            />
        </div>
    );
}

function DashboardCardComponent({
    title,
    subtitle,
    body,
}: {
    title: string;
    subtitle: string;
    body: string;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{body}</p>
            </CardContent>
        </Card>
    );
}
