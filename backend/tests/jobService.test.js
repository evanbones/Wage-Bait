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
});
