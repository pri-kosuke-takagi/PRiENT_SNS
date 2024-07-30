
/**
 * 新しいユーザデータを引数に取りユーザデータを更新する
 */
export const updateUserData = async (newUserData) => {
    let users = JSON.parse(localStorage.getItem('users'));
    // ユーザが存在する場合は、新しいユーザデータでユーザを更新する
    const updateUsers = users.map(user => {
        if (user.id === newUserData.id) {
            return newUserData;
        } else {
            return user;
        }
    });
    localStorage.setItem('users', JSON.stringify(updateUsers));
}