import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PostList from './PostList';

global.fetch = vi.fn();

describe('PostList Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('1. Відображає лоадер під час завантаження', () => {
    fetch.mockImplementation(() => new Promise(() => {}));
    render(<PostList />);
    expect(screen.getByLabelText(/Loading posts.../i)).toBeInTheDocument();
  });

  it('2. Рендерить список постів після успішного запиту', async () => {
    const mockPosts = [
      { id: 1, title: 'First Post', body: 'This is the first post' },
      { id: 2, title: 'Second Post', body: 'This is the second post' },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts,
    });

    render(<PostList />);

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });

    expect(screen.getByText('Second Post')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Loading posts.../i)).not.toBeInTheDocument();
  });

  it('3. Відображає помилку при невдалому запиті', async () => {
    fetch.mockRejectedValueOnce(new Error('Network disconnected'));

    render(<PostList />);

    await waitFor(() => {
      expect(screen.getByText(/Posts Error: Network disconnected/i)).toBeInTheDocument();
    });
  });
});
