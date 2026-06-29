// Компонент самого глубокого уровня, получающий callback клика
// Импортируем React для создания компонента
import React from 'react';

// Интерфейс пропсов для компонента ActionButton
interface ActionButtonProps {
  onAction: () => void; // Функция-обработчик действия, вызываемая при клике
  label: string; // Текст, отображаемый на кнопке
}

// Экспортируем функциональный компонент ActionButton с типизацией
export const ActionButton: React.FC<ActionButtonProps> = ({ onAction, label }) => {
  // Возвращаем JSX-разметку кнопки
  return (
    <button
      // Обработчик события клика с параметром event
      onClick={(e) => {
        // Останавливаем всплытие события, чтобы клик не сработал на родительских элементах (например, карточке)
        e.stopPropagation(); // Изолируем клик карточки
        // Вызываем переданную функцию-обработчик
        onAction();
      }}
      // CSS-классы для стилизации кнопки
      className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold py-2 px-4 rounded-lg transition-colors text-sm text-center"
    >
      {/* Отображаем переданную метку (текст кнопки) */}
      {label}
    </button>
  );
};