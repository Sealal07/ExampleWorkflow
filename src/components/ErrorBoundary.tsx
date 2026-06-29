import type { ErrorInfo, ReactNode } from 'react'; 
// Импортируем необходимые типы из React: Component - базовый класс для создания компонентов,
// ErrorInfo - интерфейс для информации об ошибке, ReactNode - тип для дочерних элементов
import { Component } from 'react';
interface Props {
  children: ReactNode;
}
// Определяем интерфейс пропсов компонента. Принимает только дочерние элементы (children)

interface State {
  hasError: boolean;
  error: Error | null;
}
// Определяем интерфейс состояния компонента: флаг наличия ошибки и объект ошибки

export class ErrorBoundary extends Component<Props, State> {
  // Объявляем и экспортируем класс ErrorBoundary, расширяющий Component с типами Props и State

  public state: State = {
    hasError: false,
    error: null,
  };
  // Инициализируем начальное состояние: ошибки нет, ошибка равна null

  public static getDerivedStateFromError(error: Error): State {
    // Статический метод, вызываемый React при возникновении ошибки в дочерних компонентах
    return { hasError: true, error };
    // Возвращаем новое состояние: устанавливаем флаг ошибки в true и сохраняем объект ошибки
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Метод жизненного цикла, вызываемый после того, как ошибка была перехвачена
    console.error("Uncaught error:", error, errorInfo);
    // Выводим ошибку и информацию о ней в консоль для отладки
  }

  public handleReset = () => {
    // Обработчик кнопки сброса. Используем стрелочную функцию для правильной привязки this
    localStorage.clear(); // Сброс к дефолтным настройкам в случае критического краша
    // Очищаем всё локальное хранилище браузера, чтобы удалить потенциально поврежденные данные
    this.setState({ hasError: false, error: null });
    // Сбрасываем состояние компонента: убираем флаг ошибки и очищаем объект ошибки
    window.location.href = '/';
    // Перенаправляем пользователя на главную страницу приложения
  };

  public render() {
    // Метод рендеринга компонента
    if (this.state.hasError) {
      // Если произошла ошибка (флаг hasError равен true)
      return (
        // Возвращаем UI с сообщением об ошибке
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
          {/* Контейнер на всю высоту экрана с flex-центрированием */}
          <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border border-red-100">
            {/* Карточка ошибки с белым фоном, тенями и красной обводкой */}
            <h2 className="text-2xl font-bold text-red-600 mb-4">Что-то пошло не так 😢</h2>
            {/* Заголовок ошибки красного цвета с эмодзи */}
            <p className="text-gray-600 mb-6 text-sm">
              Произошла непредвиденная ошибка в приложении. Возможно, были переданы некорректные данные.
            </p>
            {/* Текст-пояснение для пользователя */}
            <button
              onClick={this.handleReset}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {/* Кнопка сброса с индиговым фоном, при наведении меняющим цвет */}
              Сбросить кэш и вернуться на Главную
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
    // Если ошибки нет, рендерим дочерние компоненты, переданные в ErrorBoundary
  }
}