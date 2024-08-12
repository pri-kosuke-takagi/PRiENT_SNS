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
            timestamp: new Date().getTime(),
            likes: this.likes,
            comments: this.comments
        };

        console.log('This is post from class: ', post);
        return post;
    }

    /**
     * 投稿をHTML要素に変換して表示させるメソッド (ホーム画面)
     */
    createPostElement(user) {
        const isLiked = this.likes.includes(user.id);
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        // Title部分を作成
        const postTitle = document.createElement('div');
        postTitle.classList.add('d-flex', 'align-items-center', 'justify-content-between');
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('fs-4');
        titleDiv.textContent = this.title;
        const postedDate = document.createElement('div');
        postedDate.classList.add('posted-date');
        postedDate.textContent = this.formatDate();
        postTitle.appendChild(titleDiv);
        postTitle.appendChild(postedDate);
        // 画像部分を作成
        const postImage = document.createElement('img');
        if (this.imageUrl) {
            postImage.alt = 'post-image-' + this.id;
            postImage.classList.add('post-image');
            if (typeof this.imageUrl === 'string') {
                postImage.src = this.imageUrl;
            } else {
                console.log('This is imageUrl: ', this.imageUrl);
                // console.log('This is imageUrl: ', URL.createObjectURL(this.imageUrl));
            }
        }
        // 本文部分を作成
        const postContent = document.createElement('p');
        postContent.textContent = this.content;
        // いいねボタン部分を作成
        const likesDiv = document.createElement('div');
        likesDiv.classList.add('likes-div', 'd-flex', 'gap-2');
        const likeButton = document.createElement('div');
        likeButton.classList.add('like-button');
        likeButton.dataset.id = this.id;
        // いいね数が0以上の場合は表示する
        const likesCount = document.createElement('div');
        likesCount.classList.add('likes-count');
        likesCount.textContent = this.likes.length > 0 ? `${this.likes.length} likes` : '';
        // コメント部分を作成
        const commentsDiv = document.createElement('div');
        commentsDiv.classList.add('comments-div');
        const commentButton = document.createElement('button');
        commentButton.classList.add('comment-button');
        commentButton.dataset.id = this.id;
        commentButton.textContent = 'Comment';
        // コメントリストを作成
        const commentsList = document.createElement('ul');
        commentsList.appendChild(document.createElement('h4'));
        commentsList.querySelector('h4').textContent = 'Comments';
        this.comments.forEach(comment => {
            const commentLi = document.createElement('li');
            commentLi.textContent = comment;
            commentsList.appendChild(commentLi);
        });
        commentsDiv.appendChild(commentsList);

        // like-buttonのイベントリスナーを追加する
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

        postDiv.appendChild(postTitle);
        postDiv.appendChild(postImage);
        postDiv.appendChild(postContent);
        likesDiv.appendChild(likeButton);
        likesDiv.appendChild(likesCount);
        postDiv.appendChild(likesDiv);
        postDiv.appendChild(commentButton);
        postDiv.appendChild(commentsDiv);

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
