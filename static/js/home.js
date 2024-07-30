import { fetchUserSampleData } from "./utils/fetchUserSampleData.js";
import { fetchPostSampleData } from "./utils/fetchPostSampleData.js";
import { Post } from "./classes/PostClass.js";
import { User } from "./classes/UserClass.js";
import { checkIfUserLoggedIn } from "./utils/checkIfUserLoggedIn.js";
import { getUserFromKey } from "./utils/getUserFromKey.js";
import { createClassifiedUsers } from "./utils/createClassifiedUsers.js";

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
    searchModal.innerHTML = `
        <div class="search-buttons-div d-flex gap-1 align-items-center p-2 w-100">
            <div class="flex-grow-1 d-flex align-items-center justify-content-center gap-2">
                <input type="text" id="search-input" placeholder="Search for users...">
                <button id="search-user-button">Search</button>
            </div>
            <i class="fa-solid fa-x close-button"></i>
        </div>
        <div id="search-results"></div>
    `;

    // 検索結果部分にユーザを表示する。
    const searchResults = searchModal.querySelector('#search-results');
    const classifiedUsers = createClassifiedUsers(users);
    classifiedUsers.forEach(user => {
        if (user.id === userIdOfLoggedInUser) {
            return;
        }
        const userElement = user.createProfileInSearchModal(classifiedLoggedInUser);
        searchResults.appendChild(userElement);
    })

    // クローズボタンのイベントリスナーを追加する。
    const closeModalButton = searchModal.querySelector('.close-button');
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

const displayPosts = (posts, classifiedLoggedInUser) => {
    const userIdOfLoggedInUser = classifiedLoggedInUser ? classifiedLoggedInUser.id : null;
    const followsOfLoggedInUser = classifiedLoggedInUser ? classifiedLoggedInUser.follows : null;

    postsDiv.innerHTML = '';
    posts.forEach((post, index) => {
        // ログインしているユーザが投稿した投稿は表示しないように。
        if (classifiedLoggedInUser && post.author === userIdOfLoggedInUser) {
            return;
        }

        // 投稿者の情報を取得するし、投稿者のプロフィールを作成する。
        const authorInfo = getUserFromKey(post.author, 'id');
        const classifiedUser = new User(authorInfo.id, authorInfo.firstName, authorInfo.lastName, authorInfo.accountName, authorInfo.email, authorInfo.password, authorInfo.bio, authorInfo.profilePicture, authorInfo.posts, authorInfo.follows);
        const authorDiv = classifiedUser.createProfileOnPost(classifiedLoggedInUser);

        // 投稿の情報を取得し、投稿のHTMLを作成する。
        const classifiedPost = new Post(post.id, post.author, post.title, post.content, post.imageUrl, post.timestamp, post.likes, post.comments);
        console.log('This is classifiedPost: ', classifiedPost);
        const postElement = classifiedPost.createPostElement(classifiedLoggedInUser);

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

    displayPosts(posts, classifiedLoggedInUser);

    searchButton.addEventListener('click', (e) => {
        handledSearchButtonClicked(e, classifiedLoggedInUser, users);
    });
}