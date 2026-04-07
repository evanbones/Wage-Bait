import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import Register from '../src/pages/Register/Register.jsx';
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

// mock fetch
global.fetch = jest.fn();

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders register form', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/johndoe/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/••••••••/i)).toHaveLength(2);
    expect(screen.getByRole('button', { name: /Get A Job!/i })).toBeInTheDocument();
  });

  it('shows error message if fields are empty', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Get A Job!/i }));

    expect(await screen.findByText(/Please fill in all fields/i)).toBeInTheDocument();
  });

  it('shows error if passwords do not match', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/johndoe/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), { target: { value: 'test@example.com' } });
    const passwords = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passwords[0], { target: { value: 'password123' } });
    fireEvent.change(passwords[1], { target: { value: 'password456' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Get A Job!/i }));

    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it('successful registration redirects to home', async () => {
    const mockUser = { id: '123', username: 'testuser' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Got yer data and saved it.', receivedData: mockUser }),
    });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/johndoe/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), { target: { value: 'test@example.com' } });
    const passwords = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passwords[0], { target: { value: 'password123' } });
    fireEvent.change(passwords[1], { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Get A Job!/i }));

    expect(await screen.findByText(/Registration successful!/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
      expect(screen.getByTestId('location-display')).toHaveTextContent('/');
    }, { timeout: 2000 });
  });
});
