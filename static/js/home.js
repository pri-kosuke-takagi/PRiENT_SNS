import { fetchUserSampleData } from "./utils/fetchUserSampleData.js";
import { fetchPostSampleData } from "./utils/fetchPostSampleData.js";
import { Post } from "./classes/PostClass.js";
import { checkIfUserLoggedIn } from "./utils/checkIfUserLoggedIn.js";
import { getUserFromKey } from "./utils/getUserFromKey.js";

const postsDiv = document.querySelector('#posts-div');

const displayPosts = (posts, user) => {
    postsDiv.innerHTML = '';

    posts.forEach((post, index) => {
        // ログインしているユーザが投稿した投稿は表示しないように。
        if (post.author === user.id) {
            return;
        }
        const authorDiv = document.createElement('div');
        const authorInfo = getUserFromKey(post.author, 'id');
        authorDiv.classList.add('user-div', 'd-flex', 'align-items-center', 'justify-content-start');
        authorDiv.innerHTML = `
            <img src="${authorInfo.profilePicture}" alt="profile-picture" class="author-picture"/>
            <h5>${authorInfo.accountName}</h5>
        `;

        const classifiedPost = new Post(post.id, post.author, post.title, post.content, post.imageUrl, post.timestamp, post.likes, post.comments);
        const postElement = classifiedPost.createPostElement();

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

    displayPosts(posts, loggedInUser);
}