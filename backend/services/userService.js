import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../data');

export function saveUser(newUser) {
    const usersFile = path.join(DATA_PATH, 'users.json');
    
    return new Promise((resolve, reject) => {
        fs.readFile(usersFile, 'utf8', (err, data) => {
            let users = [];
            if (!err && data) {
                users = JSON.parse(data);
            }

            users.push(newUser);
            fs.writeFile(usersFile, JSON.stringify(users, null, 2), (writeErr) => {
                if (writeErr) {
                    reject(writeErr);
                } else {
                    resolve(newUser);
                }
            });
        });
    });
}
