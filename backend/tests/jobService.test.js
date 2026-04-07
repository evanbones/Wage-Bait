import { jest } from '@jest/globals';
import * as jobService from '../services/jobService.js';
import Job from '../models/job.model.js';

// simple mock for demonstration
jest.spyOn(Job, 'find');
jest.spyOn(Job, 'findById');

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
      const mockJob = { _id: '123', title: 'Developer' };
      Job.findById.mockResolvedValue(mockJob);

      const result = await jobService.getJobById('123');

      expect(Job.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockJob);
    });
  });

  describe('deleteComment', () => {
    it('should call findById and delete the comment if authorized', async () => {
      const mockComment = { _id: 'c1', userId: 'u1', toString: () => 'c1' };
      const mockJob = {
        _id: 'j1',
        comments: {
          id: jest.fn().mockReturnValue(mockComment),
          pull: jest.fn()
        },
        save: jest.fn().mockResolvedValue(true)
      };
      
      Job.findById.mockResolvedValue(mockJob);

      const result = await jobService.deleteComment('j1', 'c1', 'u1');

      expect(Job.findById).toHaveBeenCalledWith('j1');
      expect(mockJob.comments.id).toHaveBeenCalledWith('c1');
      expect(mockJob.comments.pull).toHaveBeenCalledWith('c1');
      expect(mockJob.save).toHaveBeenCalled();
    });

    it('should throw error if comment not found', async () => {
      const mockJob = {
        _id: 'j1',
        comments: {
          id: jest.fn().mockReturnValue(null)
        }
      };
      Job.findById.mockResolvedValue(mockJob);

      await expect(jobService.deleteComment('j1', 'c2', 'u1')).rejects.toThrow('Comment not found.');
    });

    it('should throw error if unauthorized', async () => {
      const mockComment = { _id: 'c1', userId: 'u2' };
      const mockJob = {
        _id: 'j1',
        comments: {
          id: jest.fn().mockReturnValue(mockComment)
        }
      };
      Job.findById.mockResolvedValue(mockJob);

      await expect(jobService.deleteComment('j1', 'c1', 'u1')).rejects.toThrow('Unauthorized to delete this comment.');
    });
  });
});
