import { getUserFromKey } from './getUserFromKey.js';
/**
 * ユーザがログインしているかをセッションストレージからチェックする
 * @returns {User | null} ログインしているユーザ or null
 */
export const checkIfUserLoggedIn = () => {

    const userId = JSON.parse(sessionStorage.getItem('userId'));
    const loggedInUser = getUserFromKey(userId, 'id');
    console.log('This is loggedInUser: ', loggedInUser);

    if (!loggedInUser) {
        console.log('Please login to access this page');
        return null;
    } else {
        return loggedInUser;
    }
}