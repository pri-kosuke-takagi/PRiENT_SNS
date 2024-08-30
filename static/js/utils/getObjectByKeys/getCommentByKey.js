import { turnCommentIntoCommentClass } from "../classTransfers/turnCommentIntoCommentClass.js";

/**
 * コメントオブジェクトを指定されたKeyから取得する。
 * @param {string} value - 取得したいコメントの値
 * @param {string} key - 取得したいコメントのキー
 * @param {boolean} isGetttingClassifiedComment - classifiedされたオブジェクトを取得するかどうか
 */
export const getCommentByKey = (value, key, isGetttingClassifiedComment = false) => {
    const comments = JSON.parse(localStorage.getItem('comments'));
    const comment = comments.find(c => c[key] === value);
    if (!isGetttingClassifiedComment) {
        return comment;
    } else {
        return turnCommentIntoCommentClass(comment);
    }
}