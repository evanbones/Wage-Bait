import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButton from '../src/components/ActionButton/ActionButton';

// super useful frontend tests :)

describe('ActionButton', () => {
  it('renders children correctly', () => {
    render(<ActionButton>Click Me</ActionButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ActionButton onClick={handleClick}>Click Me</ActionButton>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    render(<ActionButton disabled={true}>Disabled</ActionButton>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('has the correct type', () => {
    render(<ActionButton type="submit">Submit</ActionButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
