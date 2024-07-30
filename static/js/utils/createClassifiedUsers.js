import { User } from '../classes/UserClass.js';


/**
 * usersのArrayデータをクラス化する。
 */
export const createClassifiedUsers = (users) => {
    const classifiedUsers = users.map(user => {
        return new User(user.id, user.firstName, user.lastName, user.accountName, user.email, user.password, user.bio, user.profilePicture, user.posts, user.follows);
    });
    return classifiedUsers;
}