import { fetchUserSampleData } from "/static/js/utils/fetchUtils/fetchUserSampleData.js";
import { fetchPostSampleData } from "/static/js/utils/fetchUtils/fetchPostSampleData.js";
import { Post } from "/static/js/classes/PostClass.js";
import { User } from "/static/js/classes/UserClass.js";
import { checkIfUserLoggedIn } from "/static/js/utils/checkIfUserLoggedIn.js";
import { getUserByKey } from "/static/js/utils/getObjectByKeys/getUserByKey.js";
import { createClassifiedUsers } from "/static/js/utils/createClassifiedUsers.js";
import { turnUserIntoUserClass } from "./utils/classTransfers/turnUserIntoUserClass.js";
import { fetchCommentSampleData } from "./utils/fetchUtils/fetchCommentSampleData.js";

const postsDiv = document.getElementById('posts-div');

const displayPosts = (posts, comments, classifiedLoggedInUser) => {
    const userIdOfLoggedInUser = classifiedLoggedInUser ? classifiedLoggedInUser.id : null;

    postsDiv.innerHTML = '';
    posts.forEach((post, index) => {

        // 必須パラメータがtrueでない場合は、投稿を表示しない。
        if (!post || !post.title || !post.content || !post.author) {
            return;
        }
        // ログインしているユーザが投稿した投稿は表示しないように。
        if (classifiedLoggedInUser && post.author === userIdOfLoggedInUser) {
            return;
        }

        // 投稿者の情報を取得し、投稿者のプロフィールを作成する。
        const classifiedUser = getUserByKey(post.author, 'id', true);
        console.log('This is classifiedUser: ', classifiedUser);
        const authorDiv = classifiedUser.createProfileOnPost(classifiedLoggedInUser);

        // 投稿の情報を取得し、投稿のHTMLを作成する。
        const classifiedPost = new Post(post.id, post.author, post.title, post.content, post.imageUrl, post.timestamp, post.likes, post.comments);

        console.log('This is classifiedPost: ', classifiedPost);

        const postElement = classifiedPost.createPostElement(classifiedLoggedInUser, classifiedUser, comments);

        // コメント部分を作成
        const commentsDiv = classifiedPost.createDivForComments(classifiedLoggedInUser, classifiedUser, comments);
        postElement.appendChild(commentsDiv);

        // 投稿者の情報と投稿の情報を一つのカードにまとめる。
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');
        postCard.appendChild(authorDiv);
        postCard.appendChild(postElement);

        postsDiv.appendChild(postCard);
    });
}

window.onload = async () => {
    console.log('home.js loaded');

    // ユーザデータをローカルストレージから取得する。
    let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : await fetchUserSampleData();
    localStorage.setItem('users', JSON.stringify(users));
    console.log('This is users: ', users);

    const loggedInUser = checkIfUserLoggedIn(users);

    if (!loggedInUser) {
        // ログインしていない場合は、ログインページにリダイレクトする。
        window.location.href = '/views/html/login.html';
        return;
    }

    const classifiedLoggedInUser = turnUserIntoUserClass(loggedInUser);

    // ユーザデータと同じように、投稿データもローカルストレージから取得する。
    let posts = localStorage.getItem('posts') ? JSON.parse(localStorage.getItem('posts')) : await fetchPostSampleData();
    localStorage.setItem('posts', JSON.stringify(posts));
    console.log('This is posts: ', posts);

    // 投稿のコメントもユーザデータと同じように、ローカルストレージから取得する。
    let comments = localStorage.getItem('comments') ? JSON.parse(localStorage.getItem('comments')) : await fetchCommentSampleData();
    localStorage.setItem('comments', JSON.stringify(comments));
    console.log('This is comments: ', comments);

    displayPosts(posts, comments, classifiedLoggedInUser);
}