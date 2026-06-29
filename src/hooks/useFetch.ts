// Импортируем хуки useState и useEffect из библиотеки React
import { useState, useEffect } from 'react';

// Объявляем пользовательский хук useFetch с дженериком T для типизации данных
// Принимает функцию для получения данных и массив зависимостей (по умолчанию пустой)
export function useFetch<T>(fetchFn: () => T[], dependencies: React.DependencyList = []) {
  // Состояние для хранения полученных данных (изначально null)
  const [data, setData] = useState<T[] | null>(null);
  
  // Состояние для индикатора загрузки (изначально true)
  const [loading, setLoading] = useState<boolean>(true);
  
  // Состояние для хранения ошибки (изначально null)
  const [error, setError] = useState<string | null>(null);

  // Хук эффекта, который выполняется при изменении зависимостей
  useEffect(() => {
    // Устанавливаем флаг для отслеживания монтирования компонента
    let isMounted = true;

    // Объявляем асинхронную функцию для загрузки данных
    const loadData = async () => {
      try {
        // Вызываем переданную функцию и сохраняем результат
        const result = fetchFn();
        
        // Проверяем, смонтирован ли компонент, перед обновлением состояния
        if (isMounted) {
          // Сохраняем полученные данные в состояние
          setData(result);
          // Выключаем индикатор загрузки
          setLoading(false);
        }
      } catch {
        // В случае ошибки проверяем, смонтирован ли компонент
        if (isMounted) {
          // Сохраняем сообщение об ошибке в состояние
          setError('Не удалось загрузить данные ресурсов офиса.');
          // Выключаем индикатор загрузки даже при ошибке
          setLoading(false);
        }
      }
    };

    // Запускаем функцию загрузки данных
    loadData();

    // Функция очистки: устанавливаем флаг isMounted в false при размонтировании
    return () => {
      isMounted = false;
    };
    // Массив зависимостей: эффект перезапускается при изменении fetchFn или зависимостей
  }, [fetchFn, ...dependencies]);

  // Возвращаем объект с данными, состоянием загрузки и ошибкой
  return { data, loading, error };
}