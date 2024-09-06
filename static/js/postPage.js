import { fetchUserSampleData } from "/static/js/utils/fetchUtils/fetchUserSampleData.js";
import { fetchPostSampleData } from "/static/js/utils/fetchUtils/fetchPostSampleData.js";
import { Post } from "/static/js/classes/PostClass.js";
import { User } from "/static/js/classes/UserClass.js";
import { checkIfUserLoggedIn } from "/static/js/utils/checkIfUserLoggedIn.js";
import { getUserByKey } from "/static/js/utils/getObjectByKeys/getUserByKey.js";
import { createUrlFromImageFile } from "/static/js/utils/createUrlFromImageFile.js";
import { turnUserIntoUserClass } from "./utils/classTransfers/turnUserIntoUserClass.js";

const postTitle = document.getElementById('post-title');
const postImage = document.getElementById('image-preview')
const imageInput = document.getElementById('image-input');
const postButton = document.getElementById('post-button');
const postContent = document.getElementById('post-content-input');
const postForm = document.getElementById('post-form');
const alertMessage = document.getElementById('alert-message');

/**
 * 画像ファイルを受け取り、そのファイルのURLをプレビューに挿入する関数。 
 */
const handleImageInput = async (e) => {
    e.preventDefault();
    console.log(imageInput.files)
    // 画像ファイルからURLを生成する関数を呼び出す。
    const urlOfFile = await createUrlFromImageFile(imageInput.files[0]);
    console.log('This is imageOfFile: ', urlOfFile);
    postImage.src = urlOfFile;
    postImage.classList.remove('d-none');
}

/**
 * 画像データをbase64に変換する関数。
 */
const convertToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * 投稿データチェック後にエラーメッセージを表示する関数。
 */
const displayErrorMessage = (errorMessages) => {
    alertMessage.innerHTML = '';
    errorMessages.forEach(message => {
        const p = document.createElement('p');
        p.textContent = message;
        alertMessage.appendChild(p);
    });
}

/**
 * 投稿データに不足がないかチェックする関数。
 */
const checkIfPostDataIsMissing = () => {
    let title, content, image;
    let errorMessages = [];
    try {
        title = postTitle.value ? postTitle.value.trim() : errorMessages.push('タイトルが入力されていません。');
        content = postContent.value ? postContent.value.trim() : errorMessages.push('投稿文が入力されていません。');
        image = imageInput.files[0] ? imageInput.files[0] : errorMessages.push('画像がアップロードされていません。');

    } catch (error) {
        console.error('Error in checkIfPostDataIsMissing: ', error);
        errorMessages.push('エラーが発生しました。');
    }

    return errorMessages;
}

/**
 * 投稿ボタンがクリックされた時の処理を行う関数。
 */
const handlePostButtonClicked = async (e, posts, user) => {
    try {

        const fileData = imageInput.files[0];

        const errorMessages = checkIfPostDataIsMissing();
        if (errorMessages.length > 0) {
            displayErrorMessage(errorMessages);
            return;
        }

        // imageDataの例は、data\posts.json のid:100の画像データを参照。画像データをbase64に変換するためすごく長くなる。
        let imageData = await convertToBase64(fileData);
        console.log('This is imageData base64ed: ', imageData);

        const post = new Post(posts.length + 1, user.id, postTitle.value, postContent.value, imageData, new Date().getTime(), [], []);

        const createdPost = post.createPost();

        console.log('This is createdPost: ', createdPost);

        if (!createdPost && !createdPost.title && !createdPost.content && !createdPost.author) {
            return;
        }

        posts.push(createdPost);

        localStorage.setItem('posts', JSON.stringify(posts));

        location.href = '/views/html/home.html';

    } catch (error) {
        console.error('Error in handlePostButtonClicked: ', error);
        displayErrorMessage(['エラーが発生しました。']);
    }
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

    const classifiedLoggedInUser = turnUserIntoUserClass(loggedInUser);

    imageInput.addEventListener('change', handleImageInput);

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handlePostButtonClicked(e, posts, classifiedLoggedInUser);
    });
}