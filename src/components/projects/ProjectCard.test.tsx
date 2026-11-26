import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projects } from '@/content/projects';
import { ProjectCard } from './ProjectCard';

const classping = projects.find((p) => p.id === 'classping')!;
const nativex = projects.find((p) => p.id === 'nativex')!;

describe('ProjectCard', () => {
  it('always shows the summary, chips and link (review M1)', () => {
    render(<ProjectCard project={nativex} />);
    expect(screen.getByText(nativex.summary)).toBeVisible();
    expect(screen.getByRole('list', { name: nativex.chipsLabel })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View NativeX on GitHub/ })).toHaveAttribute(
      'href',
      nativex.link.href,
    );
  });

  it('toggles details with a real disclosure button', async () => {
    render(<ProjectCard project={nativex} />);
    const button = screen.getByRole('button', { name: 'More about NativeX' });
    const region = document.getElementById(button.getAttribute('aria-controls')!)!;
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(region).toHaveAttribute('inert');

    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(region).not.toHaveAttribute('inert');
  });

  it('starts open for ClassPing', () => {
    render(<ProjectCard project={classping} />);
    expect(screen.getByRole('button', { name: 'More about ClassPing' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
});
