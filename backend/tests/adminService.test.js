import { jest } from '@jest/globals';
import * as adminService from '../services/adminService.js';
import User from '../models/users.model.js';

jest.spyOn(User, 'find');
jest.spyOn(User, 'findById');

const validAdminId = '507f1f77bcf86cd799439011';
const validUserId = '507f1f77bcf86cd799439012';

describe('adminService tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users with specified fields', async () => {
      const mockUsers = [{ username: 'user1' }, { username: 'user2' }];
      User.find.mockResolvedValue(mockUsers);

      const result = await adminService.getAllUsers();

      expect(User.find).toHaveBeenCalledWith({}, "username email role isActive profilePic skills");
      expect(result).toEqual(mockUsers);
    });

    it('should filter users if searchTerm is provided', async () => {
      User.find.mockResolvedValue([]);
      await adminService.getAllUsers('test');
      expect(User.find).toHaveBeenCalledWith(
        {
          $or: [
            { username: { $regex: 'test', $options: 'i' } },
            { email: { $regex: 'test', $options: 'i' } }
          ]
        },
        expect.any(String)
      );
    });
  });

  describe('toggleUserStatus', () => {
    it('should toggle user isActive status if admin', async () => {
      const mockAdmin = { _id: validAdminId, role: 'admin' };
      const mockUser = { _id: validUserId, isActive: true, save: jest.fn().mockResolvedValue(true) };

      User.findById.mockImplementation((id) => {
        if (id === validAdminId) return Promise.resolve(mockAdmin);
        if (id === validUserId) return Promise.resolve(mockUser);
        return Promise.resolve(null);
      });

      const result = await adminService.toggleUserStatus(validUserId, validAdminId);

      expect(mockUser.isActive).toBe(false);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw error if not an admin', async () => {
      const mockNotAdmin = { _id: validAdminId, role: 'user' };
      User.findById.mockResolvedValue(mockNotAdmin);

      await expect(adminService.toggleUserStatus(validUserId, validAdminId)).rejects.toThrow('Unauthorized: Only admins can perform this action.');
    });

    it('should throw error if user not found', async () => {
      const mockAdmin = { _id: validAdminId, role: 'admin' };
      User.findById.mockImplementation((id) => {
        if (id === validAdminId) return Promise.resolve(mockAdmin);
        return Promise.resolve(null);
      });

      await expect(adminService.toggleUserStatus(validUserId, validAdminId)).rejects.toThrow('User not found.');
    });
  });
});
