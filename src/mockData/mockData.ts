 
// Добавляем поле floor к типу Resource для указания этажа
export interface Resource {
  id: string; // Уникальный идентификатор ресурса
  name: string; // Название ресурса
  type: 'desk' | 'room'; // Тип ресурса: рабочее место или переговорная
  floor: number; // Номер этажа, на котором находится ресурс
  features: string[]; // Массив особенностей/характеристик ресурса
  image: string; // URL изображения ресурса
}

// Объявляем и экспортируем массив тестовых данных ресурсов
export const mockResources: Resource[] = [
  // Первый ресурс: рабочее место Hot Desk A-1 на 2 этаже
  { id: '1', name: 'Hot Desk A-1', type: 'desk', floor: 2, features: ['Type-C монитор'], image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=300&q=80' },
  
  // Второй ресурс: рабочее место Hot Desk A-2 на 2 этаже с двумя особенностями
  { id: '2', name: 'Hot Desk A-2', type: 'desk', floor: 2, features: ['Type-C монитор', 'Беспроводная зарядка'], image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=300&q=80' },
  
  // Третий ресурс: переговорная "Альфа" на 3 этаже
  { id: '3', name: 'Переговорная "Альфа"', type: 'room', floor: 3, features: ['Есть флипчарт', 'Проектор'], image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80' },
  
  // Четвертый ресурс: переговорная "Бета" на 3 этаже
  { id: '4', name: 'Переговорная "Бета"', type: 'room', floor: 3, features: ['Есть флипчарт', 'ТВ-панель'], image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80' },
  
  // Генерируем 45 дополнительных ресурсов для симуляции большого объема данных
  ...Array.from({ length: 45 }).map((_, index) => ({
    id: `generated-${index}`, // Генерируем уникальный ID
    name: index % 2 === 0 ? `Hot Desk B-${index}` : `Переговорная "Гамма-${index}"`, // Чередуем названия
    type: index % 2 === 0 ? ('desk' as const) : ('room' as const), // Чередуем типы ресурсов
    floor: (index % 3) + 1, // Распределяем по этажам: 1, 2 или 3
    features: index % 3 === 0 ? ['Type-C монитор', 'Есть флипчарт'] : ['Есть флипчарт'], // Разные наборы особенностей
    image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=300&q=80' // Стандартное изображение
  }))
];