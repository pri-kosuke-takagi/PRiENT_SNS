
/**
 * 新しいコメントデータを引数に取り更新する
 */
export const updateCommentData = async (newCommentData) => {
    let comments = JSON.parse(localStorage.getItem('comments'));

    console.log('This is newCommentData: ', newCommentData);
    console.log('This is comments: ', comments);

    let isCommentExist = false;

    // コメントが存在する場合は、新しいコメントデータでコメントを更新する
    const updateComments = comments.map(comment => {
        if (comment.id === newCommentData.id) {
            isCommentExist = true;
            return newCommentData;
        } else {
            return comment;
        }
    });

    if (!isCommentExist) {
        updateComments.push(newCommentData);
    }

    console.log('This is updateComments: ', updateComments);

    localStorage.setItem('comments', JSON.stringify(updateComments));
}