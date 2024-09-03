import { User } from '../classes/UserClass.js';
import { turnUserIntoUserClass } from './classTransfers/turnUserIntoUserClass.js';

/**
 * usersのArrayデータをクラス化する。
 */
export const createClassifiedUsers = (users) => {
    const classifiedUsers = users.map(user => {
        return turnUserIntoUserClass(user);
    });
    return classifiedUsers;
}