// Импортируем React для создания компонента
import React from 'react';
// Импортируем тип Resource из файла с тестовыми данными
import { Resource } from '../mockData/mockData';
// Импортируем компонент ActionButton (глубокого уровня)
import { ActionButton } from './ActionButton';

// Интерфейс пропсов для карточки ресурса
interface ResourceCardProps {
  resource: Resource; // Объект ресурса для отображения
  onSelectResource: (id: string) => void; // Проп-дриллинг коллбэка - передача функции через компоненты
}

// Экспортируем функциональный компонент ResourceCard
export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onSelectResource }) => {
  // Возвращаем JSX-разметку карточки ресурса
  return (
    // Основной контейнер карточки с обработчиком клика
    <div 
      // При клике на карточку вызываем функцию onSelectResource с id ресурса
      onClick={() => onSelectResource(resource.id)}
      // CSS-стили карточки: белый фон, тень, скругление, курсор-указатель
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
    >
      {/* Блок с изображением ресурса */}
      <div className="h-40 overflow-hidden relative bg-gray-200">
        {/* Изображение ресурса с адаптивным заполнением */}
        <img src={resource.image} alt={resource.name} className="w-full h-full object-cover" />
        {/* Тег-бейдж с типом ресурса (абсолютное позиционирование в правом верхнем углу) */}
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full text-white ${
          // Условное стилирование: разный цвет для переговорной и рабочего места
          resource.type === 'room' ? 'bg-purple-600' : 'bg-emerald-600'
        }`}>
          {/* Отображаем название типа ресурса на русском языке */}
          {resource.type === 'room' ? 'Переговорная' : 'Рабочее место'}
        </span>
      </div>

      {/* Блок с текстовой информацией о ресурсе */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* Верхняя часть блока с названием и характеристиками */}
        <div>
          {/* Название ресурса */}
          <h3 className="font-bold text-gray-900 text-lg mb-1">{resource.name}</h3>
          {/* Номер этажа */}
          <p className="text-gray-500 text-xs font-medium mb-3">{resource.floor} этаж</p>
          
          {/* Контейнер для тегов особенностей ресурса */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {/* Маппинг массива особенностей в теги-спаны */}
            {resource.features.map((feat, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Передаем коллбэк дальше вниз (Props-drilling) в компонент ActionButton */}
        <ActionButton 
          // При клике на кнопку вызываем onSelectResource с id ресурса
          onAction={() => onSelectResource(resource.id)} 
          label="Посмотреть расписание" // Текст кнопки
        />
      </div>
    </div>
  );
};