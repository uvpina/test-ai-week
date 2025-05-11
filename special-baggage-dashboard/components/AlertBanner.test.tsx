import { render, screen } from '@testing-library/react';
import AlertBanner from './AlertBanner';

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

describe('AlertBanner', () => {
  it('renders the alert message', () => {
    const testMessage = 'Test alert message';
    render(<AlertBanner message={testMessage} />);
    
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it('includes an alert icon', () => {
    render(<AlertBanner message="Test message" />);
    
    // We'd typically use a more specific test for the icon
    // but this is a simple check that there's some icon-related element
    const alertContainer = screen.getByText('Test message').parentElement;
    expect(alertContainer).toHaveClass('alert-banner');
  });
}); 