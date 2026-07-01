import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

interface BookingRecord {
  id: string;
  resourceName: string;
  resourceType: 'desk' | 'room';
  floor: number;
  time: string;
  date: string;
  hours: number;
  status: 'Confirmed' | 'Cancelled';
}

export const Profile: React.FC = () => {
  const userCtx = useContext(UserContext);
  if (!userCtx) throw new Error("UserContext не найден");
  const { user, refundHours } = userCtx;

  // Инициализируем состояние напрямую из localStorage, избегая вызова в useEffect
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    return JSON.parse(localStorage.getItem('user_bookings') || '[]');
  });

  // Экшен отмены бронирования
  const handleCancelBooking = (bookingId: string, hoursToRefund: number) => {
    refundHours(hoursToRefund);

    const updatedBookings = bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('user_bookings', JSON.stringify(updatedBookings));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Карточка пользователя */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-sm text-gray-500 font-medium">{user.department} • {user.role}</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-lg text-indigo-700 font-semibold text-sm">
          Использовано лимита: {user.usedHours} из {user.monthlyHoursLimit} ч.
        </div>
      </div>

      {/* Таблица/список истории операций */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">История ваших бронирований</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            История операций пуста. Вы еще ничего не бронировали.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4">Ресурс</th>
                  <th className="p-4">Дата / Время</th>
                  <th className="p-4">Списание</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">{booking.resourceName}</p>
                      <p className="text-xs text-gray-400">{booking.floor} этаж • {booking.resourceType === 'room' ? 'Переговорная' : 'Место'}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-700">{booking.date}</p>
                      <p className="text-xs text-gray-500">{booking.time}</p>
                    </td>
                    <td className="p-4 font-medium text-gray-900">{booking.hours} ч.</td>
                    <td className="p-4">
                      {/* Условный рендеринг статусных тегов */}
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'Confirmed' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-gray-100 text-gray-500 line-through'
                      }`}>
                        {booking.status === 'Confirmed' ? 'Подтверждено' : 'Отменено'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {booking.status === 'Confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id, booking.hours)}
                          className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                        >
                          Отменить
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};