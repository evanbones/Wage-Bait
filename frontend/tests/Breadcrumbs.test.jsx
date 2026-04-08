import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumbs from '../src/components/Breadcrumbs/Breadcrumbs.jsx';
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn();

describe('Breadcrumbs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render on home page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    expect(screen.queryByLabelText('Breadcrumb')).not.toBeInTheDocument();
  });

  it('renders correctly on login page', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders correctly on search results with selected job', async () => {
    const mockJob = { _id: '507f1f77bcf86cd799439011', title: 'Software Engineer', location: 'Remote' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    render(
      <MemoryRouter initialEntries={['/search?jobId=507f1f77bcf86cd799439011']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search Results')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/Software Engineer \(Remote\)/)).toBeInTheDocument();
    });
  });

  it('renders correctly on standalone job details page', async () => {
    const mockJob = { _id: '507f1f77bcf86cd799439011', title: 'Product Manager', location: 'New York' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockJob,
    });

    render(
      <MemoryRouter initialEntries={['/jobs/507f1f77bcf86cd799439011']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Product Manager \(New York\)/)).toBeInTheDocument();
    });
  });

  it('stacks My Profile before My Postings', () => {
    render(
      <MemoryRouter initialEntries={['/my-postings']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('My Postings')).toBeInTheDocument();
  });
});
