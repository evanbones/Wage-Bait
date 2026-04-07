import { jest } from '@jest/globals';
import * as userService from '../services/userService.js';
import User from '../models/users.model.js';
import Job from '../models/job.model.js';

jest.spyOn(User, 'findById');
jest.spyOn(Job, 'find');

const validId1 = '507f1f77bcf86cd799439011';

describe('userService tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const mockUser = { _id: validId1, username: 'testuser' };
      User.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(validId1);

      expect(User.findById).toHaveBeenCalledWith(validId1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUserProfile', () => {
    it('should update user fields and save', async () => {
      const mockUser = {
        _id: validId1,
        username: 'oldname',
        save: jest.fn().mockResolvedValue({ _id: validId1, username: 'newname' })
      };
      User.findById.mockResolvedValue(mockUser);

      const updateData = { username: 'newname' };
      const result = await userService.updateUserProfile(validId1, updateData);

      expect(User.findById).toHaveBeenCalledWith(validId1);
      expect(mockUser.username).toBe('newname');
      expect(mockUser.save).toHaveBeenCalled();
      expect(result.username).toBe('newname');
    });

    it('should throw error if user not found', async () => {
      User.findById.mockResolvedValue(null);

      await expect(userService.updateUserProfile(validId1, {})).rejects.toThrow('User not found');
    });
  });

  describe('getUserApplications', () => {
    it('should return jobs with the user\'s bid', async () => {
      const mockJobs = [
        {
          _id: 'job1',
          bids: [{ userId: validId1, minimumSalary: 1000 }, { userId: 'other', minimumSalary: 2000 }],
          toObject: function() { return { _id: this._id, bids: this.bids }; }
        }
      ];
      Job.find.mockResolvedValue(mockJobs);

      const result = await userService.getUserApplications(validId1);

      expect(Job.find).toHaveBeenCalledWith({ "bids.userId": validId1 });
      expect(result[0].myBid.minimumSalary).toBe(1000);
    });
  });
});
