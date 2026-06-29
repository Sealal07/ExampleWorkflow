import { useState } from 'react';
import type { ReactNode } from 'react'; // type-only импорт
import { UserContext } from './UserContext';
import type { User } from './UserContext'; // type-only импорт

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    name: 'Алексей Иванов',
    role: 'Employee',
    department: 'Software Engineering (RPO)',
    monthlyHoursLimit: 20,
    usedHours: 0,
  });

  const deductHours = (hours: number): boolean => {
    if (user.usedHours + hours > user.monthlyHoursLimit) {
      return false; // Превышен лимит
    }
    setUser(prev => ({ ...prev, usedHours: prev.usedHours + hours }));
    return true;
  };

  const refundHours = (hours: number) => {
    setUser(prev => ({ ...prev, usedHours: Math.max(0, prev.usedHours - hours) }));
  };

  return (
    <UserContext.Provider value={{ user, deductHours, refundHours }}>
      {children}
    </UserContext.Provider>
  );
};