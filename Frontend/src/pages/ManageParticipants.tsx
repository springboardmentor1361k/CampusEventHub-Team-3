import { useParams, Navigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { useRegistrations } from '@/context/RegistrationContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Clock, Star, Users, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const ManageParticipants = () => {
  const { id } = useParams();
  const { events } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const { registrations, updateStatus, loadEventRegistrations } = useRegistrations();
  const { feedbacks, loadEventFeedbacks } = useFeedback();
  const { toast } = useToast();

  if (!isAuthenticated || !user || user.role !== 'college_admin') return <Navigate to="/dashboard" replace />;

  const event = events.find(e => e.id === id);
  if (!event) return <Navigate to="/dashboard" replace />;
  if (event.collegeName !== user.college) return <Navigate to="/dashboard" replace />;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (id) {
      loadEventRegistrations(id);
      loadEventFeedbacks(id);
    }
  }, [id, loadEventRegistrations, loadEventFeedbacks]);

  const eventRegistrations = registrations.filter(r => r.eventId === event.id);
  const eventFeedbacks = feedbacks.filter(f => f.eventId === event.id);
  const avgRating = eventFeedbacks.length > 0 ? (eventFeedbacks.reduce((s, f) => s + f.rating, 0) / eventFeedbacks.length).toFixed(1) : 'N/A';
  const approved = eventRegistrations.filter(r => r.status === 'approved').length;
  const pending = eventRegistrations.filter(r => r.status === 'pending').length;

  const handleStatus = async (regId: string, status: 'approved' | 'rejected') => {
    const result = await updateStatus(regId, status);
    if (result.ok) {
      toast({ title: `Registration ${status}`, description: `Participant has been ${status}.` });
    } else {
      toast({ title: 'Update failed', description: result.error ?? 'Please try again.', variant: 'destructive' });
    }
  };

  const statusStyles: Record<string, string> = {
    pending: 'bg-campus-amber/10 text-campus-amber border-campus-amber/20',
    approved: 'bg-campus-green/10 text-campus-green border-campus-green/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>
        <div className="page-header section-fade">
          <h1 className="font-display text-3xl font-bold text-foreground">Manage: {event.title}</h1>
          <p className="text-muted-foreground mt-1">View registrations and feedback</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 section-fade-delay-1">
        {[
          { icon: Users, value: eventRegistrations.length, label: 'Total', color: 'bg-primary/10 text-primary' },
          { icon: CheckCircle2, value: approved, label: 'Approved', color: 'bg-campus-green/10 text-campus-green' },
          { icon: Clock, value: pending, label: 'Pending', color: 'bg-campus-amber/10 text-campus-amber' },
          { icon: Star, value: `${avgRating}`, label: `Rating (${eventFeedbacks.length})`, color: 'bg-campus-amber/10 text-campus-amber' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="relative z-10 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-fade-delay-2">
        <Tabs defaultValue="registrations">
          <TabsList className="rounded-xl">
            <TabsTrigger value="registrations" className="rounded-lg">Registrations ({eventRegistrations.length})</TabsTrigger>
            <TabsTrigger value="feedback" className="rounded-lg">Feedback ({eventFeedbacks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations" className="mt-4">
            <div className="glass-card rounded-2xl overflow-hidden">
              {eventRegistrations.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No registrations yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventRegistrations.map(reg => (
                      <TableRow key={reg.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full gradient-campus flex items-center justify-center text-[10px] font-bold text-white">
                              {reg.userName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{reg.userName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{reg.userEmail}</TableCell>
                        <TableCell className="text-muted-foreground">{reg.userCollege}</TableCell>
                        <TableCell className="text-muted-foreground">{format(new Date(reg.registeredAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`border ${statusStyles[reg.status]} font-semibold text-xs uppercase tracking-wider`}>
                            {reg.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {reg.status === 'pending' && (
                            <div className="flex gap-1.5">
                              <Button size="sm" className="h-7 text-xs gap-1 rounded-lg bg-campus-green/10 text-campus-green hover:bg-campus-green/20 border-0" onClick={() => handleStatus(reg.id, 'approved')}>
                                <CheckCircle2 className="h-3 w-3" /> Approve
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => handleStatus(reg.id, 'rejected')}>
                                <XCircle className="h-3 w-3" /> Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="mt-4">
            <div className="glass-card rounded-2xl p-6">
              {eventFeedbacks.length === 0 ? (
                <div className="p-8 text-center">
                  <Star className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No feedback yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Rating Distribution */}
                  <div className="grid gap-2 sm:grid-cols-5 mb-6 p-4 rounded-xl bg-muted/30">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = eventFeedbacks.filter(f => f.rating === star).length;
                      const pct = Math.round((count / eventFeedbacks.length) * 100);
                      return (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="flex items-center gap-0.5 w-8 shrink-0">
                            {star}<Star className="h-3 w-3 fill-campus-amber text-campus-amber" />
                          </span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-campus-amber rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageParticipants;