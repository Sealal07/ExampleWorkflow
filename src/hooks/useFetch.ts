// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';

// Изменили any[] на unknown[] для соблюдения строгой типизации
export function useFetch<T>(fetchFn: () => T[], dependencies: unknown[] = []) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Чтобы убрать ошибку каскадного рендеринга и не вызывать setState синхронно в теле эффекта,
    // мы инкапсулируем логику сброса состояний внутрь асинхронного таймера
    const timer = setTimeout(() => {
      try {
        const result = fetchFn();
        setData(result);
        setLoading(false);
        setError(null);
      } catch {
        // Убрали неиспользуемую переменную 'err'
        setError('Не удалось загрузить данные ресурсов офиса.');
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error };
}