/**
 * ユーザオブジェクトを指定されたKeyから取得する。
 */
export const getUserFromKey = (value, key) => {
    const users = JSON.parse(localStorage.getItem('users'));
    return users.find(u => u[key] === value);
}