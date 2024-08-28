import { fetchUserSampleData } from "/static/js/utils/fetchUserSampleData.js";
import { fetchPostSampleData } from "/static/js/utils/fetchPostSampleData.js";
import { Post } from "/static/js/classes/PostClass.js";
import { User } from "/static/js/classes/UserClass.js";
import { checkIfUserLoggedIn } from "/static/js/utils/checkIfUserLoggedIn.js";
import { getUserFromKey } from "/static/js/utils/getUserFromKey.js";
import { getPostByKey } from "/static/js/utils/getPostByKey.js";
import { turnUserIntoUserClass } from "./utils/turnUserIntoUserClass";

const usersPostsElement = document.getElementById('posts-div');
const userProfileDiv = document.getElementById('user-profile');

/**
 * ユーザ情報をHTML画面に表示させる関数。
 */
const displayUserInformation = (friend, loggedInUser) => {
    const userInfo = friend.createProfileOnOthersPage(loggedInUser);
    userProfileDiv.appendChild(userInfo); 
}

/**
 * 過去の投稿を表示させる関数。
 */
const displayPosts = (friend, loggedInUser) => {
    const posts = JSON.parse(localStorage.getItem('posts'));
    // friend.postsは、friendが投稿した投稿のIDの配列。
    friend.posts.forEach(post => {
        const classifiedPost = getPostByKey(post, 'id', posts, true);
        const postElement = classifiedPost.createPostElement(loggedInUser);
        usersPostsElement.appendChild(postElement);
    });
}


window.onload = async () => {
    console.log('othersAccount.js loaded');

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

    const friedUserId = new URLSearchParams(window.location.search).get('user_id');
    console.log('This is user id of urlParams', friedUserId);
    const friedUser = getUserFromKey(Number(friedUserId), 'id', true);
    console.log('This is friedUser: ', friedUser);

    displayUserInformation(friedUser, classifiedLoggedInUser);

    displayPosts(friedUser, classifiedLoggedInUser);
}