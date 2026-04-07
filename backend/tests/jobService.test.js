import { jest } from '@jest/globals';
import * as jobService from '../services/jobService.js';
import Job from '../models/job.model.js';
import User from '../models/users.model.js';

// simple mock for demonstration
jest.spyOn(Job, 'find');
jest.spyOn(Job, 'findById');
jest.spyOn(Job, 'findByIdAndUpdate');
jest.spyOn(Job, 'findByIdAndDelete');
jest.spyOn(User, 'findById');

const validId1 = '507f1f77bcf86cd799439011';
const validId2 = '507f1f77bcf86cd799439012';
const validId3 = '507f1f77bcf86cd799439013';

describe('jobService tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchJobs', () => {
    it('should return a list of jobs matching the search term', async () => {
      const mockJobs = [{ title: 'Developer', company: 'Tech Inc' }];
      Job.find.mockResolvedValue(mockJobs);

      const result = await jobService.searchJobs('Developer');

      expect(Job.find).toHaveBeenCalled();
      expect(result).toEqual(mockJobs);
    });

    it('should throw an error if searching fails', async () => {
      Job.find.mockRejectedValue(new Error('DB Error'));

      await expect(jobService.searchJobs('test')).rejects.toThrow('Failed to search jobs in database.');
    });
  });

  describe('getJobById', () => {
    it('should return a job by ID', async () => {
      const mockJob = { _id: validId1, title: 'Developer' };
      Job.findById.mockResolvedValue(mockJob);

      const result = await jobService.getJobById(validId1);

      expect(Job.findById).toHaveBeenCalledWith(validId1);
      expect(result).toEqual(mockJob);
    });
  });

  describe('deleteComment', () => {
    it('should call findById and delete the comment if authorized', async () => {
      const mockComment = { _id: validId2, userId: validId3, toString: () => validId2 };
      const mockJob = {
        _id: validId1,
        comments: {
          id: jest.fn().mockReturnValue(mockComment),
          pull: jest.fn()
        },
        save: jest.fn().mockResolvedValue(true)
      };
      const mockUser = { _id: validId3, role: 'user' };
      
      Job.findById.mockResolvedValue(mockJob);
      User.findById.mockResolvedValue(mockUser);

      const result = await jobService.deleteComment(validId1, validId2, validId3);

      expect(Job.findById).toHaveBeenCalledWith(validId1);
      expect(User.findById).toHaveBeenCalledWith(validId3);
      expect(mockJob.comments.id).toHaveBeenCalledWith(validId2);
      expect(mockJob.comments.pull).toHaveBeenCalledWith(validId2);
      expect(mockJob.save).toHaveBeenCalled();
    });

    it('should allow admin to delete any comment', async () => {
        const mockComment = { _id: validId2, userId: 'anotherUser', toString: () => validId2 };
        const mockJob = {
          _id: validId1,
          comments: {
            id: jest.fn().mockReturnValue(mockComment),
            pull: jest.fn()
          },
          save: jest.fn().mockResolvedValue(true)
        };
        const mockAdmin = { _id: validId3, role: 'admin' };
        
        Job.findById.mockResolvedValue(mockJob);
        User.findById.mockResolvedValue(mockAdmin);
  
        await jobService.deleteComment(validId1, validId2, validId3);
  
        expect(mockJob.comments.pull).toHaveBeenCalledWith(validId2);
        expect(mockJob.save).toHaveBeenCalled();
      });

    it('should throw error if comment not found', async () => {
      const mockJob = {
        _id: validId1,
        comments: {
          id: jest.fn().mockReturnValue(null)
        }
      };
      Job.findById.mockResolvedValue(mockJob);

      await expect(jobService.deleteComment(validId1, validId2, validId3)).rejects.toThrow('Comment not found.');
    });

    it('should throw error if unauthorized', async () => {
      const mockComment = { _id: validId2, userId: 'differentUser' };
      const mockJob = {
        _id: validId1,
        comments: {
          id: jest.fn().mockReturnValue(mockComment)
        }
      };
      const mockUser = { _id: validId3, role: 'user' };

      Job.findById.mockResolvedValue(mockJob);
      User.findById.mockResolvedValue(mockUser);

      await expect(jobService.deleteComment(validId1, validId2, validId3)).rejects.toThrow('Unauthorized to delete this comment.');
    });
  });

  describe('createJob', () => {
    it('should create and save a new job', async () => {
      const jobData = { title: 'New Job', salary: 1000, postedBy: validId3 };
    });
  });
});
