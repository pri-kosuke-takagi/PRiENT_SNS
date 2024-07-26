export class User {
    constructor(name, username, email, bio = "", profilePicture = "", password) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.bio = bio;
        this.profilePicture = profilePicture;
        this.password = password;
        this.friends = [];
        this.posts = [];
    }

    login(email, password, users) {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            console.log('Login successful');
            return user;
        } else {
            console.log('Login failed');
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
