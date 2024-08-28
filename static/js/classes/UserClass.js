import { createUrlFromImageFile } from "../utils/createUrlFromImageFile.js";
import { turnUserIntoUserClass } from "../utils/turnUserIntoUserClass.js";
import { updateUserData } from "../utils/updateUserData.js";
export class User {
    constructor(id, firstName, lastName, accountName, email, password, sex = "other", dateOfBirth = "", bio = "", profilePicture = "", posts = [], follows = [], savedPosts = []) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.accountName = accountName;
        this.email = email;
        this.password = password;
        this.sex = sex,
        this.dateOfBirth = dateOfBirth;
        this.bio = bio;
        this.profilePicture = profilePicture;
        this.posts = posts;
        this.follows = follows;
        this.savedPosts = savedPosts;
    }

    /**
     * ログインするメソッド 
     */
    login(email, password, users) {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            console.log('Login successful');
            // セッションストレージにログインしたユーザのIDを保存する。
            // IDのみ保存する理由としては、ユーザ情報をローカルストレージで一元管理するため。
            sessionStorage.setItem('userId', JSON.stringify(user.id));
            return user;
        } else {
            console.log('Login failed');
            return null;
        }
    }

    /**
     * ユーザを登録するメソッド 
     * @returns {User | null} 登録したユーザ or null
     */
    register(users) {
        try {
            if (!this.email || !this.password) {
                console.log('Invalid parameters');
                return null;
            }
            if (users.find(u => u.email === this.email)) {
                console.log('Email already exists');
                return null;
            }

            const id = users[users.length - 1].id + 1;
            if (id) {
                this.id = id;
            } else {
                throw new Error('Error getting id');
            }

            sessionStorage.setItem('userId', JSON.stringify(this.id));
            return this;
        } catch (error) {
            console.error('Error registering user: ', error);
            return null;
        }
    }

    /**
     * ホーム画面のPostの上にユーザ情報を表示するHTMLを作成するためのメソッド
     */
    createProfileOnPost(loggedInUser) {
        const authorDiv = document.createElement('div');
        authorDiv.classList.add('user-div', 'd-flex', 'align-items-center', 'justify-content-between');
        const authorInfoDiv = document.createElement('div');
        authorInfoDiv.classList.add('d-flex', 'gap-2', 'align-items-center', 'justify-content-center');
        const accountImageDiv = document.createElement('div');
        accountImageDiv.classList.add('d-flex', 'gap-2', 'align-items-center', 'justify-content-center');
        const accountImageLink = document.createElement('a');
        accountImageLink.href = `/html/others_account.html?user_id=${this.id}`;
        const accountImage = document.createElement('img');
        accountImage.src = this.profilePicture;
        accountImage.alt = 'profile-picture';
        accountImage.classList.add('author-picture');
        accountImageDiv.appendChild(accountImageLink);
        accountImageLink.appendChild(accountImage);
        const accountName = document.createElement('div');
        accountName.classList.add('fs-6');
        accountName.textContent = this.accountName;
        authorInfoDiv.appendChild(accountImageDiv);
        authorInfoDiv.appendChild(accountName);
        authorDiv.appendChild(authorInfoDiv);
        const followButton = this.makeFollowButton(loggedInUser);
        authorDiv.appendChild(followButton);
        return authorDiv;
    }


    async addFollow(id) {
        this.follows.push(id);
        console.log('This is follows: ', this.follows);
        await updateUserData(this);
    }

    async removeFollow(id) {
        this.follows = this.follows.filter(f => f !== id);
        console.log('This is follows: ', this.follows);
        await updateUserData(this);
    }

    /**
     * ホーム画面のSearchModalの部分に表示させるユーザ情報を作成するためのメソッド
     */
    createProfileInSearchModal(loggedInUser) {
        const authorDiv = document.createElement('div');
        authorDiv.classList.add('user-div', 'd-flex', 'align-items-center', 'justify-content-between');
        const authorInfoDiv = document.createElement('div');
        authorInfoDiv.classList.add('d-flex', 'gap-2', 'align-items-center', 'justify-content-center');
        const authorInfoImage = document.createElement('img');
        authorInfoImage.src = this.profilePicture;
        authorInfoImage.alt = 'profile-picture';
        authorInfoImage.classList.add('author-picture');
        const authorInfoName = document.createElement('div');
        authorInfoName.classList.add('fs-6');
        authorInfoName.textContent = this.accountName;
        authorInfoDiv.appendChild(authorInfoImage);
        authorInfoDiv.appendChild(authorInfoName);
        authorDiv.appendChild(authorInfoDiv);
        const followButton = this.makeFollowButton(loggedInUser);
        authorDiv.appendChild(followButton);
        return authorDiv;
    }

    /**
     * フォローボタンを作成する。
     */
    makeFollowButton(classifiedLoggedInUser) {
        const followButton = document.createElement('button');
        const isFollowing = classifiedLoggedInUser.follows.includes(this.id);
        followButton.classList.add(`follow-button-${this.id}`, 'btn', 'btn-outline-success', 'fs-6');
        if (isFollowing) {
            followButton.classList.add('following-btn');
            followButton.textContent = 'フォロー済み';
        } else {
            followButton.classList.add('not-follow-btn');
            followButton.textContent = 'フォローする';
        }
        followButton.addEventListener('click', async () => {
            const followButtonsWithSameId = document.querySelectorAll(`.follow-button-${this.id}`);
            // まだフォローしていない場合のクリック
            if (followButton.classList.contains('not-follow-btn')) {
                followButtonsWithSameId.forEach(f => {
                    f.classList.add('following-btn');
                    f.classList.remove('not-follow-btn');
                    f.textContent = 'フォロー済み';
                    classifiedLoggedInUser.addFollow(this.id);
                })
            } else {
                // すでにフォローしている場合
                followButtonsWithSameId.forEach(f => {
                    f.classList.add('not-follow-btn');
                    f.classList.remove('following-btn');
                    f.textContent = 'フォローする';
                    classifiedLoggedInUser.removeFollow(this.id);
                })
            }
        });
        return followButton;
    }

    /**
     * ユーザ情報を他者アカウント表示画面に表示させるためのHTMLを作成するメソッド
     */
    createProfileOnOthersPage(loggedInUser) {
        const authorDiv = document.createElement('div');
        authorDiv.classList.add('user-div');
        const authorInfoDiv = document.createElement('div');
        authorInfoDiv.classList.add('user-info-div', 'd-flex', 'gap-2', 'align-items-center', 'justify-content-center');
        const accountImageDiv = document.createElement('div');
        accountImageDiv.classList.add('d-flex', 'gap-2', 'align-items-center', 'justify-content-center');
        const accountImageLink = document.createElement('a');
        accountImageLink.href = `/html/others_account.html?user_id=${this.id}`;
        const accountImage = document.createElement('img');
        accountImage.src = this.profilePicture;
        accountImage.alt = 'profile-picture';
        accountImage.classList.add('author-picture');
        accountImageDiv.appendChild(accountImageLink);
        accountImageLink.appendChild(accountImage);
        const accountName = document.createElement('div');
        accountName.classList.add('fs-3');
        accountName.textContent = this.accountName;
        authorInfoDiv.appendChild(accountImageDiv);
        authorInfoDiv.appendChild(accountName);
        authorDiv.appendChild(authorInfoDiv);
        const followButton = this.makeFollowButton(loggedInUser);
        followButton.classList.add('follow-button');
        authorDiv.appendChild(followButton);
        return authorDiv;
    }
}
