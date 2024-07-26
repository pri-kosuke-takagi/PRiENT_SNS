class User {
    constructor(username, email, bio = "", profilePicture = "") {
        this.username = username;
        this.email = email;
        this.bio = bio;
        this.profilePicture = profilePicture;
        this.friends = [];
        this.posts = [];
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
