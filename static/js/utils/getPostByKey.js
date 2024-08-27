import { Post } from "/static/js/classes/PostClass.js";

/**
 * Post(投稿)オブジェクトを指定されたKeyから取得する。
 * @param {string} value - 取得したいPostの値
 * @param {string} key - 取得したいPostのキー
 * @param {boolean} isGetttingClassifiedPost - classifiedPostを取得するかどうか
 * @param posts - 投稿データ
 */
export const getPostByKey = (value, key, posts, isGetttingClassifiedPost = false) => {
    const post = posts.find(p => p[key] === value);
    if (!isGetttingClassifiedPost) {
        return post;
    } else {
        return new Post(post.id, post.author, post.title, post.content, post.imageUrl, post.timestamp, post.likes, post.comments);
    }
}