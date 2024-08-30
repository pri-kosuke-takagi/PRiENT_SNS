import { fetchUserSampleData } from "/static/js/utils/fetchUtils/fetchUserSampleData.js";
import { fetchPostSampleData } from "/static/js/utils/fetchUtils/fetchPostSampleData.js";
import { Post } from "/static/js/classes/PostClass.js";
import { User } from "/static/js/classes/UserClass.js";
import { checkIfUserLoggedIn } from "/static/js/utils/checkIfUserLoggedIn.js";
import { getUserByKey } from "/static/js/utils/getObjectByKeys/getUserByKey.js";
import { createClassifiedUsers } from "/static/js/utils/createClassifiedUsers.js";
import { turnUserIntoUserClass } from "./utils/classTransfers/turnUserIntoUserClass.js";

const savedPostsDiv = document.querySelector('#saved-posts-div');

const displayPosts = (posts, classifiedLoggedInUser) => {
    const userIdOfLoggedInUser = classifiedLoggedInUser ? classifiedLoggedInUser.id : null;
    const followsOfLoggedInUser = classifiedLoggedInUser ? classifiedLoggedInUser.follows : null;

    savedPostsDiv.innerHTML = '';
    posts.forEach((post, index) => {

        const postCard = document.createElement('div');
        postCard.classList.add(`post-card-${post.id}`);

        // 必須パラメータがtrueでない場合は、投稿を表示しない。
        if (!post || !post.title || !post.content || !post.author) {
            return;
        }

        // ログインしているユーザが投稿した投稿は表示しないように。
        if (classifiedLoggedInUser && post.author === userIdOfLoggedInUser) {
            return;
        }

        // 保存されていない投稿をフィルタする
        if (!classifiedLoggedInUser.savedPosts.includes(post.id)) {
            return;
        }

        // 投稿者の情報を取得し、投稿者のプロフィールを作成する。
        const classifiedUser = getUserByKey(post.author, 'id', true);
        const authorDiv = classifiedUser.createProfileOnPost(classifiedLoggedInUser);

        // コメントを取得する
        const comments = JSON.parse(localStorage.getItem('comments'));

        // 投稿の情報を取得し、投稿のHTMLを作成する。
        const classifiedPost = new Post(post.id, post.author, post.title, post.content, post.imageUrl, post.timestamp, post.likes, post.comments);
        console.log('This is classifiedPost: ', classifiedPost);
        const postElement = classifiedPost.createSavedPostElement(classifiedLoggedInUser, classifiedUser, comments, postCard);

        // 投稿者の情報と投稿の情報を一つのカードにまとめる。
        postCard.appendChild(authorDiv);
        postCard.appendChild(postElement);

        savedPostsDiv.appendChild(postCard);
    });
}

window.onload = async () => {
    console.log('savedPosts.js loaded');

    // ユーザデータをローカルストレージから取得する。
    let users = JSON.parse(localStorage.getItem('users'));
    // もしも、ユーザデータがない場合は、サンプルデータを取得する。
    if (!localStorage.getItem('users')) {
        users = await fetchUserSampleData();
    }
    localStorage.setItem('users', JSON.stringify(users));
    console.log('This is users: ', users);

    const loggedInUser = checkIfUserLoggedIn(users);

    // ユーザデータと同じように、投稿データもローカルストレージから取得する。
    let posts = JSON.parse(localStorage.getItem('posts'));
    if (!localStorage.getItem('posts')) {
        posts = await fetchPostSampleData();
    }
    localStorage.setItem('posts', JSON.stringify(posts));
    console.log('This is posts: ', posts);

    const classifiedLoggedInUser = turnUserIntoUserClass(loggedInUser); 

    displayPosts(posts, classifiedLoggedInUser);
}