import { updatePostData } from "/static/js/utils/updateData/updatePostData.js";
import { User } from "./UserClass.js";
import { updateUserData } from "../utils/updateData/updateUserData.js";
import { turnCommentIntoCommentClass } from "../utils/classTransfers/turnCommentIntoCommentClass.js";
import { getUserByKey } from "../utils/getObjectByKeys/getUserByKey.js";
import { getCommentByKey } from "../utils/getObjectByKeys/getCommentByKey.js";

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
     * 投稿が作成された時に呼び出されるメソッド
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
    createPostElement(loggedInUser, user, comments) {
        const isLiked = this.likes.includes(loggedInUser.id);
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        // Title部分を作成
        const postTitle = this.createDivForTitle();
        // const postTitle = document.createElement('div');
        // postTitle.classList.add('d-flex', 'align-items-center', 'justify-content-between');
        // const titleDiv = document.createElement('div');
        // titleDiv.classList.add('fs-4');
        // titleDiv.textContent = this.title;
        // const postedDate = document.createElement('div');
        // postedDate.classList.add('posted-date');
        // postedDate.textContent = this.formatDate();
        // postTitle.appendChild(titleDiv);
        // postTitle.appendChild(postedDate);

        // 画像部分を作成
        const postImage = document.createElement('img');
        if (this.imageUrl) {
            this.insertImageToElement(postImage, this.imageUrl);
        }

        // 本文部分を作成
        const postContent = document.createElement('p');
        postContent.textContent = this.content;

        // いいねと一時保存を格納するDivを作成
        const likesAndSaveDiv = document.createElement('div');
        likesAndSaveDiv.classList.add('likes-div', 'd-flex', 'gap-2');

        // いいねボタン部分を作成
        const likeButton = this.createLikeButton(loggedInUser, isLiked);

        // いいね数が0より大きい場合は表示する
        const likesCount = this.createLikeCountElement(isLiked);

        // 一時保存ボタンを作成する
        const saveButton = document.createElement('button');
        saveButton.classList.add('save-button');
        saveButton.textContent = (loggedInUser.savedPosts && loggedInUser.savedPosts.includes(this.id)) ? '保存済み' : '保存する';

        // 一時保存ボタンのイベントリスナーを追加する
        saveButton.addEventListener('click', () => {
            console.log('This is user before savePost: ', loggedInUser);
            if (saveButton.textContent === '保存済み') {
                saveButton.textContent = '保存する';
                loggedInUser = this.unsavePost(loggedInUser);
            } else {
                saveButton.textContent = '保存済み';
                loggedInUser = this.savePost(loggedInUser);
            }
            console.log('This is user after savePost: ', loggedInUser);
        });

        likesAndSaveDiv.appendChild(likeButton);
        likesAndSaveDiv.appendChild(likesCount);
        likesAndSaveDiv.appendChild(saveButton);

        // コメント部分を作成
        const commentsDiv = this.createDivForComments(loggedInUser, user, comments);

        postDiv.appendChild(postTitle);
        postDiv.appendChild(postImage);
        postDiv.appendChild(postContent);
        postDiv.appendChild(likesAndSaveDiv);
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

    savePost(user) {
        if (!user.savedPosts.includes(this.id)) {
            user.savedPosts.push(this.id);
            updateUserData(user);
            return user;
        } else {
            return user;
        }
    }

    unsavePost(user) {
        user.savedPosts = user.savedPosts.filter(p => p !== this.id);
        updateUserData(user);
        return user;
    }

    /**
     * 投稿をHTML要素に変換して表示させるメソッド (保存一覧画面用)
     */
    createSavedPostElement(loggedInUser, user, comments, postCard) {
        const isLiked = this.likes.includes(user.id);
        const postDiv = document.createElement('div');
        postDiv.classList.add(['post']);

        // Title部分を作成
        const postTitle = this.createDivForTitle();

        // 画像部分を作成
        const postImage = document.createElement('img');
        if (this.imageUrl) {
            this.insertImageToElement(postImage, this.imageUrl);
        }

        // 本文部分を作成
        const postContent = document.createElement('p');
        postContent.textContent = this.content;

        // いいねと保存ボタンを格納するDiv
        const likesAndSaveDiv = document.createElement('div');
        likesAndSaveDiv.classList.add('likes-div', 'd-flex', 'gap-2');

        // いいねボタン部分を作成
        const likeButton = this.createLikeButton(loggedInUser, isLiked);

        // いいね数が0より大きい場合は表示する
        const likesCount = this.createLikeCountElement(isLiked);

        // 一時保存ボタンを作成する
        const saveButton = document.createElement('button');
        saveButton.classList.add('save-button');
        saveButton.textContent = '保存一覧から削除';

        // 押されたら該当のPostが表示されないようにする。
        saveButton.addEventListener('click', () => {
            console.log('This is user: ', user);

            saveButton.textContent = '保存する';

            user = this.unsavePost(user);

            // postCard は、ユーザプロファイルと本post用divを含むdiv。
            postCard.classList.add('d-none');
            console.log('This is user after savePost: ', user);
        });

        likesAndSaveDiv.appendChild(likeButton);
        likesAndSaveDiv.appendChild(likesCount);
        likesAndSaveDiv.appendChild(saveButton);

        // コメント部分を作成
        const commentsDiv = this.createDivForComments(loggedInUser, user, comments);

        postDiv.appendChild(postTitle);
        postDiv.appendChild(postImage);
        postDiv.appendChild(postContent);
        postDiv.appendChild(likesAndSaveDiv);
        postDiv.appendChild(commentsDiv);

        return postDiv;
    }

    /**
     * imgの引数をstringかどうかを判断して、eleで渡されたエレメントに挿入する。
     * imgはBuffer形式のstringかリンクになる想定。
     */
    insertImageToElement(ele, img) {
        ele.alt = 'post-image-' + this.id;
        ele.classList.add('post-image');
        if (typeof img === 'string') {
            ele.src = img;
        } else {
            console.log('This is imageUrl (isnnot string): ', img);
        }
    }

    /**
     * コメントのDivを作成する
     * @param {Object} loggedInUser ログインしているユーザ
     * @param {Object} user 各ポストごとのユーザ
     * @param {Array} comments コメントリスト
     */
    createDivForComments(loggedInUser, user, comments) {
        const commentsDiv = document.createElement('div');
        commentsDiv.classList.add('comments-div');

        // コメントタイトルを作成
        const commentTitle = document.createElement('div')
        commentTitle.textContent = 'コメント';

        // コメントリストを作成
        const commentsList = document.createElement('ul');
        commentsList.classList.add('comments-list-' + this.id, 'd-none');
        this.makeArrayOfCommentsCommentLists(comments, commentsList);

        // コメントリストにコメントを追加するためのtextarea要素を作成
        const commentInput = this.createCommentInput();
        commentsList.appendChild(commentInput);

        // コメントタイトルをクリックしたら、コメントリストを表示するように。
        commentTitle.classList.add('comment-title-' + this.id);
        commentTitle.addEventListener('click', () => {
            commentsList.classList.toggle('d-none');
        })

        // コメントボタンを作成
        const commentButton = this.createCommentButton(loggedInUser, comments);

        commentsDiv.appendChild(commentTitle);
        commentsDiv.appendChild(commentsList);
        commentsList.appendChild(commentButton);

        return commentsDiv;
    }

    /**
     * 各コメントを作成する。
     * 
     * `li`タグを作成
     */
    createLiForComment(comment) {
        const commentLi = document.createElement('li');
        commentLi.classList.add('comment-li-' + comment.id);

        const user = getUserByKey(comment.user, 'id', true);

        // コメントしたユーザのプロファイルを取得する。
        const userDiv = user.createProfileOnComment();

        // コメントの内容を取得する。
        const commentContent = this.createContentForComment(comment);

        if (commentContent === null) {
            return null;
        }

        commentLi.appendChild(userDiv);
        commentLi.appendChild(commentContent);

        return commentLi;
    }

    /**
     * コメントの内容のdivを作成する。
     */
    createContentForComment(comment) {

        if (comment.content === '' || !comment.content) {
            return null;
        }

        const commentContent = document.createElement('div');
        commentContent.textContent = comment.content;

        return commentContent;
    }

    /**
     * 「コメントする」ボタンを作成する。
     */
    createCommentButton(loggedInUser, comments) {
        const commentButton = document.createElement('button');
        commentButton.classList.add('comment-button');
        commentButton.dataset.id = this.id;
        commentButton.textContent = 'コメントする';

        commentButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('This is loggedInUser in createcommentbutton: ', loggedInUser);

            const commentInput = document.getElementById('comment-input-' + this.id);

            const comment = {
                id: comments.length + 1,
                post: this.id,
                user: loggedInUser.id,
                content: commentInput.value,
                date: new Date().getTime()
            }

            const classifiedComment = turnCommentIntoCommentClass(comment);

            console.log('This is classifiedComment: ', classifiedComment);

            classifiedComment.addComment();

            console.log('This is classifiedComment2: ', classifiedComment);

            this.comments.push(classifiedComment.id);
            // this.addComment(classifiedComment.id);

            console.log('This is comments of post: ', this.comments);

            updatePostData(this);

            const commentsList = document.querySelector('.comments-list-' + this.id);
            commentsList.innerHTML = '';

            const updatedComments = JSON.parse(localStorage.getItem('comments'));

            console.log('This is updatedComments: ', updatedComments);

            this.makeArrayOfCommentsCommentLists(updatedComments, commentsList, true);

            commentInput.value = '';

            commentsList.appendChild(commentInput);
            commentsList.appendChild(commentButton);
        })

        return commentButton;
    }

    /**
     * コメントされた内容をポストごとのcommentsリストに追加する。
     */
    addComment(comment) {
        this.comments.push(comment);
    }

    /**
     * コメントを入力するためのinput要素を作成する。
     */
    createCommentInput() {

        const commentInput = document.createElement('textarea');

        commentInput.id = 'comment-input-' + this.id;
        commentInput.placeholder = 'コメントを入力してください';

        return commentInput;
    }

    /**
     * ポストのコメントを表示するメソッドを呼び出す。
     * 
     */
    makeArrayOfCommentsCommentLists(comments, commentsList, isCommentListRefreshed = false) {

        console.log('This is comments of post: ', this.comments);

        comments.forEach(c => {
            if (c.post === this.id) {
                const classifiedComment = turnCommentIntoCommentClass(c);
                const commentLi = this.createLiForComment(classifiedComment);
                commentsList.appendChild(commentLi);
            }
        })
    }

    /**
     * タイトル部分のエレメントを作成する。
     */
    createDivForTitle() {

        const postTitle = document.createElement('div');
        postTitle.classList.add('d-flex', 'align-items-center', 'justify-content-between');

        const titleDiv = document.createElement('div');
        titleDiv.classList.add('fs-4');
        titleDiv.textContent = this.title;

        const postedDate = this.createElementForPostedDate();

        postTitle.appendChild(titleDiv);
        postTitle.appendChild(postedDate);

        return postTitle;
    }

    /**
     * ポストが作成された日時をフォーマットする。
     */
    createElementForPostedDate() {
        const postedDate = document.createElement('div');
        postedDate.classList.add('posted-date');
        postedDate.textContent = this.formatDate();

        return postedDate;
    }

    /**
     * いいねボタンを作成する。
     */
    createLikeButton(loggedInUser, isLiked) {
        const likeButton = document.createElement('button');
        likeButton.classList.add('like-button');
        likeButton.textContent = 'いいね';

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
                this.removeLike(loggedInUser.id);
            } else {
                likeButton.classList.add('liked');
                likeHeart.classList.remove('fa-regular');
                likeHeart.classList.add('fa-solid');
                this.addLike(loggedInUser.id);
            }
        });

        return likeButton;
    }

    /**
     * いいねカウント部分を作成する。
     */
    createLikeCountElement() {
        const likeCount = document.createElement('div');
        likeCount.classList.add('like-count');
        likeCount.textContent = this.likes.length > 0 ? `${this.likes.length} likes` : '';

        return likeCount;
    }
}
