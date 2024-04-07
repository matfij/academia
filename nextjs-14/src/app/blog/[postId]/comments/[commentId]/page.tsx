export default function PostDetailPage({ params }: { params: { postId: string, commentId: string } }) {
    return (
        <>
            <h1>Post Comment Detail</h1>
            <p>Post id: {params.postId}</p>
            <p>Comment id: {params.commentId}</p>
        </>
    );
}
