import { notFound } from 'next/navigation';

export default function DocsPage({ params }: { params: { slug: string[] } }) {
    if (!params.slug) {
        notFound();
    }
    if (params.slug.length === 2) {
        return (
            <h2>
                View docs for feature {params.slug[0]} and concept {params.slug[1]}
            </h2>
        );
    } else if (params.slug.length === 1) {
        return <h2>View docs for feature {params.slug[0]}</h2>;
    }
    return <h1>Docs Home Page</h1>;
}
