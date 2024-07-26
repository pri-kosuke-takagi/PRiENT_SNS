class Post {
    constructor(id, author, content, timestamp = new Date()) {
        this.id = id;
        this.author = author;
        this.content = content;
        this.timestamp = timestamp;
        this.likes = 0;
        this.comments = [];
    }

    addLike() {
        this.likes += 1;
    }

    removeLike() {
        if (this.likes > 0) {
            this.likes -= 1;
        }
    }

    addComment(comment) {
        this.comments.push(comment);
    }

    removeComment(commentId) {
        this.comments = this.comments.filter(c => c.id !== commentId);
    }

    getPostDetails() {
        return {
            id: this.id,
            author: this.author,
            content: this.content,
            timestamp: this.timestamp,
            likes: this.likes,
            comments: this.comments
        };
    }
}
