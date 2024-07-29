import { createUrlFromImageFile } from "../utils/createUrlFromImageFile.js";
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
            // セッションストレージにログインしたユーザを保存する。
            sessionStorage.setItem('user', JSON.stringify(user));
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
            return user;
        } catch (error) {
            console.error('Error registering user: ', error);
            return null;
        }
    }

    addFriend(friend) {
        this.friends.push(friend);
    }

    removeFriend(friend) {
        this.friends = this.friends.filter(f => f !== friend);
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
