import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { useRegistrations } from '@/context/RegistrationContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Navigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, Plus, Star, CheckCircle2, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, value, label, color, accent }: { icon: any; value: string | number; label: string; color: string; accent: string }) => (
  <motion.div
    className="stat-card group"
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
  >
    <div className="relative z-10 flex items-center gap-4">
      <div className={`flex h-13 w-13 items-center justify-center rounded-xl ${color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-3xl font-extrabold font-display text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
    <div className={`absolute top-0 right-0 w-20 h-20 ${accent} opacity-[0.06] rounded-bl-[50px]`} />
  </motion.div>
);

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { events } = useEvents();
  const { registrations, loadEventRegistrations, loadMyRegistrations } = useRegistrations();
  const { feedbacks, loadEventFeedbacks } = useFeedback();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const isAdmin = user.role === 'college_admin';
  const myEvents = isAdmin ? events.filter(e => e.collegeName === user.college) : events;

  // Load registrations/feedback for admin's events on mount
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isAdmin) {
      myEvents.forEach(e => {
        loadEventRegistrations(e.id);
        loadEventFeedbacks(e.id);
      });
    } else {
      loadMyRegistrations();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, events.length, loadMyRegistrations]);

  // Student: registrations belonging to this user
  const myRegs = registrations.filter(r => r.userId === user.id);

  // Admin: registrations for events in this college
  const myEventIds = new Set(myEvents.map(e => e.id));
  const totalRegs = isAdmin ? registrations.filter(r => myEventIds.has(r.eventId)).length : 0;
  const pendingRegs = isAdmin ? registrations.filter(r => myEventIds.has(r.eventId) && r.status === 'pending').length : 0;
  const eventFeedbacks = isAdmin ? feedbacks.filter(f => myEventIds.has(f.eventId)) : [];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border-2 border-border bg-card text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              <TrendingUp className="h-3 w-3" />
              {isAdmin ? 'Admin' : 'Student'} Dashboard
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              Hey, {user.name}<span className="text-primary">!</span>
            </h1>
            <p className="text-muted-foreground mt-1 font-medium">{user.college}</p>
          </div>
          {isAdmin && (
            <Link to="/create-event">
              <Button className="gap-2 rounded-xl bg-accent text-accent-foreground font-bold hover:opacity-90 brutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                <Plus className="h-4 w-4" />Create Event
              </Button>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} value={isAdmin ? myEvents.length : events.length} label={isAdmin ? 'Your Events' : 'Available Events'} color="bg-primary/15 text-primary" accent="bg-primary" />
        <StatCard icon={Users} value={isAdmin ? totalRegs : myRegs.length} label={isAdmin ? 'Total Registrations' : 'My Registrations'} color="bg-accent/15 text-accent" accent="bg-accent" />
        <StatCard icon={isAdmin ? Clock : CheckCircle2} value={isAdmin ? pendingRegs : myRegs.filter(r => r.status === 'approved').length} label={isAdmin ? 'Pending Approvals' : 'Approved'} color={isAdmin ? 'bg-accent/15 text-accent' : 'bg-secondary/15 text-secondary'} accent={isAdmin ? 'bg-accent' : 'bg-secondary'} />
        {isAdmin ? (
          <StatCard icon={Star} value={eventFeedbacks.length} label="Feedbacks" color="bg-accent/15 text-accent" accent="bg-accent" />
        ) : (
          <motion.div
            className="stat-card bg-primary text-primary-foreground flex items-center justify-center"
            whileHover={{ y: -3 }}
          >
            <Link to="/events">
              <Button variant="secondary" className="gap-2 rounded-xl font-bold text-base">
                <CalendarDays className="h-5 w-5" />Browse Events
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Student: My Registrations */}
      {!isAdmin && myRegs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-xl font-extrabold mb-4">My Registrations</h2>
          <div className="space-y-2">
            {myRegs.map(reg => {
              const evt = events.find(e => e.id === reg.eventId);
              if (!evt) return null;
              const statusStyles: Record<string, string> = {
                pending: 'bg-accent/15 text-accent border-accent/30',
                approved: 'bg-secondary/15 text-secondary border-secondary/30',
                rejected: 'bg-destructive/15 text-destructive border-destructive/30',
              };
              return (
                <div key={reg.id} className="glass-card rounded-xl flex items-center justify-between py-3 px-5 hover:shadow-[4px_4px_0px_0px_hsl(var(--primary)/0.1)] transition-all">
                  <div>
                    <Link to={`/events/${evt.id}`} className="font-bold text-foreground hover:text-primary transition-colors">{evt.title}</Link>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">{evt.collegeName} • {format(new Date(evt.startDate), 'MMM d, yyyy')}</p>
                  </div>
                  <Badge variant="outline" className={`border-2 ${statusStyles[reg.status]} font-bold text-xs uppercase tracking-wider`}>{reg.status}</Badge>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Events */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-extrabold">{isAdmin ? 'Your College Events' : 'Recent Events'}</h2>
          <Link to="/events">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary font-bold">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(isAdmin ? myEvents : events).slice(0, 6).map(event => (
            <EventCard key={event.id} event={event} showManage={isAdmin} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
