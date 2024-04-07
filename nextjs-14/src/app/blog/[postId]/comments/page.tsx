export default function PostDetailPage({ params }: { params: { postId: string } }) {
    return (
        <>
            <h1>Post Comments</h1>
            <p>Post id: {params.postId}</p>
        </>
    );
}
