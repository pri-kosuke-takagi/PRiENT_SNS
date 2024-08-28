import { turnUserIntoUserClass } from "./turnUserIntoUserClass.js";
import { User } from "/static/js/classes/UserClass.js";

/**
 * ユーザオブジェクトを指定されたKeyから取得する。
 * @param {string} value - 取得したいユーザの値
 * @param {string} key - 取得したいユーザのキー
 * @param {boolean} isGetttingClassifiedUser - classifiedUserを取得するかどうか
 */
export const getUserFromKey = (value, key, isGetttingClassifiedUser = false) => {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u[key] === value);
    if (!isGetttingClassifiedUser) {
        return user;
    } else {
        return turnUserIntoUserClass(user);
    }
}