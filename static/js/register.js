import { fetchUserSampleData } from "/static/js/utils/fetchUserSampleData.js";
import { storeUserDataToLocalStorage } from "/static/js/utils/storeUserDataToLocalStorage.js";
import { User } from "/static/js/classes/UserClass.js";
import { createUrlFromImageFile } from "/static/js/utils/createUrlFromImageFile.js";
import { turnUserIntoUserClass } from "./utils/turnUserIntoUserClass.js";

const registerForm = document.getElementById('register-form');
const profilePictureInput = document.getElementById('profile-picture');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const accountNameInput = document.getElementById('account-name');
const dateOfBirthInput = document.getElementById('date-of-birth');
const emailInput = document.getElementById('email');
const emailInputConfirm = document.getElementById('email-confirm');
const passwordInput = document.getElementById('password');
const passwordInputConfirm = document.getElementById('password-confirm');
const agreeWithTermsInput = document.getElementById('form-check');
const restoredUser = document.getElementById('div-for-sex');
const bioInput = document.getElementById('bio');
const profilePictureImg = document.getElementById('profile-picture-img')

/**
 * 画像ファイルを受け取り、そのファイルのURLをプレビューに挿入する関数。 
 */
const handleImageInput = async (e) => {
    e.preventDefault();
    console.log(profilePictureInput.files)
    // 画像ファイルからURLを生成する関数を呼び出す。
    const urlOfFile = await createUrlFromImageFile(profilePictureInput.files[0]);
    console.log('This is imageOfFile: ', urlOfFile);
    profilePictureImg.src = urlOfFile;
    profilePictureImg.classList.remove('d-none');
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

const handleImageWhenSubmitted = async () => {

    console.log('Image submitted');
    const fileData = profilePictureInput.files[0];
    let imageData = await convertToBase64(fileData);
    // imageDataの例は、data\posts.json のid:100の画像データを参照。画像データをbase64に変換するためすごく長くなる。
    console.log('This is imageData base64ed: ', imageData);
    
    return imageData;
}

const checkEmail = () => {
    return emailInput.value !== '' && emailInputConfirm.value !== '' && emailInput.value === emailInputConfirm.value;
}

const checkPassword = () => {
    return passwordInput.value !== '' && passwordInputConfirm.value !== '' && passwordInput.value === passwordInputConfirm.value;
}

const validateForm = () => {
    // パスワードとメールアドレスのバリデーション
    if (!checkEmail()) {
        const error = document.getElementById('emailHelpId');
        error.textContent = 'Emails do not match or empty.';
        return;
    }
    // if (!checkPassword()) {
    //     const error = document.getElementById('passwordHelpId');
    //     error.textContent = 'Passwords do not match or empty.';
    //     return;
    // }
}


const handleRegister = async (e, users) => {

    validateForm();

    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const accountName = accountNameInput.value;
    const dateOfBirth = dateOfBirthInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const bio = bioInput.value;
    const profilePicture = profilePictureInput.value ? await handleImageWhenSubmitted() : '';

    console.log('This is profilePicture: ', profilePicture);

    // ユーザクラスを作成し、ユーザ登録を試みる。
    const user = {
        id: users.length + 1,
        firstName,
        lastName,
        accountName,
        dateOfBirth,
        email,
        password,
        bio,
        profilePicture,
        posts: [],
        follows: [],
        savedPosts: []
    };

    const classifiedUser = turnUserIntoUserClass(user);
    const registeredUser = classifiedUser.register(users);
    console.log('This is registeredUser: ', registeredUser);

    if (registeredUser) {
        // ユーザ登録に成功した場合は、登録したユーザをusersに追加する。
        storeUserDataToLocalStorage(registeredUser);
        // ログインに成功した場合は、ユーザデータをセッションストレージに保存し、
        alert('register successful');
        // ホーム画面にリダイレクトする。
        // テストのため一旦コメントアウト
        // window.location.href = '/html/home.html'; 
    } else {
        // ユーザ登録に失敗した場合は、エラーメッセージを表示する。
        alert('register failed');
    }
}

window.onload = async () => {
    console.log('register.js loaded');

    // ユーザデータをローカルストレージから取得する。
    let users = JSON.parse(localStorage.getItem('users'));

    if (!localStorage.getItem('users')) {
        users = await fetchUserSampleData();
        localStorage.setItem('users', JSON.stringify(users));
    }

    console.log('This is users: ', users);

    // ユーザ登録フォームのsubmitイベントをリッスンする。
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleRegister(e, users);
    });

    // 画像ファイルのinput要素にchangeイベントをリッスンする。
    profilePictureInput.addEventListener('change', handleImageInput);
}