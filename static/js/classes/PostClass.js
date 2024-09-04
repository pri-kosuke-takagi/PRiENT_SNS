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

        postDiv.appendChild(postTitle);
        postDiv.appendChild(postImage);
        postDiv.appendChild(postContent);
        postDiv.appendChild(likesAndSaveDiv);

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

        postDiv.appendChild(postTitle);
        postDiv.appendChild(postImage);
        postDiv.appendChild(postContent);
        postDiv.appendChild(likesAndSaveDiv);

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

        // コメントリストを格納するためのdivを作成 (Modalとして表示)
        const modalForCommentsList = document.createElement('div');
        modalForCommentsList.classList.add('modal', 'fade', 'comments-list-modal');
        modalForCommentsList.id = 'comments-list-modal-' + this.id;
        modalForCommentsList.tabIndex = -1;
        modalForCommentsList.setAttribute('aria-hidden', 'true');
        // modalForCommentsList.setAttribute('aria-labelledby', 'comments-list-modal-' + this.id);

        // modal-dialogを作成
        const modalDialog = document.createElement('div');
        modalDialog.classList.add('modal-dialog');
        modalForCommentsList.appendChild(modalDialog);

        // modal-contentを作成
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        modalDialog.appendChild(modalContent);

        // modal-headerを作成
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header', 'flex-column');
        modalContent.appendChild(modalHeader);

        const modalTitle = this.createDivForTitle();
        modalTitle.classList.add('modal-title');
        modalHeader.appendChild(modalTitle);

        // modal-bodyを作成
        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        modalContent.appendChild(modalBody);
        
        // 画像部分を作成
        const postImage = document.createElement('img');
        if (this.imageUrl) {
            this.insertImageToElement(postImage, this.imageUrl);
        }

        // 本文部分を作成
        const postContent = document.createElement('p');
        postContent.textContent = this.content;

        modalBody.appendChild(postImage);
        modalBody.appendChild(postContent);

        // modal-footerを作成
        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer', 'd-flex', 'justify-content-center');
        modalFooter.id = 'modal-footer-' + this.id;
        modalContent.appendChild(modalFooter);

        // コメントタイトルを作成し、コメントリストを表示するように。
        const commentTitle = document.createElement('button')
        commentTitle.textContent = 'コメント';
        commentTitle.classList.add('comment-title-' + this.id, 'btn', 'btn-primary');
        commentTitle.setAttribute('data-bs-toggle', 'modal');
        commentTitle.setAttribute('data-bs-target', `#comments-list-modal-${this.id}`);

        // コメントリストを作成
        const commentsList = document.createElement('ul');
        commentsList.classList.add('comments-list-' + this.id, 'w-100');
        this.makeArrayOfCommentsCommentLists(comments, commentsList);
        modalFooter.appendChild(commentsList);

        // コメントに関するTextareaとボタンを格納するためのdivを作成
        const divForCommentInput = this.createDivForInputAndCommentButton(loggedInUser, comments);
        modalFooter.appendChild(divForCommentInput);

        commentsDiv.appendChild(commentTitle);
        commentsDiv.appendChild(modalForCommentsList);

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

        // コメントの内容を取得し、div要素に格納する。
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
        commentButton.classList.add('comment-button', 'col-2');
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

            console.log('This is comments of post: ', this.comments);

            const updatedComments = JSON.parse(localStorage.getItem('comments'));
            // リロードしなくてもコメントが追加されるようにするために以下の行が必要。
            comments = updatedComments;

            const commentsList = document.querySelector('.comments-list-' + this.id);

            this.makeArrayOfCommentsCommentLists(updatedComments, commentsList, true);

            updatePostData(this);

            commentInput.value = '';

            const divForCommentInput = this.createDivForInputAndCommentButton(loggedInUser, comments);
            const modalFooter = document.getElementById('modal-footer-' + this.id);
            modalFooter.innerHTML = '';
            modalFooter.appendChild(commentsList);
            modalFooter.appendChild(divForCommentInput);
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

        const commentInputDiv = document.createElement('div');
        commentInputDiv.classList.add('col-8');

        const commentInput = document.createElement('textarea');
        commentInput.placeholder = 'コメントを入力してください';
        commentInput.id = 'comment-input-' + this.id;
        commentInput.classList.add('comment-input', 'form-control');

        commentInputDiv.appendChild(commentInput);

        return commentInputDiv;
    }

    /**
     * ポストのコメントを表示するメソッドを呼び出す。
     * 
     */
    makeArrayOfCommentsCommentLists(comments, commentsList, isCommentListRefreshed = false) {

        console.log('This is comments of post: ', this.comments);

        if (isCommentListRefreshed) {
            commentsList.innerHTML = '';
        }

        comments.forEach(c => {
            if (c.post === this.id) {
                const classifiedComment = turnCommentIntoCommentClass(c);
                if (
                    classifiedComment === null ||
                    classifiedComment.content === '' ||
                    !classifiedComment.content
                ) {
                    return;
                }
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
        postTitle.classList.add('d-flex', 'align-items-center', 'justify-content-between', 'w-100');

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
        postedDate.classList.add('posted-date', 'text-muted');
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

    /**
     * コメントするボタンや、コメントインプット用のdivを作成する。
     */
    // createDivForInputAndCommentButton(loggedInUser, comments, divForCommentInput) {
    createDivForInputAndCommentButton(loggedInUser, comments) {

        // コメントに関するTextareaとボタンを格納するdivを取得
        const divForCommentInput = document.createElement('div');
        divForCommentInput.id = 'div-for-input-and-comment-button-' + this.id;
        divForCommentInput.classList.add('row', 'align-items-center', 'justify-content-between', 'w-100');

        // コメントリストにコメントを追加するためのtextarea要素を作成
        const commentInput = this.createCommentInput();
        divForCommentInput.appendChild(commentInput);

        // コメントを送信するボタンを作成
        const commentButton = this.createCommentButton(loggedInUser, comments);
        divForCommentInput.appendChild(commentButton);

        // コメントモダルの閉じるボタンを作成
        const closeButton = this.createCloseButtonForCommentModal();
        divForCommentInput.appendChild(closeButton);

        return divForCommentInput;
    }

    /**
     * コメントモダルを閉じるボタンを作成する。
     */
    createCloseButtonForCommentModal() {
        const closeButton = document.createElement('button');
        closeButton.setAttribute('data-bs-dismiss', 'modal');
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.classList.add('col-2');
        closeButton.textContent = '閉じる';

        return closeButton;
    }
}
