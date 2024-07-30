import { fetchUserSampleData } from "./utils/fetchUserSampleData.js";
import { fetchPostSampleData } from "./utils/fetchPostSampleData.js";
import { Post } from "./classes/PostClass.js";
import { User } from "./classes/UserClass.js";
import { checkIfUserLoggedIn } from "./utils/checkIfUserLoggedIn.js";
import { getUserFromKey } from "./utils/getUserFromKey.js";

const postsDiv = document.querySelector('#posts-div');

const displayPosts = (posts, loggedInUser) => {
    const classifiedLoggedInUser = new User(loggedInUser.id, loggedInUser.firstName, loggedInUser.lastName, loggedInUser.accountName, loggedInUser.email, loggedInUser.password, loggedInUser.bio, loggedInUser.profilePicture, loggedInUser.posts, loggedInUser.follows);
    const userIdOfLoggedInUser = loggedInUser ? loggedInUser.id : null;
    const followsOfLoggedInUser = loggedInUser ? loggedInUser.follows : null;

    postsDiv.innerHTML = '';
    posts.forEach((post, index) => {
        // ログインしているユーザが投稿した投稿は表示しないように。
        if (loggedInUser && post.author === userIdOfLoggedInUser) {
            return;
        }

        // 投稿者の情報を取得するし、投稿者のプロフィールを作成する。
        const authorInfo = getUserFromKey(post.author, 'id');
        const classifiedUser = new User(authorInfo.id, authorInfo.firstName, authorInfo.lastName, authorInfo.accountName, authorInfo.email, authorInfo.password, authorInfo.bio, authorInfo.profilePicture, authorInfo.posts, authorInfo.follows);
        const authorDiv = classifiedUser.createProfileOnPost(followsOfLoggedInUser);
        // フォローボタンのイベントリスナーを追加する。
        const followButton = authorDiv.querySelector('.follow-button');
        followButton.addEventListener('click', async () => {
            async function updateFollowStatus() {
                // まだフォローしていない場合
                if (followButton.classList.contains('not-follow-btn')) {
                    followButton.classList.add('following-btn');
                    followButton.classList.remove('not-follow-btn');
                    followButton.textContent = 'フォロー済み';
                    await classifiedLoggedInUser.addFollow(classifiedUser.id);
                } else {
                    // すでにフォローしている場合
                    followButton.classList.add('not-follow-btn');
                    followButton.classList.remove('following-btn');
                    followButton.textContent = 'フォローする';
                    await classifiedLoggedInUser.removeFollow(classifiedUser.id);
                }
            }
            await updateFollowStatus();
        });

        // 投稿の情報を取得し、投稿のHTMLを作成する。
        const classifiedPost = new Post(post.id, post.author, post.title, post.content, post.imageUrl, post.timestamp, post.likes, post.comments);
        const postElement = classifiedPost.createPostElement();

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

    displayPosts(posts, loggedInUser);

}