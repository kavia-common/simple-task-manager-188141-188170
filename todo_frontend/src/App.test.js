import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title and input', () => {
  render(<App />);
  expect(screen.getByText(/Simple Todo/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Add new task form/i)).toBeInTheDocument();
});
