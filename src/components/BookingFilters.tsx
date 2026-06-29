
 
// Импортируем React и необходимые хуки
import React, { useRef, useEffect, useState } from 'react';
// Импортируем кастомный хук для обработки кликов вне элемента
import { useClickOutside } from '../hooks/useClickOutside';

// Определяем интерфейс для состояния фильтров
interface FiltersState {
  search: string; // Поисковый запрос
  date: string; // Дата бронирования
  type: 'all' | 'desk' | 'room'; // Тип ресурса
  floor: number | 'all'; // Номер этажа или все
  hasFlipchart: boolean; // Флаг наличия флипчарта
  hasTypeC: boolean; // Флаг наличия Type-C монитора
}

// Интерфейс пропсов компонента фильтров
interface BookingFiltersProps {
  filters: FiltersState; // Текущее состояние фильтров
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>; // Функция обновления фильтров
}

// Экспортируем функциональный компонент фильтров бронирования
export const BookingFilters: React.FC<BookingFiltersProps> = ({ filters, setFilters }) => {
  // Ref для поля ввода поиска (для автофокуса)
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Ref для выпадающего списка выбора этажа (для клика вне)
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Состояние для управления открытием/закрытием выпадающего списка этажей
  const [isFloorDropdownOpen, setIsFloorDropdownOpen] = useState(false);

  // Хук эффекта для автофокуса на поле поиска при монтировании компонента
  useEffect(() => {
    // Проверяем, что ref существует
    if (searchInputRef.current) {
      // Устанавливаем фокус на поле ввода
      searchInputRef.current.focus();
    }
  }, []); // Пустой массив зависимостей - эффект выполняется один раз

  // Используем кастомный хук для закрытия выпадающего списка при клике вне него
  // Передаем ref на контейнер дропдауна и функцию закрытия
  useClickOutside(dropdownRef, () => setIsFloorDropdownOpen(false));

  // Обработчик изменения текста в поле поиска
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Обновляем состояние фильтров, сохраняя остальные поля
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  // Обработчик изменения чекбоксов удобств
  const handleCheckboxChange = (field: 'hasFlipchart' | 'hasTypeC') => {
    // Инвертируем значение выбранного поля
    setFilters(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Возвращаем JSX-разметку компонента
  return (
    // Основной контейнер с отступами и стилями
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Блок поиска ресурса */}
      <div className="flex flex-col gap-1">
        {/* Подпись поля */}
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Поиск ресурса</label>
        {/* Поле ввода поиска с ref для автофокуса */}
        <input
          ref={searchInputRef}
          type="text"
          value={filters.search}
          onChange={handleInputChange}
          placeholder="Например: Hot Desk или Альфа..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Блок выбора даты */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Дата бронирования</label>
        {/* Поле ввода даты */}
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Блок выбора типа ресурса */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Тип ресурса</label>
        {/* Контейнер для кнопок-переключателей */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {/* Маппинг вариантов типа ресурса */}
          {(['all', 'desk', 'room'] as const).map((t) => (
            <button
              key={t} // Уникальный ключ для React
              onClick={() => setFilters(prev => ({ ...prev, type: t }))} // Обновляем тип
              className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors ${
                // Условное стилирование: активная кнопка vs неактивная
                filters.type === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {/* Отображаемое название: русская локализация */}
              {t === 'all' ? 'Все' : t === 'desk' ? 'Места' : 'Комнаты'}
            </button>
          ))}
        </div>
      </div>

      {/* Блок выбора этажа с кастомным дропдауном */}
      <div className="relative flex flex-col gap-1" ref={dropdownRef}>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Этаж</label>
        {/* Кнопка-триггер для открытия/закрытия дропдауна */}
        <button
          onClick={() => setIsFloorDropdownOpen(!isFloorDropdownOpen)}
          className="w-full text-left px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 flex justify-between items-center"
        >
          {/* Отображение выбранного этажа */}
          <span>{filters.floor === 'all' ? 'Все этажи' : `${filters.floor} этаж`}</span>
          {/* Стрелка вниз */}
          <span className="text-gray-400 text-xs">▼</span>
        </button>

        {/* Условный рендеринг выпадающего списка */}
        {isFloorDropdownOpen && (
          <div className="absolute top-[100%] left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
            {/* Маппинг вариантов этажей */}
            {['all', 1, 2, 3].map((floor) => (
              <button
                key={floor} // Уникальный ключ
                onClick={() => {
                  // Обновляем выбранный этаж
                  setFilters(prev => ({ ...prev, floor: floor as any }));
                  // Закрываем дропдаун после выбора
                  setIsFloorDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
              >
                {/* Отображение этажа */}
                {floor === 'all' ? 'Все этажи' : `${floor} этаж`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Блок чекбоксов для фильтрации по удобствам */}
      <div className="md:col-span-2 flex items-center gap-6 mt-4">
        {/* Чекбокс "Есть флипчарт" */}
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium">
          <input
            type="checkbox"
            checked={filters.hasFlipchart} // Связан со состоянием
            onChange={() => handleCheckboxChange('hasFlipchart')} // Обработчик изменения
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          Есть флипчарт
        </label>
        
        {/* Чекбокс "Type-C монитор" */}
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium">
          <input
            type="checkbox"
            checked={filters.hasTypeC} // Связан со состоянием
            onChange={() => handleCheckboxChange('hasTypeC')} // Обработчик изменения
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          Type-C монитор
        </label>
      </div>
    </div>
  );
};