import { createUrlFromImageFile } from "../utils/createUrlFromImageFile.js";
import { turnUserIntoUserClass } from "../utils/classTransfers/turnUserIntoUserClass.js";
import { updateUserData } from "../utils/updateData/updateUserData.js";
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
     * ログアウトするメソッド
     */
    logout() {
        sessionStorage.removeItem('userId');
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

        const accountImageDiv = this.createImageOfProfile();

        const accountName = this.createDivForProfileName(['fs-6']);

        authorInfoDiv.appendChild(accountImageDiv);
        authorInfoDiv.appendChild(accountName);

        const followButton = this.makeFollowButton(loggedInUser);

        authorDiv.appendChild(authorInfoDiv);
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

        const authorInfoImage = this.createImageOfProfile();

        const authorInfoName = this.createDivForProfileName(['fs-6']);

        authorInfoDiv.appendChild(authorInfoImage);
        authorInfoDiv.appendChild(authorInfoName);

        const followButton = this.makeFollowButton(loggedInUser);

        authorDiv.appendChild(authorInfoDiv);
        authorDiv.appendChild(followButton);
        return authorDiv;
    }

    /**
     * ユーザ情報を他者アカウント表示画面に表示させるためのHTMLを作成するメソッド
     */
    createProfileOnOthersPage(loggedInUser) {
        const authorDiv = document.createElement('div');
        authorDiv.classList.add('user-div');

        const authorInfoDiv = document.createElement('div');
        authorInfoDiv.classList.add('user-info-div', 'd-flex', 'gap-2', 'align-items-center', 'justify-content-center');
        const accountImageDiv = this.createImageOfProfile();

        const accountName = this.createDivForProfileName(['fs-3']);

        authorInfoDiv.appendChild(accountImageDiv);
        authorInfoDiv.appendChild(accountName);

        const followButton = this.makeFollowButton(loggedInUser);
        followButton.classList.add('follow-button');

        authorDiv.appendChild(authorInfoDiv);
        authorDiv.appendChild(followButton);

        return authorDiv;
    }

    /**
     * ユーザのフルネームを返す
     */
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    /**
     * ユーザのプロファイル名を返す
     * @param {string[]} 名前divのクラス名 
     */
    createDivForProfileName(className) {
        const accountName = document.createElement('div');
        accountName.classList.add(...className);
        accountName.textContent = this.accountName;
        return accountName;
    }

    /**
     * コメントの上にユーザ情報を表示するHTMLを作成するためのメソッド
     */
    createProfileOnComment() {
        const authorDiv = document.createElement('div');

        authorDiv.classList.add('user-div', 'd-flex', 'align-items-center', 'justify-content-between');

        const authorInfoDiv = document.createElement('div');
        authorInfoDiv.classList.add('d-flex', 'gap-2', 'align-items-center', 'justify-content-center');

        const accountImageDiv = this.createImageOfProfile();

        const accountName = this.createDivForProfileName(['fs-6']);

        authorInfoDiv.appendChild(accountImageDiv);
        authorInfoDiv.appendChild(accountName);
        authorDiv.appendChild(authorInfoDiv);

        return authorDiv;
    }

    /**
     * ユーザのプロフィールの画像部分を作成するためのHTMLを作成するメソッド
     */
    createImageOfProfile() {
        const accountImageDiv = document.createElement('div');
        accountImageDiv.classList.add('d-flex', 'gap-2', 'align-items-center', 'justify-content-center');

        const accountImageLink = this.createLinkToProfile();

        const accountImage = this.createProfileImage(['author-picture']);

        accountImageDiv.appendChild(accountImageLink);
        accountImageLink.appendChild(accountImage);

        return accountImageDiv;
    }

    /**
     * ユーザのプロファイル画面へのリンクを作成する
     */
    createLinkToProfile() {
        const accountImageLink = document.createElement('a');
        accountImageLink.href = `/views/html/others_account.html?user_id=${this.id}`;
        return accountImageLink;
    }

    /**
     * ユーザのプロフィール画像(img)を作成する
     */
    createProfileImage(className = null) {
        console.log('This is profilePicture: ', this.profilePicture);
        const accountImage = document.createElement('img');
        accountImage.src = this.profilePicture;
        accountImage.alt = 'profile-picture';
        if (className !== null) {
            accountImage.classList.add(...className);
        }
        return accountImage;
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
     * ユーザの情報（更新も可能な情報）を表示させる。
     */
    createUserInfoDiv() {
        const userInfoDiv = document.createElement('div');
        userInfoDiv.classList.add('user-info-div', 'd-flex', 'gap-2', 'align-items-center', 'justify-content-center');

        const accountImageDiv = this.createImageOfProfile();

        const accountName = this.createDivForProfileNameInput(['fs-3']);

        const dateOfBirthDiv = this.createDivForDateOfBirth();

        userInfoDiv.appendChild(accountImageDiv);
        userInfoDiv.appendChild(accountName);
        userInfoDiv.appendChild(dateOfBirthDiv);

        return userInfoDiv;
    }

    /**
     * ユーザの名前を更新できるようなDivを作成する。
     */
    createDivForProfileNameInput(className) {
        const accountNameDiv = document.createElement('div');
        accountNameDiv.classList.add(...className);

        const accountNameLabel = document.createElement('label');
        accountNameLabel.classList.add('fs-6');
        accountNameLabel.textContent = 'アカウント名:';

        const accountNameInput = document.createElement('input');
        accountNameInput.type = 'text';
        accountNameInput.id = 'account-name';
        accountNameInput.value = this.accountName;
        accountNameInput.addEventListener('change', (e) => {
            this.accountName = e.target.value;
        });

        accountNameDiv.appendChild(accountNameLabel);
        accountNameDiv.appendChild(accountNameInput);

        return accountNameDiv;
    }

    /**
     * ユーザの誕生日の情報のDivを作成する。
     */
    createDivForDateOfBirth() {
        const dateOfBirthDiv = document.createElement('div');
        
        const dateOfBirthLabel = document.createElement('label');
        dateOfBirthLabel.classList.add('fs-6');
        dateOfBirthLabel.textContent = '生年月日:';

        const dateOfBirthInput = document.createElement('input');
        dateOfBirthInput.type = 'date';
        dateOfBirthInput.id = 'date-of-birth';
        dateOfBirthInput.value = this.dateOfBirth;
        dateOfBirthInput.addEventListener('change', (e) => {
            this.dateOfBirth = e.target.value;
        });

        dateOfBirthDiv.appendChild(dateOfBirthLabel);
        dateOfBirthDiv.appendChild(dateOfBirthInput);

        return dateOfBirthDiv;
    }
}
