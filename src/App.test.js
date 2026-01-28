import React from 'react';
import { render, screen } from '@testing-library/react';
import { Quotes } from './Quotes';

test('renders Simpsons quote generator', () => {
  render(<Quotes />);
  const titleElement = screen.getByText(/The Simpsons Quote Generator v2/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders subtitle', () => {
  render(<Quotes />);
  const subtitleElement = screen.getByText(/\(Mostly Homer\)/i);
  expect(subtitleElement).toBeInTheDocument();
});
