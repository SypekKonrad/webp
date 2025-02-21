import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import {MemoryRouter} from "react-router-dom";

test('renders app', () => {
  render(
      <MemoryRouter>
          <App />
      </MemoryRouter>

  );
  const navbar = screen.getByText(/Home/i);
  const div = screen.getByText(/Konrad Sypek/i);
  expect(navbar).toBeInTheDocument();
  expect(div).toBeInTheDocument();
});
