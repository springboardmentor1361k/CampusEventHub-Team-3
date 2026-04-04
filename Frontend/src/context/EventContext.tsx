import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CollegeEvent } from '@/types';
import { eventsApi, BackendEvent, EventFilters, CreateEventPayload } from '@/lib/api';

// Map backend shape → frontend CollegeEvent
const mapEvent = (e: BackendEvent): CollegeEvent => ({
  id: e._id,
  collegeId: e.organizer?._id ?? '',
  collegeName: e.college,
  title: e.title,
  description: e.description,
  category: e.category as CollegeEvent['category'],
  location: e.venue,
  startDate: e.startDate,
  endDate: e.endDate,
  createdAt: e.createdAt,
  // extra backend fields stored for completeness
  venue: e.venue,
  maxAttendees: e.maxAttendees,
  status: e.status,
  organizer: e.organizer,
});

interface EventContextType {
  events: CollegeEvent[];
  loading: boolean;
  error: string | null;
  fetchEvents: (filters?: EventFilters) => Promise<void>;
  addEvent: (event: CreateEventPayload) => Promise<{ ok: boolean; error?: string }>;
  deleteEvent: (id: string) => Promise<{ ok: boolean; error?: string }>;
}

const EventContext = createContext<EventContextType | null>(null);

export const useEvents = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents must be used within EventProvider');
  return ctx;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CollegeEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (filters?: EventFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventsApi.getAll(filters);
      setEvents(data.events.map(mapEvent));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to load events';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = useCallback(
    async (payload: CreateEventPayload): Promise<{ ok: boolean; error?: string }> => {
      try {
        const data = await eventsApi.create(payload);
        setEvents((prev) => [mapEvent(data.event), ...prev]);
        return { ok: true };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Failed to create event';
        return { ok: false, error: msg };
      }
    },
    []
  );

  const deleteEvent = useCallback(
    async (id: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        await eventsApi.delete(id);
        setEvents((prev) => prev.filter((e) => e.id !== id));
        return { ok: true };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Failed to delete event';
        return { ok: false, error: msg };
      }
    },
    []
  );

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <EventContext.Provider value={{ events, loading, error, fetchEvents, addEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};
