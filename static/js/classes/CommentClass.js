import { updateCommentData } from "../utils/updateData/updateCommentData.js";

export class Comment {

    constructor(id, postId, userId, content, date) {
        this.id = id;
        this.post = postId;
        this.user = userId;
        this.content = content;
        this.date = date;
        this.isDeleted = false;
    }

    /**
     * コメントをローカルストレージに反映するメソッド
     */
    addComment() {
        updateCommentData(this);
    }
}