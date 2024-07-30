import { createUrlFromImageFile } from "../utils/createUrlFromImageFile.js";
import { updateUserData } from "../utils/updateUserData.js";
export class User {
    constructor(id, firstName, lastName, accountName, email, password, bio = "", profilePicture = "") {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.accountName = accountName;
        this.email = email;
        this.bio = bio;
        this.profilePicture = profilePicture;
        this.password = password;
        this.posts = [];
        this.follows = [];
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
    async register(firstName, lastName, accountName, email, password, bio, profilePicture, users) {
        try {
            if (users.find(u => u.email === email)) {
                console.log('Email already exists');
                return null;
            }

            let urlOfBlob = await createUrlFromImageFile(profilePicture);
            console.log('This is urlOfBlob: ', urlOfBlob);

            const id = users.length + 1;
            const user = new User(id, firstName, lastName, accountName, email, password, bio, urlOfBlob);

            sessionStorage.setItem('userId', JSON.stringify(user.id));
            return user;
        } catch (error) {
            console.error('Error registering user: ', error);
            return null;
        }
    }

    /**
     * ホーム画面のPostの上にユーザ情報を表示するHTMLを作成するためのメソッド
     */
    createProfileOnPost(follows = []) {
        const isFollowing = follows.includes(this.id);
        const authorDiv = document.createElement('div');
        authorDiv.classList.add('user-div', 'd-flex', 'align-items-center', 'justify-content-between');
        authorDiv.innerHTML = `
            <div class="d-flex gap-2 align-items-center justify-content-center">
                <img src="${this.profilePicture}" alt="profile-picture" class="author-picture"/>
                <div class="fs-6">${this.accountName}</div>
            </div>
        `;
        const followButton = document.createElement('button');
        followButton.classList.add('follow-button');
        if (isFollowing) {
            followButton.classList.add('following-btn');
            followButton.textContent = 'フォロー済み';
        } else {
            followButton.classList.add('not-follow-btn');
            followButton.textContent = 'フォローする';
        }
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

    addPost(post) {
        this.posts.push(post);
    }

    removePost(postId) {
        this.posts = this.posts.filter(p => p.id !== postId);
    }

    updateProfile(bio, profilePicture) {
        this.bio = bio;
        this.profilePicture = profilePicture;
    }

    getProfile() {
        return {
            username: this.username,
            email: this.email,
            bio: this.bio,
            profilePicture: this.profilePicture,
            friends: this.friends,
            posts: this.posts
        };
    }
}
