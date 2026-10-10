import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserProfile from './UserProfile';

// Мокаємо глобальний fetch
global.fetch = vi.fn();

describe('UserProfile Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('1. Відображає індикатор завантаження під час очікування відповіді', () => {
    // Повертаємо Promise, який ніколи не завершується (зависає), щоб перевірити стан завантаження
    fetch.mockImplementation(() => new Promise(() => {}));
    
    render(<UserProfile />);
    expect(screen.getByLabelText(/loading.../i)).toBeInTheDocument();
  });

  it('2. Викликає fetch з правильним URL', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });
    
    render(<UserProfile />);
    
    // Перевіряємо, чи fetch був викликаний рівно 1 раз і з потрібною адресою
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1');

    // Чекаємо завершення асинхронного оновлення стану, щоб уникнути попередження act(...)
    await waitFor(() => {
      expect(screen.queryByLabelText(/loading.../i)).not.toBeInTheDocument();
    });
  });

  it('3. Успішно завантажує дані, відображає їх та прибирає лоадер', async () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      phone: '123-456-7890'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    render(<UserProfile />);

    // На початку лоадер має бути присутнім
    expect(screen.getByLabelText(/loading.../i)).toBeInTheDocument();

    // Чекаємо поки з'явиться ім'я користувача
    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    });

    // Лоадер має зникнути
    expect(screen.queryByLabelText(/loading.../i)).not.toBeInTheDocument();
    
    // Всі інші дані також мають відобразитись
    expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/johndoe/)).toBeInTheDocument();
    expect(screen.getByText(/123-456-7890/)).toBeInTheDocument();
  });

  it('4. Обробляє мережеву помилку (наприклад, немає інтернету)', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error: You are offline'));

    render(<UserProfile />);

    // Чекаємо поки з'явиться повідомлення про помилку
    await waitFor(() => {
      expect(screen.getByText(/Error: Network error: You are offline/)).toBeInTheDocument();
    });
    
    // Лоадер має зникнути навіть при помилці
    expect(screen.queryByLabelText(/loading.../i)).not.toBeInTheDocument();
  });
  
  it('5. Обробляє помилку сервера (наприклад, 404 Not Found)', async () => {
    // Імітуємо відповідь сервера з помилкою 404 (ok: false)
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch user data/)).toBeInTheDocument();
    });
  });

  it('6. Обробляє випадок, коли сервер повертає некоректний JSON', async () => {
    // Імітуємо збій при парсингу JSON
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => { throw new SyntaxError('Unexpected token < in JSON'); },
    });

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Unexpected token < in JSON/)).toBeInTheDocument();
    });
  });
});
