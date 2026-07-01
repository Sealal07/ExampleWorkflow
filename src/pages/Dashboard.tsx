import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

interface BookingRecord {
  id: string;
  resourceName: string;
  time: string;
  date: string;
  status: 'Confirmed' | 'Cancelled';
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);
  if (!userCtx) throw new Error("UserContext не найден");
  const { user } = userCtx;

  const [upcoming, setUpcoming] = useState<BookingRecord[]>([]);
  
  // Симуляция данных заполненности офиса на сегодня по ТЗ (например, 68% мест забронировано)
  const officeOccupancyPercent = 68;

  useEffect(() => {
    const saved: BookingRecord[] = JSON.parse(localStorage.getItem('user_bookings') || '[]');
    // Фильтруем только активные (подтвержденные) записи для виджета ближайших бронирований
    setUpcoming(saved.filter(b => b.status === 'Confirmed'));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Приветствие */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Привет, {user.name.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Добро пожаловать в рабочее пространство Workspace Flow.</p>
      </div>

      {/* Блок аналитики / Баланса и прогресс-бара */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Баланс часов */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ваш баланс</span>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">Доступные часы</h3>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-indigo-600">{user.monthlyHoursLimit - user.usedHours}</span>
            <span className="text-sm text-gray-400 font-medium ml-1">/ {user.monthlyHoursLimit} ч</span>
          </div>
        </div>

        {/* Динамический Прогресс-бар заполненности офиса */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2 space-y-4">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Статистика хаба</span>
            <h3 className="text-lg font-bold text-gray-900">Загруженность офиса сегодня</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-600">
              <span>Занято рабочих зон</span>
              <span>{officeOccupancyPercent}%</span>
            </div>
            {/* Реализация индикатора (Progress Bar) с помощью Inline Styles по ТЗ */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                style={{ width: `${officeOccupancyPercent}%` }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-500 rounded-full"
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-400">Пик загрузки ожидается к 14:00. Рекомендуем бронировать переговорные заранее.</p>
        </div>
      </div>

      {/* Ближайшие бронирования и Быстрый экшен */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Список бронирований */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Ближайшие бронирования</h3>
          
          {upcoming.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400 border border-dashed border-gray-100 rounded-xl">
              У вас нет активных бронирований на ближайшее время.
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(-3).reverse().map((b) => (
                <div key={b.id} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900">{b.resourceName}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{b.date} • {b.time}</p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    Активно
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Быстрые кнопки действия */}
        <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-md flex flex-col justify-between h-full min-h-[180px]">
          <div>
            <h3 className="font-bold text-lg mb-1">Нужно рабочее место?</h3>
            <p className="text-indigo-100 text-xs font-light">Найдите свободный hot-desk или уединенную комнату на любом этаже в пару кликов.</p>
          </div>
          <button
            onClick={() => navigate('/booking')}
            className="w-full bg-white hover:bg-indigo-50 text-indigo-600 font-bold py-2.5 px-4 rounded-xl text-center text-sm transition-colors mt-4"
          >
            Забронировать ресурс
          </button>
        </div>

      </div>

    </div>
  );
};