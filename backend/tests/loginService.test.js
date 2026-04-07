import { jest } from '@jest/globals';
import * as loginService from '../services/loginService.js';
import User from '../models/users.model.js';

jest.spyOn(User, 'findOne');

describe('loginService tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUser', () => {
    it('should return a user by username', async () => {
      const mockUser = { username: 'testuser', password: 'hashedpassword' };
      User.findOne.mockResolvedValue(mockUser);

      const result = await loginService.findUser('testuser');

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await loginService.findUser('nonexistent');

      expect(result).toBeNull();
    });
  });
});
