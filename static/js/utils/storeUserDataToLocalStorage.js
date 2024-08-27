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
    // ユーザがローカルストレージに保存されている場合は、情報を更新する。
    if (users.find(u => u.id === user.id)) {
        users = users.map(u => {
            if (u.id === user.id) {
                u = user;
            }
            return u;
        });
    } else {
        users.push(user);
    }
    localStorage.setItem('users', JSON.stringify(users));
}