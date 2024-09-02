import { fetchUserSampleData } from "/static/js/utils/fetchUtils/fetchUserSampleData.js";
import { fetchPostSampleData } from "/static/js/utils/fetchUtils/fetchPostSampleData.js";
import { Post } from "/static/js/classes/PostClass.js";
import { User } from "/static/js/classes/UserClass.js";
import { checkIfUserLoggedIn } from "/static/js/utils/checkIfUserLoggedIn.js";
import { getUserByKey } from "/static/js/utils/getObjectByKeys/getUserByKey.js";
import { createClassifiedUsers } from "/static/js/utils/createClassifiedUsers.js";
import { turnUserIntoUserClass } from "./utils/classTransfers/turnUserIntoUserClass.js";
import { fetchCommentSampleData } from "./utils/fetchUtils/fetchCommentSampleData.js";
import { updateUserData } from "./utils/updateData/updateUserData.js";

const profileDiv = document.getElementById('profile-div');
const formToChangeProfile = document.getElementById('form-to-change-profile');
const profilePictureInput = document.getElementById('profile-picture');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const accountNameInput = document.getElementById('account-name');
const dateOfBirthInput = document.getElementById('date-of-birth');
const emailInput = document.getElementById('email');
const emailInputConfirm = document.getElementById('email-confirm');
const bioInput = document.getElementById('bio-input');
const profilePictureImg = document.getElementById('profile-picture-img')
const alertMessage = document.getElementById('alert-message');
let errorMessages = [];

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
 * ユーザ情報更新フォームが送信されたときの処理。
 * @param {*} e 
 */
const handleFormSubmit = async (e, user, users) => {
    try {

        e.preventDefault();

        const updatedUser = {
            id: user.id,
            profilePicture: profilePictureImg.src,
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            accountName: accountNameInput.value,
            dateOfBirth: dateOfBirthInput.value,
            email: emailInput.value,
            bio: bioInput.value,
        }

        const classifiedUser = turnUserIntoUserClass(user);

        // 値がFalseでない`updatedUser`の値をクラス化した`User`クラスのインスタンスに代入する。
        for (const key in updatedUser) {
            if (updatedUser[key]) {
                classifiedUser[key] = updatedUser[key];
            }
        }

        await updateUserData(classifiedUser, users);

        alertMessage.classList.remove('d-none');
        alertMessage.innerText = 'プロファイル更新に成功しました。5秒後にリロードします。';
        setTimeout(() => {
            alertMessage.classList.add('d-none');
            window.location.reload();
        }, 5000);

    } catch (error) {
        console.error('Error: ', error);
    }
}

/**
 * ユーザ情報をフォームに埋め込む関数。
 * @param {*} classifiedLoggedInUser 
 */
const displayMyInformation = (classifiedLoggedInUser) => {
    profilePictureImg.src = classifiedLoggedInUser.profilePicture;
    profilePictureInput.addEventListener('change', async (e) => {
        profilePictureImg.src = await convertToBase64(e.target.files[0]);
        console.log('This is profilePictureImg.src: ', profilePictureImg.src);
    })

    firstNameInput.value = classifiedLoggedInUser.firstName;

    lastNameInput.value = classifiedLoggedInUser.lastName;

    accountNameInput.value = classifiedLoggedInUser.accountName;

    dateOfBirthInput.value = classifiedLoggedInUser.dateOfBirth;

    emailInput.value = classifiedLoggedInUser.email;

    emailInputConfirm.value = classifiedLoggedInUser.email;

    bioInput.value = classifiedLoggedInUser.bio;
}

/**
 * 自分自身の投稿を表示する関数。
 * @param {*} posts 
 * @param {*} comments 
 * @param {*} classifiedLoggedInUser 
 */
const displayMYOwnPosts = (posts, comments, classifiedLoggedInUser) => {
    const userIdOfLoggedInUser = classifiedLoggedInUser ? classifiedLoggedInUser.id : null;

    const postsDivOfProfile = document.createElement('div');
    postsDivOfProfile.id = 'posts-div-of-profile';

    postsDivOfProfile.innerHTML = '';
    posts.forEach((post, index) => {

        // 必須パラメータがtrueでない場合は、投稿を表示しない。
        if (!post || !post.title || !post.content || !post.author) {
            return;
        }
        // ログインしているユーザが投稿した投稿のみを表示させるように。
        if (classifiedLoggedInUser && post.author !== userIdOfLoggedInUser) {
            return;
        }

        // 投稿者の情報を取得し、投稿者のプロフィールを作成する。
        const classifiedUser = getUserByKey(post.author, 'id', true);
        console.log('This is classifiedUser: ', classifiedUser);

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
        postCard.appendChild(postElement);

        postsDivOfProfile.appendChild(postCard);
    });

    profileDiv.appendChild(postsDivOfProfile);
}

window.onload = async () => {
    console.log('profile.js loaded');

    // ユーザデータをローカルストレージから取得する。
    let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : await fetchUserSampleData();
    localStorage.setItem('users', JSON.stringify(users));
    console.log('This is users: ', users);

    const loggedInUser = checkIfUserLoggedIn(users);

    if (!loggedInUser) {
        // ログインしていない場合は、ログインページにリダイレクトする。
        window.location.href = '/html/login.html';
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

    displayMyInformation(classifiedLoggedInUser);

    displayMYOwnPosts(posts, comments, classifiedLoggedInUser);

    formToChangeProfile.addEventListener('submit', async (e) => {
        await handleFormSubmit(e, classifiedLoggedInUser, users);
    });
}