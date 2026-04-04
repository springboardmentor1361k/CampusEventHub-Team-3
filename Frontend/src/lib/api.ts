import axios from 'axios';

// Base Axios instance pointing to our backend via Vite's proxy
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campus_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear auth data (token expired / invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('campus_token');
      localStorage.removeItem('campus_user');
    }
    return Promise.reject(error);
  }
);

/* ─────────────────────────── AUTH ─────────────────────────── */

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  college: string;
  role: 'student' | 'college_admin';
}
export interface AuthResponse {
  token?: string;
  user: {
    _id: string;
    name: string;
    email: string;
    college: string;
    role: string;
  };
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload).then((r) => r.data),
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', payload).then((r) => r.data),
};

/* ─────────────────────────── EVENTS ─────────────────────────── */

export interface BackendEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  college: string;
  startDate: string;
  endDate: string;
  venue: string;
  maxAttendees?: number;
  status: string;
  organizer: { _id: string; name: string; email: string; college: string };
  createdAt: string;
}

export interface EventFilters {
  category?: string;
  college?: string;
  venue?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  category: string;
  college: string;
  startDate: string;
  endDate: string;
  venue: string;
  maxAttendees?: number;
  status?: string;
}

export const eventsApi = {
  getAll: (filters?: EventFilters) =>
    api
      .get<{ events: BackendEvent[]; pagination: object }>('/events', { params: filters })
      .then((r) => r.data),
  getById: (id: string) =>
    api.get<{ event: BackendEvent }>(`/events/${id}`).then((r) => r.data),
  create: (payload: CreateEventPayload) =>
    api.post<{ event: BackendEvent }>('/events', payload).then((r) => r.data),
  update: (id: string, payload: Partial<CreateEventPayload>) =>
    api.put<{ event: BackendEvent }>(`/events/${id}`, payload).then((r) => r.data),
  delete: (id: string) =>
    api.delete(`/events/${id}`).then((r) => r.data),
  getColleges: () =>
    api.get<{ colleges: string[] }>('/events/colleges').then((r) => r.data.colleges),
};

/* ─────────────────────────── REGISTRATIONS ─────────────────────────── */

export interface BackendRegistration {
  _id: string;
  event_id: string;
  user_id: { _id: string; name: string; email: string; college?: string };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const registrationsApi = {
  register: (eventId: string) =>
    api.post<BackendRegistration>(`/events/${eventId}/register`).then((r) => r.data),
  getMyRegistrations: () =>
    api.get<BackendRegistration[]>('/events/my-registrations').then((r) => r.data),
  getForEvent: (eventId: string) =>
    api.get<BackendRegistration[]>(`/admin/events/${eventId}/registrations`).then((r) => r.data),
  updateStatus: (regId: string, status: 'pending' | 'approved' | 'rejected') =>
    api
      .put<BackendRegistration>(`/admin/registrations/${regId}/status`, { status })
      .then((r) => r.data),
};

/* ─────────────────────────── FEEDBACK ─────────────────────────── */

export interface BackendFeedback {
  _id: string;
  event_id: string;
  user_id: { _id: string; name: string; role: string };
  rating: number;
  comments: string;
  createdAt: string;
}

export const feedbackApi = {
  submit: (eventId: string, rating: number, comments: string) =>
    api
      .post<BackendFeedback>(`/events/${eventId}/feedback`, { rating, comments })
      .then((r) => r.data),
  getForEvent: (eventId: string) =>
    api.get<BackendFeedback[]>(`/admin/events/${eventId}/feedback`).then((r) => r.data),
};

export default api;
