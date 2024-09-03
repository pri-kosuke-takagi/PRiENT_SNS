import { User } from "/static/js/classes/UserClass.js";

/**
 * ユーザオブジェクトをUserクラスに変換する
 * このような関数を作ることで、クラス化を一元化するのに役立つ。
 */
export const turnUserIntoUserClass = (user) => {
    console.log('user in turnUserIntoUserClass: ', user);
    return new User(user.id, user.firstName, user.lastName, user.accountName, user.email, user.password, user.sex, user.dateOfBirth, user.bio, user.profilePicture, user.posts, user.follows, user.savedPosts);
}