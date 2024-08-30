
export const fetchCommentSampleData = async () => {
    const response = await fetch('/data/comments.json');
    const data = await response.json();
    return data;
}