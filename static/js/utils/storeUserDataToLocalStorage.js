/**
 * ユーザデータをローカルストレージに保存する
 * @param {*} user 
 * @returns {void}
 */
export const storeUserDataToLocalStorage = (user) => {
    let users = JSON.parse(localStorage.getItem('users'));
    if (!users) {
        users = [];
    }
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}