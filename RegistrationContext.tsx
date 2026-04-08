import React, { createContext, useContext, useState, useCallback } from 'react';
import { Registration } from '@/types';
import { registrationsApi, BackendRegistration } from '@/lib/api';

const mapRegistration = (r: BackendRegistration): Registration => ({
  id: r._id,
  eventId: r.event_id && typeof r.event_id === 'object' ? (r.event_id as any)._id : r.event_id,
  userId: r.user_id && typeof r.user_id === 'object' ? r.user_id._id : (r.user_id as unknown as string) || '',
  userName: r.user_id && typeof r.user_id === 'object' ? r.user_id.name || 'Unknown User' : 'Unknown User',
  userEmail: r.user_id && typeof r.user_id === 'object' ? r.user_id.email || '' : '',
  userCollege: r.user_id && typeof r.user_id === 'object' && r.user_id.college ? r.user_id.college : '',
  status: r.status,
  registeredAt: r.createdAt,
});

interface RegistrationContextType {
  registrations: Registration[];
  registerForEvent: (eventId: string) => Promise<{ ok: boolean; error?: string }>;
  updateStatus: (regId: string, status: Registration['status']) => Promise<{ ok: boolean; error?: string }>;
  loadEventRegistrations: (eventId: string) => Promise<void>;
  loadMyRegistrations: () => Promise<void>;
  isRegistered: (eventId: string, userId: string) => boolean;
}

const RegistrationContext = createContext<RegistrationContextType | null>(null);

export const useRegistrations = () => {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error('useRegistrations must be used within RegistrationProvider');
  return ctx;
};

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const registerForEvent = useCallback(
    async (eventId: string): Promise<{ ok: boolean; error?: string }> => {
      try {
        const data = await registrationsApi.register(eventId);
        setRegistrations((prev) => [mapRegistration(data), ...prev]);
        return { ok: true };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Registration failed';
        return { ok: false, error: msg };
      }
    },
    []
  );

  const loadEventRegistrations = useCallback(async (eventId: string) => {
    try {
      const data = await registrationsApi.getForEvent(eventId);
      const mapped = data.map(mapRegistration);
      setRegistrations((prev) => {
        // Merge: replace existing registrations for this event
        const others = prev.filter((r) => r.eventId !== eventId);
        return [...others, ...mapped];
      });
    } catch (err) {
      console.error("Failed to load registrations:", err);
      // Admin-only endpoint: silently ignore if not authorized
    }
  }, []);

  const loadMyRegistrations = useCallback(async () => {
    try {
      const data = await registrationsApi.getMyRegistrations();
      const mapped = data.map(mapRegistration);
      setRegistrations((prev) => {
        const prevIds = new Set(mapped.map(m => m.id));
        const others = prev.filter(p => !prevIds.has(p.id));
        return [...others, ...mapped];
      });
    } catch (err) {
      console.error("Failed to load my registrations:", err);
    }
  }, []);

  const updateStatus = useCallback(
    async (regId: string, status: Registration['status']): Promise<{ ok: boolean; error?: string }> => {
      try {
        const data = await registrationsApi.updateStatus(regId, status);
        setRegistrations((prev) =>
          prev.map((r) => (r.id === regId ? mapRegistration(data) : r))
        );
        return { ok: true };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Update failed';
        return { ok: false, error: msg };
      }
    },
    []
  );

  const isRegistered = useCallback(
    (eventId: string, userId: string) =>
      registrations.some((r) => r.eventId === eventId && r.userId === userId),
    [registrations]
  );

  return (
    <RegistrationContext.Provider
      value={{ registrations, registerForEvent, updateStatus, loadEventRegistrations, loadMyRegistrations, isRegistered }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};
