import User from '../models/users.model.js';

export async function findUser(username) {
    try {
        const user = await User.findOne({ username });
        return user;
    } catch (error) {
        throw error;
    }
}