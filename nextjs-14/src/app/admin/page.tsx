import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../../shared/components/shadcn/card';

export default function AdminPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCardComponent title="Sales" subtitle="sales" body="sales" />
            <DashboardCardComponent title="Sales" subtitle="sales" body="sales" />
            <DashboardCardComponent title="Sales" subtitle="sales" body="sales" />
            <DashboardCardComponent title="Sales" subtitle="sales" body="sales" />
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
