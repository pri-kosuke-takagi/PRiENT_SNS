export class Post {
    constructor(id, author, title, content, imageUrl, timestamp, likes, comments) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.timestamp = timestamp;
        this.likes = likes;
        this.comments = comments;
    }

    /**
     * 投稿をHTML要素に変換して表示させるメソッド (ホーム画面)
     */
    createPostElement() {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <h3>${this.title}</h3>
            <p>${this.content}</p>
            <img src="${this.imageUrl}" alt="post-image" />
            <p>${this.formatDate()}</p>
            <p>${this.likes} likes</p>
            <button class="like-button" data-id="${this.id}">Like</button>
            <button class="comment-button" data-id="${this.id}">Comment</button>
            <div class="comments-div">
                <h4>Comments</h4>
                <ul>
                    ${this.comments.map(comment =>
                        `<li>${comment}</li>`
                    ).join('')}
                </ul>
            </div>
        `;

        return postDiv;
    }

    /**
     * Timestampのフォーマットをyyyy年MM月dd日 HH時mm分に変換するメソッド
     */
    formatDate() {
        const date = new Date(Number(this.timestamp));
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${year}年${month}月${day}日 ${hours}時${minutes}分`;
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
