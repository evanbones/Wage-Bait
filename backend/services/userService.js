import User from '../models/users.model.js';

export async function saveUser(newUser) {
    try {
        const user = new User(newUser);
        const savedUser = await user.save();
        return savedUser;
    } catch (error) {
        throw error;
    }
}
