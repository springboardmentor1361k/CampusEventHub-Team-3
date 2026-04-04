import React, { createContext, useContext, useState, useCallback } from 'react';
import { Feedback } from '@/types';
import { feedbackApi, BackendFeedback } from '@/lib/api';

const mapFeedback = (f: BackendFeedback): Feedback => ({
  id: f._id,
  eventId: f.event_id,
  userId: typeof f.user_id === 'object' ? f.user_id._id : (f.user_id as string),
  userName: typeof f.user_id === 'object' ? f.user_id.name : '',
  rating: f.rating,
  comments: f.comments,
  timestamp: f.createdAt,
});

interface FeedbackContextType {
  feedbacks: Feedback[];
  addFeedback: (
    eventId: string,
    rating: number,
    comments: string
  ) => Promise<{ ok: boolean; error?: string }>;
  loadEventFeedbacks: (eventId: string) => Promise<void>;
  hasUserFeedback: (eventId: string, userId: string) => boolean;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export const useFeedback = () => {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider');
  return ctx;
};

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const addFeedback = useCallback(
    async (
      eventId: string,
      rating: number,
      comments: string
    ): Promise<{ ok: boolean; error?: string }> => {
      try {
        const data = await feedbackApi.submit(eventId, rating, comments);
        setFeedbacks((prev) => [mapFeedback(data), ...prev]);
        return { ok: true };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Failed to submit feedback';
        return { ok: false, error: msg };
      }
    },
    []
  );

  const loadEventFeedbacks = useCallback(async (eventId: string) => {
    try {
      const data = await feedbackApi.getForEvent(eventId);
      const mapped = data.map(mapFeedback);
      setFeedbacks((prev) => {
        const others = prev.filter((f) => f.eventId !== eventId);
        return [...others, ...mapped];
      });
    } catch {
      // Admin-only endpoint: silently ignore if not authorized
    }
  }, []);

  const hasUserFeedback = useCallback(
    (eventId: string, userId: string) =>
      feedbacks.some((f) => f.eventId === eventId && f.userId === userId),
    [feedbacks]
  );

  return (
    <FeedbackContext.Provider value={{ feedbacks, addFeedback, loadEventFeedbacks, hasUserFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};
