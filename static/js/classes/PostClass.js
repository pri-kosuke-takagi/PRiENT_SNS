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
        postDiv.classList.add('post-main-div');

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
        likesAndSaveDiv.classList.add('likes-div');
        likesAndSaveDiv.id = 'likes-and-save-div-' + this.id;

        // いいねボタン部分を作成
        const likeButton = this.createLikeButton(loggedInUser, isLiked);

        // // いいね数が0より大きい場合は表示する
        // const likesCount = this.createLikeCountElement(isLiked);
        // likesAndSaveDiv.appendChild(likesCount);


        // コメントタイトルを作成し、コメントリストを表示するように。
        const commentTitle = this.createCommentTitle();

        // 一時保存ボタンを作成する
        const saveButton = this.createSaveButton(loggedInUser);

        likesAndSaveDiv.appendChild(likeButton);
        likesAndSaveDiv.appendChild(commentTitle);
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

    toggleLike(userId) {
        if (this.likes.includes(userId)) {
            this.removeLike(userId);
        } else {
            this.addLike(userId);
        }
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
        const isLiked = this.likes.includes(loggedInUser.id);
        const postDiv = document.createElement('div');
        postDiv.classList.add('post-main-div');

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
        likesAndSaveDiv.classList.add('likes-div');
        likesAndSaveDiv.id = 'likes-and-save-div-' + this.id;

        // いいねボタン部分を作成
        const likeButton = this.createLikeButton(loggedInUser, isLiked);

        // 一時保存ボタンを作成する
        const saveButton = this.createSaveButton(loggedInUser);

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
        modalForCommentsList.classList.add('modal', 'fade', 'comments-list-modal', 'modal-lg');
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

        // コメントリストを作成
        const commentsList = document.createElement('ul');
        commentsList.classList.add('comments-list-' + this.id, 'w-100');
        this.makeArrayOfCommentsCommentLists(comments, commentsList);
        modalFooter.appendChild(commentsList);

        // コメントに関するTextareaとボタンを格納するためのdivを作成
        const divForCommentInput = this.createDivForInputAndCommentButton(loggedInUser, comments);
        modalFooter.appendChild(divForCommentInput);

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
        const commentButton = document.createElement('div');
        commentButton.classList.add('comment-button', 'col-2', 'arrow-container');
        // commentButton.classList.add('comment-button', 'col-2');
        commentButton.dataset.id = this.id;
        // commentButton.textContent = 'コメントする';

        // コメントボタンのアローアイコン
        const arrowIcon = this.createArrowOfSendingComment();
        commentButton.appendChild(arrowIcon);

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
     * コメントのArrowボタンを作成する
     */
    createArrowOfSendingComment() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        // svg.setAttribute('fill', '#67a7cc');
        svg.setAttribute('version', '1.1');
        svg.setAttribute('id', 'Capa_1_' + this.id);
        svg.classList.add('arrow-svg-send-comment');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svg.setAttribute('width', '80px');
        svg.setAttribute('height', '80px');
        svg.setAttribute('viewBox', '0 0 45.513 45.512');
        svg.setAttribute('xml:space', 'preserve');

        // バックグラウンドを作成
        const bgCarrier = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        bgCarrier.setAttribute('id', 'SVGRepo_bgCarrier');
        bgCarrier.setAttribute('stroke-width', '0');
        svg.appendChild(bgCarrier);

        // トレーサー
        const tracerCarrier = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tracerCarrier.setAttribute('id', 'SVGRepo_tracerCarrier');
        tracerCarrier.setAttribute('stroke-linecap', 'round');
        tracerCarrier.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(tracerCarrier);

        // アイコングループを作成
        const iconCarrier = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        iconCarrier.setAttribute('id', 'SVGRepo_iconCarrier');
        svg.appendChild(iconCarrier);

        // パスグループを作成
        const pathGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        iconCarrier.appendChild(pathGroup);

        // パスを作成
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M44.275,19.739L30.211,5.675c-0.909-0.909-2.275-1.18-3.463-0.687c-1.188,0.493-1.959,1.654-1.956,2.938l0.015,5.903 l-21.64,0.054C1.414,13.887-0.004,15.312,0,17.065l0.028,11.522c0.002,0.842,0.338,1.648,0.935,2.242s1.405,0.927,2.247,0.925 l21.64-0.054l0.014,5.899c0.004,1.286,0.781,2.442,1.971,2.931c1.189,0.487,2.557,0.21,3.46-0.703L44.29,25.694 C45.926,24.043,45.92,21.381,44.275,19.739z');
        pathGroup.appendChild(path);

        // テキストを作成
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.textContent = '送信';
        textElement.setAttribute('x', 10);
        textElement.setAttribute('y', 25);
        textElement.setAttribute('font-size', '10px');
        textElement.setAttribute('viewBox', '0 0 91.026 91.024');
        textElement.setAttribute('fill', 'white');

        svg.appendChild(textElement);

        return svg;
    }

    /**
     * コメントを閉じる Arrowボタンを作成する
     */
    createArrowOfClosingComment() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('arrow-svg-close');
        // svg.setAttribute('fill', '#67a7cc'); fillはCSSで指定する。
        svg.setAttribute('version', '1.1');
        svg.setAttribute('id', 'Capa_2_' + this.id);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svg.setAttribute('width', '60px');
        svg.setAttribute('height', '60px');
        svg.setAttribute('viewBox', '0 0 45.513 45.512');
        svg.setAttribute('xml:space', 'preserve');
        svg.setAttribute('transform', 'rotate(90)');

        // バックグラウンドを作成
        const bgCarrier = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        bgCarrier.setAttribute('id', 'SVGRepo_bgCarrier');
        bgCarrier.setAttribute('stroke-width', '0');
        svg.appendChild(bgCarrier);

        // トレーサー
        const tracerCarrier = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tracerCarrier.setAttribute('id', 'SVGRepo_tracerCarrier');
        tracerCarrier.setAttribute('stroke-linecap', 'round');
        tracerCarrier.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(tracerCarrier);

        // アイコングループを作成
        const iconCarrier = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        iconCarrier.setAttribute('id', 'SVGRepo_iconCarrier');
        svg.appendChild(iconCarrier);

        // パスグループを作成
        const pathGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        iconCarrier.appendChild(pathGroup);

        // パスを作成
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M44.275,19.739L30.211,5.675c-0.909-0.909-2.275-1.18-3.463-0.687c-1.188,0.493-1.959,1.654-1.956,2.938l0.015,5.903 l-21.64,0.054C1.414,13.887-0.004,15.312,0,17.065l0.028,11.522c0.002,0.842,0.338,1.648,0.935,2.242s1.405,0.927,2.247,0.925 l21.64-0.054l0.014,5.899c0.004,1.286,0.781,2.442,1.971,2.931c1.189,0.487,2.557,0.21,3.46-0.703L44.29,25.694 C45.926,24.043,45.92,21.381,44.275,19.739');
        pathGroup.appendChild(path);

        // テキストを作成
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.textContent = '閉じる';
        textElement.setAttribute('x', -32);
        textElement.setAttribute('y', -32);
        textElement.setAttribute('font-size', '10px');
        textElement.setAttribute('viewBox', '0 0 91.026 91.024');
        textElement.setAttribute('fill', 'white');
        textElement.setAttribute('transform', 'rotate(270)');

        svg.appendChild(textElement);

        return svg;
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
        const likeButton = document.createElement('div');
        likeButton.classList.add('like-button');

        const likeHeart = this.createLikeIcon(isLiked);
        likeButton.appendChild(likeHeart);

        const classNameForLikeButton = isLiked ? 'fa-solid' : 'fa-regular';
        likeHeart.classList.add(classNameForLikeButton, 'fa-heart');
        likeButton.appendChild(likeHeart);

        likeButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleLike(loggedInUser.id);
            if (this.likes.includes(loggedInUser.id)) {
                likeHeart.classList.remove('fa-solid');
                likeHeart.classList.add('fa-regular');
            } else {
                likeHeart.classList.remove('fa-regular');
                likeHeart.classList.add('fa-solid');
            }
        });

        return likeButton;
    }

    /**
     * いいねのアイコンを作成する。
     */
    createLikeIcon(isLiked) {
        const likeHeart = document.createElement('i');

        if (isLiked) {
            likeHeart.classList.add('fa-solid', 'fa-heart', 'post-icon');
        } else {
            likeHeart.classList.add('fa-regular', 'fa-heart', 'post-icon');
        }
        likeHeart.setAttribute('title', 'いいね');

        return likeHeart;
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
     * 一時保存ボタンを作成する。
     */
    createSaveButton(loggedInUser) {
        const saveButton = document.createElement('div');
        saveButton.classList.add('save-button');

        const iconOfSaveButton = document.createElement('i');
        const classNameForIcon = loggedInUser.savedPosts.includes(this.id) ? 'fa-solid' : 'fa-regular';
        iconOfSaveButton.classList.add(classNameForIcon, 'fa-bookmark', 'save-icon', 'post-icon');
        iconOfSaveButton.setAttribute('title', '保存');        

        saveButton.appendChild(iconOfSaveButton);

        // 一時保存ボタンのイベントリスナーを追加する
        saveButton.addEventListener('click', () => {
            console.log('This is user before savePost: ', loggedInUser);
            if (loggedInUser.savedPosts.includes(this.id)) {
                iconOfSaveButton.classList.remove('fa-solid', 'fa-bookmark');
                iconOfSaveButton.classList.add('fa-regular', 'fa-bookmark');
                loggedInUser = this.unsavePost(loggedInUser);
            } else {
                iconOfSaveButton.classList.remove('fa-regular', 'fa-bookmark');
                iconOfSaveButton.classList.add('fa-solid', 'fa-bookmark');
                loggedInUser = this.savePost(loggedInUser);
            }
            console.log('This is user after savePost: ', loggedInUser);
        });

        return saveButton;
    }

    /**
     * コメントするボタンや、コメントインプット用のdivを作成する。
     */
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
        const closeButton = document.createElement('div');
        closeButton.setAttribute('data-bs-dismiss', 'modal');
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.classList.add('col-2', 'arrow-container');

        // コメントモダルを閉じるアイコンを作成
        const closeSvg = this.createArrowOfClosingComment();
        closeButton.appendChild(closeSvg);

        return closeButton;
    }

    /**
     * コメントタイトルを作成する。
     * クリックするとコメントリストがモダルとして表示される。
     */
    createCommentTitle() {
        const commentTitle = document.createElement('div');
        commentTitle.classList.add('comment-title-' + this.id);
        commentTitle.id = 'comment-title-' + this.id;
        commentTitle.setAttribute('data-bs-toggle', 'modal');
        commentTitle.setAttribute('data-bs-target', `#comments-list-modal-${this.id}`);

        const commentTitleText = this.createIconForCommentTitle();
        commentTitle.appendChild(commentTitleText);

        return commentTitle;
    }

    /**
     * コメントタイトル内のアイコンを作成する。
     */
    createIconForCommentTitle() {
        const iconForCommentTitle = document.createElement('i');
        iconForCommentTitle.classList.add('fa-solid', 'fa-reply', 'post-icon');
        iconForCommentTitle.setAttribute('title', 'コメント');

        return iconForCommentTitle;
    }

    /**
     * 投稿をHTML要素に変換して表示させるメソッド (プロファイルページの過去投稿用)
     */
    createPostElementForMyPage(loggedInUser) {
        const isLiked = this.likes.includes(loggedInUser.id);
    
        const postDiv = document.createElement('div');
        postDiv.classList.add('post-main-div');

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
        likesAndSaveDiv.classList.add('likes-div-of-profile');
        likesAndSaveDiv.classList.add('d-flex', 'justify-content-start', 'align-items-center', 'gap-3');
        likesAndSaveDiv.id = 'likes-and-save-div-' + this.id;

        // 自分用のページで自分自身の投稿を表示するため、いいねボタン部分は表示しない。

        // 自分用のページのため、いいね数を表示する。
        // いいね数が0より大きい場合は表示する
        const likesCount = this.createLikeCountElement(isLiked);
        likesAndSaveDiv.appendChild(likesCount);

        // コメントタイトルを作成し、コメントリストを表示するように。
        const commentTitle = this.createCommentTitle();

        // 投稿削除ボタンを作成する
        const deleteButton = this.createDeleteButton();


        // likesAndSaveDiv.appendChild(likeButton);
        likesAndSaveDiv.appendChild(commentTitle);
        likesAndSaveDiv.appendChild(deleteButton);

        postDiv.appendChild(postTitle);
        postDiv.appendChild(postImage);
        postDiv.appendChild(postContent);
        postDiv.appendChild(likesAndSaveDiv);

        return postDiv;
    }

    /**
     * 投稿削除ボタンを作成する。
     */
    createDeleteButton() {
        const deleteButton = document.createElement('div');
        deleteButton.classList.add('delete-button');

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash', 'post-icon');
        deleteIcon.setAttribute('title', '削除');
        deleteButton.appendChild(deleteIcon);

        deleteButton.addEventListener('click', (e) => {

            e.preventDefault();

            const posts = JSON.parse(localStorage.getItem('posts'));
            const updatedPosts = posts.filter(p => p.id !== this.id);
            localStorage.setItem('posts', JSON.stringify(updatedPosts));

            window.location.reload();
        });

        return deleteButton;
    }
}
