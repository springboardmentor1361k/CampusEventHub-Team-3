export type UserRole = 'student' | 'college_admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  role: UserRole;
}

export type EventCategory = 'sports' | 'hackathon' | 'cultural' | 'workshop' | 'seminar' | 'other';

export interface CollegeEvent {
  id: string;
  collegeId: string;
  collegeName: string;
  title: string;
  description: string;
  category: EventCategory;
  /** Frontend alias for venue */
  location: string;
  /** Backend field name */
  venue?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  image?: string;
  /** Backend extra fields */
  maxAttendees?: number;
  status?: string;
  organizer?: { _id: string; name: string; email: string; college: string };
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userCollege: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  rating: number;
  comments: string;
  timestamp: string;
}
