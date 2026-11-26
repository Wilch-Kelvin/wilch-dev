import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectVideos } from '@/content/project-videos';
import { projects } from '@/content/projects';
import { ProjectCard } from './ProjectCard';

const nativex = projects.find((p) => p.id === 'nativex')!;

describe('ProjectCard', () => {
  it('shows the name and eyebrow while collapsed, details stay inert', () => {
    render(<ProjectCard project={nativex} />);
    expect(screen.getByRole('heading', { name: nativex.name })).toBeVisible();
    expect(screen.getByText(nativex.meta)).toBeVisible();
    const button = screen.getByRole('button', { name: 'More about NativeX' });
    const region = document.getElementById(button.getAttribute('aria-controls')!)!;
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(region).toHaveAttribute('inert');
  });

  it('opens with a real disclosure button and reveals text, chips and link', async () => {
    render(<ProjectCard project={nativex} />);
    const button = screen.getByRole('button', { name: 'More about NativeX' });
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const region = document.getElementById(button.getAttribute('aria-controls')!)!;
    expect(region).not.toHaveAttribute('inert');
    expect(screen.getByText(new RegExp(nativex.summary))).toBeInTheDocument();
    expect(screen.getByRole('list', { name: nativex.chipsLabel })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View NativeX on GitHub/ })).toHaveAttribute(
      'href',
      nativex.link.href,
    );
  });

  it('shows the demo video (with its poster) when one is uploaded, else the art', () => {
    const classping = projects.find((p) => p.id === 'classping')!;
    const video = projectVideos.classping!;
    const { container, unmount } = render(<ProjectCard project={classping} />);
    const el = container.querySelector('video')!;
    expect(el).toHaveAttribute('src', video.src);
    expect(el).toHaveAttribute('preload', 'none');
    expect(el.muted).toBe(true);
    expect(container.querySelector('img')).toHaveAttribute('src', video.poster);
    unmount();

    expect(projectVideos.nativex).toBeUndefined();
    const art = render(<ProjectCard project={nativex} />);
    expect(art.container.querySelector('video')).toBeNull();
  });

  it('honours openByDefault', () => {
    render(<ProjectCard project={{ ...nativex, openByDefault: true }} />);
    expect(screen.getByRole('button', { name: 'More about NativeX' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
});
