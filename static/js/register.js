import { fetchUserSampleData } from "/static/js/utils/fetchUserSampleData.js";
import { storeUserDataToLocalStorage } from "/static/js/utils/storeUserDataToLocalStorage.js";
import { User } from "/static/js/classes/UserClass.js";

const registerForm = document.querySelector('#register-form');
const firstNameInput = document.querySelector('#first-name');
const lastNameInput = document.querySelector('#last-name');
const accountNameInput = document.querySelector('#account-name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const bioInput = document.querySelector('#bio');
const profilePictureInput = document.querySelector('#profile-picture');

const handleRegister = async (e, users) => {
    e.preventDefault();
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const accountName = accountNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const bio = bioInput.value;
    const profilePicture = profilePictureInput.files[0];

    console.log('This is profilePicture: ', profilePicture);

    // ユーザクラスを作成し、ユーザ登録を試みる。
    const user = new User();
    const registeredUser = await user.register(firstName, lastName, accountName, email, password, bio, profilePicture, users);

    console.log('This is registeredUser: ', registeredUser);

    if (registeredUser) {
        // ユーザ登録に成功した場合は、登録したユーザをusersに追加する。
        storeUserDataToLocalStorage(registeredUser);
        // ログインに成功した場合は、ユーザデータをセッションストレージに保存し、
        // ホーム画面にリダイレクトする。
        alert('register successful');
        window.location.href = '/html/home.html'; 
    } else {
        // ログインに失敗した場合は、エラーメッセージを表示する。
        const error = document.querySelector('#error');
        error.textContent = 'Invalid parameters.';
    }

}

window.onload = async () => {
    console.log('register.js loaded');

    // ユーザデータをローカルストレージから取得する。
    let users = JSON.parse(localStorage.getItem('users'));

    if (!localStorage.getItem('users')) {
        users = await fetchUserSampleData();
    }

    localStorage.setItem('users', JSON.stringify(users));
    console.log('This is users: ', users);

    // ユーザ登録フォームのsubmitイベントをリッスンする。
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister(e, users);
    });
}