import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { skillSamples } from '@/content/skills4u.samples';
import { ButtonBuilder } from './ButtonBuilder';
import { SkillFileViewer } from './SkillFileViewer';

function codeText() {
  return screen.getByLabelText('Generated code').textContent ?? '';
}

describe('ButtonBuilder', () => {
  it('updates the preview and the code as you type', async () => {
    const user = userEvent.setup();
    render(<ButtonBuilder />);
    const input = screen.getByLabelText('Label');
    await user.clear(input);
    await user.type(input, 'Hire me');
    expect(screen.getByRole('button', { name: 'Hire me' })).toBeInTheDocument();
    expect(codeText()).toContain('Hire me');
  });

  it('shows a fallback label when empty', async () => {
    const user = userEvent.setup();
    render(<ButtonBuilder />);
    await user.clear(screen.getByLabelText('Label'));
    expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument();
  });

  it('picks a fill with pressed state and keyboard', async () => {
    const user = userEvent.setup();
    render(<ButtonBuilder />);
    const lime = screen.getByRole('button', { name: 'Lime fill' });
    lime.focus();
    await user.keyboard('{Enter}');
    expect(lime).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Primary fill' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(codeText()).toContain('#D4F26A');
  });

  it('copies the code and resets', async () => {
    const user = userEvent.setup();
    render(<ButtonBuilder />);
    await user.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(await navigator.clipboard.readText()).toContain('.ping-btn {');
    expect(screen.getByText('Copied')).toHaveAttribute('aria-live', 'polite');

    await user.clear(screen.getByLabelText('Label'));
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByLabelText('Label')).toHaveValue('Ping me');
  });
});

describe('SkillFileViewer', () => {
  it('switches files from the plugin buttons', async () => {
    const user = userEvent.setup();
    render(<SkillFileViewer />);
    const group = screen.getByRole('group', { name: 'Pick a plugin' });
    const wiki = within(group).getByRole('button', { name: 'wiki-health' });
    await user.click(wiki);
    expect(wiki).toHaveAttribute('aria-pressed', 'true');
    const sample = skillSamples.find((s) => s.plugin === 'wiki-health')!;
    expect(screen.getByText(sample.path)).toBeInTheDocument();
    expect(screen.getByLabelText('wiki-health SKILL.md contents').textContent).toContain(
      'name: wiki-health',
    );
  });
});
