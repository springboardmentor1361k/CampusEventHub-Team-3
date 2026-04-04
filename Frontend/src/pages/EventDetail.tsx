import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { useRegistrations } from '@/context/RegistrationContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, MapPin, Building2, Users, Star, CheckCircle2, Clock, XCircle, ArrowLeft, Send } from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  pending: { icon: Clock, label: 'Pending Approval', className: 'bg-campus-amber/10 text-campus-amber border-campus-amber/20' },
  approved: { icon: CheckCircle2, label: 'Approved', className: 'bg-campus-green/10 text-campus-green border-campus-green/20' },
  rejected: { icon: XCircle, label: 'Rejected', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const categoryConfig: Record<string, string> = {
  hackathon: 'bg-campus-sky/10 text-campus-sky border-campus-sky/20',
  sports: 'bg-campus-green/10 text-campus-green border-campus-green/20',
  cultural: 'bg-campus-amber/10 text-campus-amber border-campus-amber/20',
  workshop: 'bg-primary/10 text-primary border-primary/20',
  seminar: 'bg-campus-navy-light/10 text-campus-navy-light border-campus-navy-light/20',
  other: 'bg-muted text-muted-foreground border-border',
};

const EventDetail = () => {
  const { id } = useParams();
  const { events } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const { registrations, registerForEvent, isRegistered, loadMyRegistrations } = useRegistrations();
  const { feedbacks, addFeedback, loadEventFeedbacks, hasUserFeedback } = useFeedback();
  const { toast } = useToast();

  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  const event = events.find(e => e.id === id);

  // Load feedbacks & registrations on mount
  useEffect(() => {
    if (id) loadEventFeedbacks(id);
    if (isAuthenticated && user?.role === 'student') loadMyRegistrations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, loadEventFeedbacks, isAuthenticated, user?.role, loadMyRegistrations]);

  if (!event) return <Navigate to="/events" replace />;

  const registered = user ? isRegistered(event.id, user.id) : false;
  const userReg = user ? registrations.find(r => r.eventId === event.id && r.userId === user.id) : null;
  const eventFeedbacks = feedbacks.filter(f => f.eventId === event.id);
  const alreadyFeedback = user ? hasUserFeedback(event.id, user.id) : false;
  const avgRating = eventFeedbacks.length > 0 ? (eventFeedbacks.reduce((s, f) => s + f.rating, 0) / eventFeedbacks.length).toFixed(1) : null;
  const regCount = registrations.filter(r => r.eventId === event.id).length;

  const handleRegister = async () => {
    if (!user) return;
    const result = await registerForEvent(event.id);
    if (result.ok) {
      toast({ title: 'Registered!', description: 'Your registration is pending approval.' });
    } else {
      toast({ title: 'Registration failed', description: result.error ?? 'Please try again.', variant: 'destructive' });
    }
  };

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const result = await addFeedback(event.id, rating, comments);
    if (result.ok) {
      toast({ title: 'Feedback submitted!', description: 'Thank you for your feedback.' });
      setComments('');
    } else {
      toast({ title: 'Failed to submit feedback', description: result.error ?? 'Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      {/* Back */}
      <Link to="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors section-fade">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Events
      </Link>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl gradient-campus p-8 sm:p-10 section-fade">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_hsl(35_92%_55%/0.1)_0%,_transparent_50%)]" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-3">
              <Badge variant="outline" className={`border ${categoryConfig[event.category] || categoryConfig.other} backdrop-blur-sm`}>
                {event.category}
              </Badge>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">{event.title}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            {avgRating && (
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-campus-amber text-campus-amber" /> {avgRating} ({feedbacks.length})
              </span>
            )}
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {regCount} registered</span>
            <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {event.collegeName}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="glass-card rounded-2xl p-6 section-fade-delay-1">
            <h2 className="font-display text-lg font-bold mb-3">About This Event</h2>
            <p className="text-foreground/80 leading-relaxed">{event.description}</p>
          </div>

          {/* Feedback */}
          <div className="glass-card rounded-2xl p-6 section-fade-delay-2">
            <h2 className="font-display text-lg font-bold mb-4">Feedback & Reviews</h2>

            {isAuthenticated && user?.role === 'student' && !alreadyFeedback && (
              <form onSubmit={handleFeedback} className="space-y-3 border-b border-border/50 pb-5 mb-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Your Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setRating(s)} className="focus:outline-none transition-transform hover:scale-110">
                        <Star className={`h-7 w-7 transition-colors ${s <= rating ? 'fill-campus-amber text-campus-amber' : 'text-muted-foreground/20'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Your Review</Label>
                  <Textarea value={comments} onChange={e => setComments(e.target.value)} placeholder="Share your experience..." rows={3} className="rounded-xl" required />
                </div>
                <Button type="submit" size="sm" className="gap-1.5 rounded-lg">
                  <Send className="h-3.5 w-3.5" /> Submit
                </Button>
              </form>
            )}
            {alreadyFeedback && (
              <p className="text-sm text-muted-foreground italic mb-4">✅ You've already submitted feedback for this event.</p>
            )}
            {eventFeedbacks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No feedback yet. Be the first to share your thoughts!</p>
            ) : (
              <div className="space-y-3">
                {eventFeedbacks.map(fb => (
                  <div key={fb.id} className="rounded-xl border border-border/50 bg-background/50 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full gradient-campus flex items-center justify-center text-[10px] font-bold text-white">
                          {fb.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm">{fb.userName}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= fb.rating ? 'fill-campus-amber text-campus-amber' : 'text-muted-foreground/20'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{fb.comments}</p>
                    <p className="text-[11px] text-muted-foreground/50">{format(new Date(fb.timestamp), 'MMM d, yyyy')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 space-y-4 section-fade-delay-1">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground">Event Details</h3>
            {[
              { icon: Building2, label: 'College', value: event.collegeName },
              { icon: CalendarDays, label: 'Starts', value: format(new Date(event.startDate), 'MMM d, yyyy • h:mm a') },
              { icon: CalendarDays, label: 'Ends', value: format(new Date(event.endDate), 'MMM d, yyyy • h:mm a') },
              { icon: MapPin, label: 'Venue', value: event.location },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <item.icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Registration */}
          {isAuthenticated && user?.role === 'student' && (
            <div className="glass-card rounded-2xl p-5 section-fade-delay-2">
              {registered && userReg ? (
                <div className="space-y-3 text-center">
                  <Badge variant="outline" className={`border ${statusConfig[userReg.status].className} font-semibold`}>
                    {React.createElement(statusConfig[userReg.status].icon, { className: 'h-3.5 w-3.5 mr-1.5 inline' })}
                    {statusConfig[userReg.status].label}
                  </Badge>
                  <p className="text-xs text-muted-foreground">Registered on {format(new Date(userReg.registeredAt), 'MMM d, yyyy')}</p>
                </div>
              ) : (
                <Button onClick={handleRegister} className="w-full gap-2 rounded-xl gradient-campus border-0 text-primary-foreground hover:opacity-90 h-11 font-semibold">
                  <Users className="h-4 w-4" /> Register for Event
                </Button>
              )}
            </div>
          )}

          {!isAuthenticated && (
            <div className="glass-card rounded-2xl p-5 text-center section-fade-delay-2">
              <p className="text-sm text-muted-foreground mb-3">Sign in to register for this event</p>
              <Link to="/login"><Button variant="outline" size="sm" className="rounded-lg">Sign In</Button></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;