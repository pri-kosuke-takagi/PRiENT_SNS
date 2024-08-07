import { updatePostData } from "/static/js/utils/updatePostData.js";
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
     * 投稿された時に呼び出されるメソッド
     */
    createPost() {
        const post = {
            id: this.id,
            author: this.author,
            title: this.title,
            content: this.content,
            imageUrl: this.imageUrl,
            timestamp: this.timestamp,
            likes: this.likes,
            comments: this.comments
        };

        console.log('This is post: ', post);
        return post;
    }

    /**
     * 投稿をHTML要素に変換して表示させるメソッド (ホーム画面)
     */
    createPostElement(user) {
        const isLiked = this.likes.includes(user.id);
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                <div class="fs-4">${this.title}</div>
                <div class="posted-date">${this.formatDate()}</div>
            </div>
            <img src="${this.imageUrl}" alt="post-image" class="post-image" />
            <p>${this.content}</p>
            <div class="likes-div d-flex gap-2">
                <div class="like-button" data-id="${this.id}"></div>
                ${this.likes.length > 0 ? `<div class="likes-count">${this.likes.length} likes</div>` : ''}
            </div>
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
        // like-buttonのイベントリスナーを追加する
        const likeButton = postDiv.querySelector('.like-button');
        const likeHeart = document.createElement('i');
        if (isLiked) {
            likeButton.classList.add('liked');
            likeHeart.classList.add('fa-solid', 'fa-heart');
        } else {
            likeButton.classList.remove('liked');
            likeHeart.classList.add('fa-regular', 'fa-heart');
        }
        likeButton.appendChild(likeHeart);
        likeButton.addEventListener('click', async () => {
            if (isLiked) {
                likeButton.classList.remove('liked');
                likeHeart.classList.remove('fa-solid');
                likeHeart.classList.add('fa-regular');
                this.removeLike(user.id);
            } else {
                likeButton.classList.add('liked');
                likeHeart.classList.remove('fa-regular');
                likeHeart.classList.add('fa-solid');
                this.addLike(user.id);
            }
        });

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

    addLike(userId) {
        if (!this.likes.includes(userId)) {
            this.likes.push(userId);
        }
        console.log(`The post ${this.id} has been updated on addLike:`, this);
        updatePostData(this);
        window.location.reload();
    }

    removeLike(userId) {
        this.likes = this.likes.filter(id => id !== userId);
        console.log(`The post ${this.id} has been updated on removeLike:`, this);
        updatePostData(this);
        window.location.reload();
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
