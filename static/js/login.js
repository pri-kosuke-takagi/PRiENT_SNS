import { fetchUserSampleData } from "./utils/fetchUtils/fetchUserSampleData.js";
import { User } from "./classes/UserClass.js";

const loginForm = document.querySelector('#login-form');
const alertMessage = document.querySelector('#alert-message');

const handleLogin = (e, users) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // ユーザクラスを作成し、ログインを試みる。
    const user = new User();
    const loggedInUser = user.login(email, password, users);

    if (loggedInUser) {
        // ログインに成功した場合は、ユーザデータをセッションストレージに保存し、
        // ホーム画面にリダイレクトする。
        window.location.href = '/views/html/home.html';
    } else {
        // ログインに失敗した場合は、エラーメッセージを表示する。
        alertMessage.textContent = 'Invalid email or password. Please try again.';
    }
}

window.onload = async () => {
    console.log('login.js loaded');

    // ユーザデータをローカルストレージから取得する。
    let users = JSON.parse(localStorage.getItem('users'));

    if (!localStorage.getItem('users')) {
       users = await fetchUserSampleData();
    }

    localStorage.setItem('users', JSON.stringify(users));
    console.log('This is users: ', users);

    // ログインフォームのsubmitイベントをリッスンする。
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin(e, users);
    });
}