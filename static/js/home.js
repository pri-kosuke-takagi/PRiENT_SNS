import { fetchUserSampleData } from "/static/js/utils/fetchUserSampleData.js";
import { fetchPostSampleData } from "/static/js/utils/fetchPostSampleData.js";
import { Post } from "/static/js/classes/PostClass.js";
import { User } from "/static/js/classes/UserClass.js";
import { checkIfUserLoggedIn } from "/static/js/utils/checkIfUserLoggedIn.js";
import { getUserFromKey } from "/static/js/utils/getUserFromKey.js";
import { createClassifiedUsers } from "/static/js/utils/createClassifiedUsers.js";
import { turnUserIntoUserClass } from "./utils/turnUserIntoUserClass.js";
import { fetchCommentSampleData } from "./utils/fetchCommentSampleData.js";

const postsDiv = document.querySelector('#posts-div');
const searchButton = document.querySelector('#search-button');
const navbar = document.querySelector('.navbar');

const handledSearchButtonClicked = (e, classifiedLoggedInUser, users) => {
    e.preventDefault();
    // もうすでに検索モーダルが表示されている場合は、何もしない。
    if (document.querySelector('.search-modal')) {
        return;
    }
    const userIdOfLoggedInUser = classifiedLoggedInUser ? classifiedLoggedInUser.id : null;
    
    const searchModal = document.createElement('div');
    searchModal.classList.add('search-modal');
    const searchModalButtons = document.createElement('div');
    searchModalButtons.classList.add('search-buttons-div', 'd-flex', 'gap-1', 'align-items-center', 'p-2', 'w-100');
    const searchModalButtonsDiv = document.createElement('div');
    searchModalButtonsDiv.classList.add('flex-grow-1', 'd-flex', 'align-items-center', 'justify-content-center', 'gap-2');
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'search-input';
    searchInput.placeholder = 'Search for users...';
    // 検索ボタンは無くても機能的には問題ないので、コメントアウト。
    // const searchButton = document.createElement('button');
    // searchButton.id = 'search-user-button';
    // searchButton.textContent = '検索';
    searchModalButtonsDiv.appendChild(searchInput);
    // searchModalButtonsDiv.appendChild(searchButton);
    const closeModalButton = document.createElement('i');
    closeModalButton.classList.add('fa-solid', 'fa-x', 'close-button');
    searchModalButtons.appendChild(searchModalButtonsDiv);
    searchModalButtons.appendChild(closeModalButton);

    searchModal.appendChild(searchModalButtons);

    // 検索結果部分にユーザを表示する。
    const searchResults = document.createElement('div');
    searchResults.id = 'search-results';
    const classifiedUsers = createClassifiedUsers(users);
    console.log(classifiedUsers.filter(u => u.id !== userIdOfLoggedInUser && u.firstName.toLowerCase().includes(searchInput.value.toLowerCase())));
    classifiedUsers.forEach(user => {
        if (user.id === userIdOfLoggedInUser) {
            return;
        }
        const userElement = user.createProfileInSearchModal(classifiedLoggedInUser);
        searchResults.appendChild(userElement);
    })
    searchModal.appendChild(searchResults);

    // 検索インプットのイベントリスナーを追加する。
    searchInput.addEventListener('input', () => {
        searchResults.innerHTML = '';
        classifiedUsers.forEach(user => {
            if (user.id === userIdOfLoggedInUser) {
                return;
            }
            // ユーザの名前、アカウント名、バイオ、検索ワードが含まれている場合、ユーザを表示する。
            if (user.firstName.toLowerCase().includes(searchInput.value.toLowerCase())
            || user.lastName.toLowerCase().includes(searchInput.value.toLowerCase())
            || user.accountName.toLowerCase().includes(searchInput.value.toLowerCase())
            || user.bio.toLowerCase().includes(searchInput.value.toLowerCase())) {
                const userElement = user.createProfileInSearchModal(classifiedLoggedInUser);
                searchResults.appendChild(userElement);
            }
        });
    });

    // クローズボタンのイベントリスナーを追加する。
    // const closeModalButton = searchModal.querySelector('.close-button');
    closeModalButton.addEventListener('click', () => {
        searchModal.remove();
    });
    navbar.after(searchModal);

    // ESCキーを押したときに、検索モーダルを閉じる。
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchModal.remove();
        }
    });
}

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
        const classifiedUser = getUserFromKey(post.author, 'id', true);
        console.log('This is classifiedUser: ', classifiedUser);
        const authorDiv = classifiedUser.createProfileOnPost(classifiedLoggedInUser);

        // 投稿の情報を取得し、投稿のHTMLを作成する。
        const classifiedPost = new Post(post.id, post.author, post.title, post.content, post.imageUrl, post.timestamp, post.likes, post.comments);

        console.log('This is classifiedPost: ', classifiedPost);

        const postElement = classifiedPost.createPostElement(classifiedLoggedInUser, classifiedUser, comments);

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

    displayPosts(posts, comments, classifiedLoggedInUser);

    searchButton.addEventListener('click', (e) => {
        handledSearchButtonClicked(e, classifiedLoggedInUser, users);
    });
}