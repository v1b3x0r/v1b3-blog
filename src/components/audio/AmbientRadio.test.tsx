import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AmbientRadio } from './AmbientRadio';

describe('AmbientRadio', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  });

  it('requires explicit consent on a first visit', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);

    render(<AmbientRadio />);

    expect(play).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /enter with sound/i }));

    await waitFor(() => expect(play).toHaveBeenCalledOnce());
    expect(window.localStorage.getItem('v1b3topia:ambient-radio')).toBe('enabled');
  });

  it('retries blocked returning autoplay on the first interaction', async () => {
    window.localStorage.setItem('v1b3topia:ambient-radio', 'enabled');
    const blocked = new DOMException('blocked', 'NotAllowedError');
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValueOnce(blocked)
      .mockResolvedValue(undefined);

    render(<AmbientRadio />);
    await waitFor(() => expect(play).toHaveBeenCalledOnce());

    fireEvent.pointerDown(document);

    await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  });

  it('stops after every track fails once', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);
    const { container } = render(<AmbientRadio />);
    const audio = container.querySelector('audio');
    if (!audio) throw new Error('audio element missing');

    fireEvent.click(screen.getByRole('button', { name: /enter with sound/i }));
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));

    fireEvent.error(audio);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
    fireEvent.error(audio);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(3));
    fireEvent.error(audio);

    await screen.findByText(/radio · unavailable/i);
  });
});
