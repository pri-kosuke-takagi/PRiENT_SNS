import { fetchUserSampleData } from "/static/js/utils/fetchUserSampleData.js";
import { fetchPostSampleData } from "/static/js/utils/fetchPostSampleData.js";
import { Post } from "/static/js/classes/PostClass.js";
import { User } from "/static/js/classes/UserClass.js";
import { checkIfUserLoggedIn } from "/static/js/utils/checkIfUserLoggedIn.js";
import { getUserFromKey } from "/static/js/utils/getUserFromKey.js";
import { createClassifiedUsers } from "/static/js/utils/createClassifiedUsers.js";
import { createUrlFromImageFile } from "/static/js/utils/createUrlFromImageFile.js";

const postTitle = document.getElementById('post-title');
const postImage = document.getElementById('image-preview')
const imageInput = document.getElementById('image-input');
const postButton = document.getElementById('post-button');
const postContent = document.getElementById('post-content');
const postForm = document.getElementById('post-form');

/**
 * 画像ファイルを受け取り、そのファイルのURLをプレビューに挿入する関数。 
 */
const handleImageInput = async (e) => {
    e.preventDefault();
    console.log(e.target.files)
    const urlOfFile = await createUrlFromImageFile(e.target.files[0]);
    console.log('This is imageOfFile: ', urlOfFile);
    postImage.src = urlOfFile;
    postImage.classList.remove('d-none');
}

/**
 * 投稿ボタンがクリックされた時の処理を行う関数。
 */
const handlePostButtonClicked = (e, posts, user) => {
    console.log('Post submitted');
    const post = new Post(posts.length + 1, user.id, postTitle.value, postContent.value, postImage.src, new Date(), [], []);
    const createdPost = post.createPost();
    console.log('This is createdPost: ', createdPost);

    if (!createdPost && !createdPost.title && !createdPost.content && !createdPost.author) {
        return;
    }

    posts.push(createdPost);
    localStorage.setItem('posts', JSON.stringify(posts));
}

window.onload = async () => {
    console.log('postPage.js loaded');

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

    const classifiedLoggedInUser = new User(loggedInUser.id, loggedInUser.firstName, loggedInUser.lastName, loggedInUser.accountName, loggedInUser.email, loggedInUser.password, loggedInUser.bio, loggedInUser.profilePicture, loggedInUser.posts, loggedInUser.follows);

    imageInput.addEventListener('change', handleImageInput);

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handlePostButtonClicked(e, posts, classifiedLoggedInUser);
    });
}