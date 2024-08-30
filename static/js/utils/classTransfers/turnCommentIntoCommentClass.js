import { Comment } from "../../classes/CommentClass.js";

/**
 * コメントオブジェクトを `Comment` クラスに変換する
 */
export const turnCommentIntoCommentClass = (comment) => {
    return new Comment(comment.id, comment.post, comment.user, comment.content, comment.date);
}