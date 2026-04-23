import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TripContext = createContext();

const initialState = {
  trips: [],
  currentTrip: null,
};

function tripReducer(state, action) {
  switch (action.type) {
    case 'LOAD_TRIPS':
      return { ...state, trips: action.payload };

    case 'ADD_TRIP': {
      const newTrip = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'upcoming',
      };
      const updated = [...state.trips, newTrip];
      localStorage.setItem('tripplanner_trips', JSON.stringify(updated));
      return { ...state, trips: updated };
    }

    case 'UPDATE_TRIP': {
      const updated = state.trips.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
      localStorage.setItem('tripplanner_trips', JSON.stringify(updated));
      return { ...state, trips: updated };
    }

    case 'DELETE_TRIP': {
      const updated = state.trips.filter(t => t.id !== action.payload);
      localStorage.setItem('tripplanner_trips', JSON.stringify(updated));
      return { ...state, trips: updated };
    }

    case 'SET_CURRENT_TRIP':
      return { ...state, currentTrip: action.payload };

    case 'ADD_ACTIVITY': {
      const updated = state.trips.map(t => {
        if (t.id !== action.payload.tripId) return t;
        const days = [...(t.itinerary || [])];
        const dayIdx = days.findIndex(d => d.day === action.payload.day);
        if (dayIdx >= 0) {
          days[dayIdx] = {
            ...days[dayIdx],
            activities: [...days[dayIdx].activities, action.payload.activity],
          };
        } else {
          days.push({ day: action.payload.day, activities: [action.payload.activity] });
        }
        return { ...t, itinerary: days };
      });
      localStorage.setItem('tripplanner_trips', JSON.stringify(updated));
      return { ...state, trips: updated };
    }

    case 'REMOVE_ACTIVITY': {
      const updated = state.trips.map(t => {
        if (t.id !== action.payload.tripId) return t;
        const days = (t.itinerary || []).map(d => {
          if (d.day !== action.payload.day) return d;
          return {
            ...d,
            activities: d.activities.filter((_, i) => i !== action.payload.activityIndex),
          };
        });
        return { ...t, itinerary: days };
      });
      localStorage.setItem('tripplanner_trips', JSON.stringify(updated));
      return { ...state, trips: updated };
    }

    case 'UPDATE_CHECKLIST': {
      const updated = state.trips.map(t => {
        if (t.id !== action.payload.tripId) return t;
        return { ...t, checklist: action.payload.checklist };
      });
      localStorage.setItem('tripplanner_trips', JSON.stringify(updated));
      return { ...state, trips: updated };
    }

    default:
      return state;
  }
}

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('tripplanner_trips');
    if (saved) {
      try {
        dispatch({ type: 'LOAD_TRIPS', payload: JSON.parse(saved) });
      } catch {
        console.warn('Could not parse saved trips');
      }
    }
  }, []);

  const addTrip = (tripData) => dispatch({ type: 'ADD_TRIP', payload: tripData });
  const updateTrip = (tripData) => dispatch({ type: 'UPDATE_TRIP', payload: tripData });
  const deleteTrip = (id) => dispatch({ type: 'DELETE_TRIP', payload: id });
  const setCurrentTrip = (trip) => dispatch({ type: 'SET_CURRENT_TRIP', payload: trip });
  const addActivity = (tripId, day, activity) =>
    dispatch({ type: 'ADD_ACTIVITY', payload: { tripId, day, activity } });
  const removeActivity = (tripId, day, activityIndex) =>
    dispatch({ type: 'REMOVE_ACTIVITY', payload: { tripId, day, activityIndex } });
  const updateChecklist = (tripId, checklist) =>
    dispatch({ type: 'UPDATE_CHECKLIST', payload: { tripId, checklist } });

  return (
    <TripContext.Provider value={{
      trips: state.trips,
      currentTrip: state.currentTrip,
      addTrip,
      updateTrip,
      deleteTrip,
      setCurrentTrip,
      addActivity,
      removeActivity,
      updateChecklist,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrips must be used inside TripProvider');
  return ctx;
}
