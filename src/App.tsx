import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UserProvider } from './context/UserProvider';
import { Sidebar } from './components/Layout/Sidebar';

// Страницы
import { Dashboard } from './pages/Dashboard';
import { Booking } from './pages/Booking';
import { ResourceDetail } from './pages/ResourceDetail';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <div className="flex min-h-screen pl-[260px]"> {/* Отступ под фиксированный Sidebar */}
            <Sidebar />
            <main className="flex-1 bg-gray-50 min-h-screen">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/resource/:id" element={<ResourceDetail />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </Router>
      </UserProvider>
    </ErrorBoundary>
  );
}
