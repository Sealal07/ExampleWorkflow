// Импортируем React и хуки для работы с состоянием и мемоизацией
import React, { useState, useMemo } from 'react';
// Импортируем хук useNavigate для программной навигации
import { useNavigate } from 'react-router-dom';
// Импортируем кастомный хук для загрузки данных
import { useFetch } from '../hooks/useFetch';
// Импортируем тестовые данные и тип Resource
import { mockResources, Resource } from '../mockData/mockData';
// Импортируем компонент панели фильтров
import { BookingFilters } from '../components/BookingFilters';
// Импортируем компонент карточки ресурса
import { ResourceCard } from '../components/ResourceCard';
// Импортируем компонент скелетона для отображения загрузки
import { SkeletonCard } from '../components/SkeletonCard';

// Экспортируем функциональный компонент страницы бронирования
export const Booking: React.FC = () => {
  // Получаем функцию для навигации между страницами
  const navigate = useNavigate();
  
  // Состояние фильтров (инициализируем сегодняшней датой в формате ГГГГ-ММ-ДД)
  const [filters, setFilters] = useState({
    search: '', // Поисковый запрос
    date: new Date().toISOString().split('T')[0], // Текущая дата
    type: 'all' as 'all' | 'desk' | 'room', // Тип ресурса (все/место/комната)
    floor: 'all' as number | 'all', // Этаж или все этажи
    hasFlipchart: false, // Флаг наличия флипчарта
    hasTypeC: false, // Флаг наличия Type-C монитора
  });

  // Запрашиваем данные через кастомный хук useFetch при изменении даты или типа
  const { data: resources, loading, error } = useFetch<Resource>(
    () => mockResources, // Функция получения данных (возвращает тестовый массив)
    [filters.date, filters.type] // Зависимости: перезапрос при изменении даты или типа
  );

  // Оптимизация тяжелой фильтрации массива (50+ элементов) с помощью useMemo
  const filteredResources = useMemo(() => {
    // Если данные еще не загружены, возвращаем пустой массив
    if (!resources) return [];

    // Фильтруем массив ресурсов по всем критериям
    return resources.filter(res => {
      // Проверка соответствия поисковому запросу (по названию)
      const matchesSearch = res.name.toLowerCase().includes(filters.search.toLowerCase());
      // Проверка соответствия типу ресурса
      const matchesType = filters.type === 'all' || res.type === filters.type;
      // Проверка соответствия этажу
      const matchesFloor = filters.floor === 'all' || res.floor === filters.floor;
      // Проверка наличия флипчарта (если фильтр активен)
      const matchesFlipchart = !filters.hasFlipchart || res.features.includes('Есть флипчарт');
      // Проверка наличия Type-C монитора (если фильтр активен)
      const matchesTypeC = !filters.hasTypeC || res.features.includes('Type-C монитор');

      // Возвращаем true только если ресурс проходит все проверки
      return matchesSearch && matchesType && matchesFloor && matchesFlipchart && matchesTypeC;
    });
  }, [resources, filters]); // Пересчет при изменении данных или фильтров

  // Колбэк-экшен верхнего уровня, уходящий вниз через пропсы (проп-дриллинг)
  const handleSelectResource = (id: string) => {
    // Переходим на страницу ресурса по его id
    navigate(`/resource/${id}`);
  };

  // Возвращаем JSX-разметку страницы
  return (
    // Основной контейнер с отступами и максимальной шириной
    <div className="p-8 max-w-7xl mx-auto">
      {/* Заголовок страницы */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Рабочее пространство</h1>
        <p className="text-gray-500 mt-1">Используйте фильтры для быстрого поиска и бронирования шеринг-зон офиса.</p>
      </div>

      {/* Панель управления фильтрами (передаем состояние и функцию обновления) */}
      <BookingFilters filters={filters} setFilters={setFilters} />

      {/* Вывод контента с условным рендерингом в зависимости от состояния */}
      
      {/* Если произошла ошибка - отображаем сообщение об ошибке */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      {/* Если идет загрузка - отображаем скелетоны */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Создаем 8 скелетонов для имитации загрузки карточек */}
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        // Если загрузка завершена, отображаем отфильтрованные данные
        <>
          {/* Счетчик найденных ресурсов */}
          <div className="mb-4 text-sm text-gray-500 font-medium">
            Найдено доступных ресурсов: {filteredResources.length}
          </div>
          
          {/* Если ресурсов нет - отображаем сообщение о пустом результате */}
          {filteredResources.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400">
              По вашему запросу ничего не найдено. Попробуйте изменить фильтры.
            </div>
          ) : (
            // Если ресурсы есть - отображаем сетку карточек
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Маппинг отфильтрованных ресурсов в карточки */}
              {filteredResources.map(resource => (
                <ResourceCard 
                  key={resource.id} // Уникальный ключ для React
                  resource={resource} // Передаем объект ресурса
                  onSelectResource={handleSelectResource} // Передаем callback для выбора
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};