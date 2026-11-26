import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailActions } from './EmailActions';

describe('EmailActions', () => {
  it('shows the assembled address with a mailto link in the browser', () => {
    render(<EmailActions />);
    const link = screen.getByRole('link', { name: /@gmail\.com/ });
    expect(link.getAttribute('href')).toMatch(/^mailto:[^@]+@gmail\.com$/);
  });

  it('copies the address and announces it politely', async () => {
    const user = userEvent.setup();
    render(<EmailActions />);
    await user.click(screen.getByRole('button', { name: 'Copy email address' }));
    expect(await navigator.clipboard.readText()).toMatch(/@gmail\.com$/);
    expect(screen.getByRole('status')).toHaveTextContent('Email copied');
  });
});
