import React, { useReducer, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockResources } from '../mockData/mockData';
import { UserContext } from '../context/UserContext';
import { bookingReducer, initialState, TimeSlot } from '../components/BookingReducer';

// Массив доступных слотов на день
const DAY_SLOTS: TimeSlot[] = [
  { id: 's8', time: '08:00 - 10:00', priceHours: 2 },
  { id: 's10', time: '10:00 - 12:00', priceHours: 2 },
  { id: 's12', time: '12:00 - 14:00', priceHours: 2 },
  { id: 's14', time: '14:00 - 16:00', priceHours: 2 },
  { id: 's16', time: '16:00 - 18:00', priceHours: 2 },
  { id: 's18', time: '18:00 - 20:00', priceHours: 2 },
];

// Симулируем занятые слоты для демонстрации (например, слот 12:00-14:00 занят кем-то другим)
const OCCUPIED_SLOTS = ['s12'];

export const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Достаем глобальный контекст пользователя
  const userCtx = useContext(UserContext);
  if (!userCtx) throw new Error("UserContext не найден");
  const { user, deductHours } = userCtx;

  // Локальный стейт-менеджмент корзины/черновика через useReducer
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const [bookingMessage, setBookingMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Находим текущий ресурс в мок-данных
  const resource = mockResources.find(r => r.id === id);

  if (!resource) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Ресурс не найден</h2>
        <button onClick={() => navigate('/booking')} className="mt-4 text-indigo-600 font-semibold">
          Вернуться к каталогу
        </button>
      </div>
    );
  }

  // Считаем сумму часов в черновике
  const totalHoursRequested = state.selectedSlots.reduce((sum, slot) => sum + slot.priceHours, 0);

  // Обработчик подтверждения пакета бронирования
  const handleConfirmBooking = () => {
    if (totalHoursRequested === 0) return;

    // Вызываем метод бизнес-логики из UserContext
    const success = deductHours(totalHoursRequested);

    if (success) {
      // Сохраняем бронирование в localStorage (для работы Dashboard и Profile в будущем Спринте 4)
      const currentBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
      const newBookings = state.selectedSlots.map(slot => ({
        id: `${resource.id}-${slot.id}-${Date.now()}`,
        resourceName: resource.name,
        resourceType: resource.type,
        floor: resource.floor,
        time: slot.time,
        date: new Date().toISOString().split('T')[0],
        hours: slot.priceHours,
        status: 'Confirmed'
      }));

      localStorage.setItem('user_bookings', JSON.stringify([...currentBookings, ...newBookings]));
      
      setBookingMessage({ text: 'Бронирование успешно подтверждено! Часы списаны.', isError: false });
      dispatch({ type: 'CLEAR_CART' });
    } else {
      setBookingMessage({ text: 'Ошибка: Превышен ваш ежемесячный лимит доступных часов!', isError: true });
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Левая колонка: Детали ресурса и таймлайн */}
      <div className="lg:col-span-2 space-y-6">
        <button 
          onClick={() => navigate('/booking')}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
        >
          ← Назад к каталогу
        </button>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="h-64 rounded-lg overflow-hidden bg-gray-100 mb-6">
            <img src={resource.image} alt={resource.name} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{resource.name}</h1>
          <p className="text-sm text-gray-500 mb-4">{resource.floor} этаж • {resource.type === 'room' ? 'Комната' : 'Рабочая зона'}</p>
          
          <h3 className="font-semibold text-gray-900 mb-2">Интерактивное расписание</h3>
          <p className="text-xs text-gray-400 mb-4">Наведите на слот, чтобы увидеть детали, и кликните для выбора.</p>

          {/* Интерактивный таймлайн */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DAY_SLOTS.map((slot) => {
              const isOccupied = OCCUPIED_SLOTS.includes(slot.id);
              const isSelected = state.selectedSlots.some(s => s.id === slot.id);

              return (
                <div 
                  key={slot.id}
                  // Реализация кастомного тултипа с помощью Tailwind классов (group и group-hover)
                  className="group relative"
                >
                  <button
                    disabled={isOccupied}
                    onClick={() => dispatch({ type: 'TOGGLE_SLOT', payload: slot })}
                    // Inline-style для динамического управления стилем (в рамках требований ТЗ)
                    style={{ minHeight: '52px' }}
                    className={`w-full p-3 rounded-xl font-medium text-sm transition-all border text-center flex flex-col justify-center items-center ${
                      isOccupied 
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-500 hover:bg-indigo-50/30'
                    }`}
                  >
                    <span>{slot.time.split(' - ')[0]}</span>
                    <span className="text-xs opacity-60">
                      {isOccupied ? 'Занят' : isSelected ? 'В черновике' : 'Свободен'}
                    </span>
                  </button>

                  {/* Всплывающая CSS-подсказка при наведении (Tooltip) */}
                  <div className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded-lg p-2.5 shadow-md pointer-events-none">
                    <p className="font-semibold mb-0.5">{slot.time}</p>
                    <p className="text-gray-400">Стоимость: {slot.priceHours} {slot.priceHours === 1 ? 'час' : 'часа'}</p>
                    {isOccupied && <p className="text-red-400 font-medium mt-1">Уже забронировано коллегой</p>}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Правая колонка: Черновик бронирования и баланс */}
      <div className="space-y-6">
        {/* Баланс часов */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1">Ваш лимит</h3>
          <p className="text-sm font-light text-indigo-100 mb-4">{user.department}</p>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-3xl font-bold">{user.monthlyHoursLimit - user.usedHours}</span>
              <span className="text-sm text-indigo-200 ml-1">/ {user.monthlyHoursLimit} ч. осталось</span>
            </div>
          </div>
        </div>

        {/* Боковая панель: Черновик */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[300px] justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
              <span>Черновик</span>
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {state.selectedSlots.length} слотов
              </span>
            </h2>

            {state.selectedSlots.length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-400">
                Выберите доступные слоты времени на таймлайне слева.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {state.selectedSlots.map(slot => (
                  <div key={slot.id} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-sm">
                    <div>
                      <p className="font-semibold text-gray-800">{slot.time}</p>
                      <p className="text-xs text-gray-500">Расход: {slot.priceHours} ч.</p>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'TOGGLE_SLOT', payload: slot })}
                      className="text-gray-400 hover:text-red-500 font-medium text-xs px-2 py-1"
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500 font-medium">Итого к списанию:</span>
              <span className="text-lg font-bold text-indigo-600">{totalHoursRequested} ч.</span>
            </div>

            <button
              disabled={state.selectedSlots.length === 0}
              onClick={handleConfirmBooking}
              className={`w-full font-semibold py-3 px-4 rounded-xl text-center transition-colors text-sm ${
                state.selectedSlots.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100'
              }`}
            >
              Подтвердить бронирование
            </button>

            {bookingMessage && (
              <div className={`mt-3 p-3 rounded-lg text-xs font-medium text-center ${
                bookingMessage.isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}>
                {bookingMessage.text}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};