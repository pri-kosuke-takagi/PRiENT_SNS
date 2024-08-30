/**
 * 新しいPostデータを引数に取りユーザデータを更新する
 */
export const updatePostData = (newPostData) => {
    let posts = JSON.parse(localStorage.getItem('posts'));
    // ユーザが存在する場合は、新しいユーザデータでユーザを更新する
    const updatePosts = posts.map(post => {
        if (post.id === newPostData.id) {
            return newPostData;
        } else {
            return post;
        }
    });

    if (!updatePosts.find(post => post.id === newPostData.id)) {
        updatePosts.push(newPostData);
    }

    localStorage.setItem('posts', JSON.stringify(updatePosts));
}