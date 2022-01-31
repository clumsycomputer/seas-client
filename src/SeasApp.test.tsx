import React from 'react'
import { render, screen } from '@testing-library/react'
import { SeasApp } from './SeasApp'

test('renders learn react link', () => {
  render(<SeasApp />)
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
})
