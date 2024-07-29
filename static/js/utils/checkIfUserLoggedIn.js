/**
 * ユーザがログインしているかをセッションストレージからチェックする
 * @returns {User | null} ログインしているユーザ or null
 */
export const checkIfUserLoggedIn = () => {

    const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    console.log('This is loggedInUser: ', loggedInUser);

    if (!loggedInUser) {
        console.log('Please login to access this page');
        return null;
    } else {
        return loggedInUser;
    }
}