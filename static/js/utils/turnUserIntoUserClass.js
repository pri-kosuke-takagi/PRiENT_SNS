import { User } from "/static/js/classes/UserClass.js";

/**
 * ユーザオブジェクトをUserクラスに変換する
 */
export const turnUserIntoUserClass = (user) => {
    return new User(user.id, user.firstName, user.lastName, user.accountName, user.email, user.password, user.sex, user.dateOfBirth, user.bio, user.profilePicture, user.posts, user.follows, user.savedPosts);
}