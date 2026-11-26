import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { resumeGate } from '@/content/resume';
import { ResumeRequest } from './ResumeRequest';

const respond = (status: number, body: unknown) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(body, { status }));

afterEach(() => {
  vi.restoreAllMocks();
  window.history.replaceState(null, '', '/');
});

async function openAndSubmit(email: string) {
  await userEvent.click(screen.getByRole('button', { name: resumeGate.label }));
  await userEvent.type(screen.getByLabelText(resumeGate.emailLabel), email);
  await userEvent.click(screen.getByRole('button', { name: resumeGate.submit }));
}

describe('ResumeRequest', () => {
  it('starts closed behind a disclosure button', () => {
    render(<ResumeRequest />);
    const button = screen.getByRole('button', { name: resumeGate.label });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText(resumeGate.emailLabel)).not.toBeVisible();
  });

  it('tells the visitor what happens with their address before they send it', async () => {
    render(<ResumeRequest />);
    await userEvent.click(screen.getByRole('button', { name: resumeGate.label }));
    expect(screen.getByLabelText(resumeGate.emailLabel)).toHaveAccessibleDescription(
      resumeGate.note,
    );
  });

  it('sends the email and shows "check your inbox"', async () => {
    const fetchSpy = respond(202, { data: { sent: true } });
    render(<ResumeRequest />);
    await openAndSubmit('ada@example.com');
    expect(await screen.findByText(resumeGate.sentTitle)).toBeVisible();
    expect(screen.getByText(resumeGate.sent('ada@example.com'))).toBeVisible();
    expect(fetchSpy).toHaveBeenCalledWith('/api/resume/request/', expect.anything());
  });

  it('shows the server error as an alert', async () => {
    respond(429, { error: { code: 'slow_down', message: 'x' } });
    render(<ResumeRequest />);
    await openAndSubmit('ada@example.com');
    expect(await screen.findByRole('alert')).toHaveTextContent(resumeGate.errors.slow_down);
  });

  it('opens with the reason when someone returns from an expired link', () => {
    window.history.replaceState(null, '', '/?resume=expired#resume');
    render(<ResumeRequest />);
    expect(screen.getByText(resumeGate.returned.expired)).toBeVisible();
    expect(window.location.search).toBe('');
    expect(window.location.hash).toBe('#resume');
  });
});
