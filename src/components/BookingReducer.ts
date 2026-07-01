export interface TimeSlot {
  id: string;
  time: string; // Например, "09:00 - 10:00"
  priceHours: number; // По ТЗ каждый слот обычно равен 1 часу
}

export interface BookingState {
  selectedSlots: TimeSlot[];
}

export type BookingAction =
  | { type: 'TOGGLE_SLOT'; payload: TimeSlot }
  | { type: 'CLEAR_CART' };

export const initialState: BookingState = {
  selectedSlots: [],
};

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'TOGGLE_SLOT': {
      const exists = state.selectedSlots.some(slot => slot.id === action.payload.id);
      if (exists) {
        // Если уже выбран — удаляем из черновика
        return {
          ...state,
          selectedSlots: state.selectedSlots.filter(slot => slot.id !== action.payload.id),
        };
      } else {
        // Если нет — добавляем
        return {
          ...state,
          selectedSlots: [...state.selectedSlots, action.payload],
        };
      }
    }
    case 'CLEAR_CART':
      return { ...state, selectedSlots: [] };
    default:
      return state;
  }
}