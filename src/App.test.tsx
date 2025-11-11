import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders automation test reporting dashboard', () => {
  render(<App />);
  const headerElement = screen.getByText(/Automation Test Reporting Dashboard/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders summary cards', () => {
  render(<App />);
  const totalTestsElement = screen.getByText(/Total Tests/i);
  expect(totalTestsElement).toBeInTheDocument();
});

test('renders test results section', () => {
  render(<App />);
  const testResultsElement = screen.getByRole('heading', { name: /Test Results/i, level: 2 });
  expect(testResultsElement).toBeInTheDocument();
});
