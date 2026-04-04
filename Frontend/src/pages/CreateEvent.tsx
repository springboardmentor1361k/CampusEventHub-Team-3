import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/context/EventContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { EventCategory } from '@/types';
import { CalendarDays, MapPin, Type, FileText, Tag, ArrowLeft, Rocket } from 'lucide-react';

const CreateEvent = () => {
  const { user, isAuthenticated } = useAuth();
  const { addEvent } = useEvents();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('hackathon');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.role !== 'college_admin') return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addEvent({
      title,
      description,
      category,
      college: user.college,
      venue: location,
      startDate,
      endDate,
    });
    if (result.ok) {
      toast({ title: 'Event created!', description: `"${title}" has been published.` });
      navigate('/dashboard');
    } else {
      toast({ title: 'Failed to create event', description: result.error ?? 'Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <div>
        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </button>
        <div className="page-header section-fade">
          <h1 className="font-display text-3xl font-bold text-foreground">Create New Event</h1>
          <p className="text-muted-foreground mt-1">Publish an event for {user.college}</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8 section-fade-delay-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-1.5"><Type className="h-3.5 w-3.5 text-accent" />Event Title</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Annual Hackathon 2026" className="h-11 rounded-xl" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-accent" />Description</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the event in detail..." rows={4} className="rounded-xl" required />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5 text-accent" />Category</Label>
              <Select value={category} onValueChange={v => setCategory(v as EventCategory)}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hackathon">💻 Hackathon</SelectItem>
                  <SelectItem value="sports">⚽ Sports</SelectItem>
                  <SelectItem value="cultural">🎭 Cultural</SelectItem>
                  <SelectItem value="workshop">🔧 Workshop</SelectItem>
                  <SelectItem value="seminar">📚 Seminar</SelectItem>
                  <SelectItem value="other">📌 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-accent" />Location</Label>
              <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Event venue" className="h-11 rounded-xl" required />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start" className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-accent" />Start Date & Time</Label>
              <Input id="start" type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-11 rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end" className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-accent" />End Date & Time</Label>
              <Input id="end" type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-11 rounded-xl" required />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1 h-11 rounded-xl gradient-campus border-0 text-primary-foreground hover:opacity-90 font-semibold gap-2">
              <Rocket className="h-4 w-4" /> Publish Event
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="rounded-xl h-11">Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;