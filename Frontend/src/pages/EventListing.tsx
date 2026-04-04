import { useState, useEffect, useRef, useCallback } from 'react';
import { useEvents } from '@/context/EventContext';
import EventCard from '@/components/EventCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, Frown, MapPin, Calendar, Loader2, X } from 'lucide-react';
import { eventsApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'hackathon', label: '💻 Hackathon' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'cultural', label: '🎭 Cultural' },
  { value: 'workshop', label: '🔧 Workshop' },
  { value: 'seminar', label: '📚 Seminar' },
  { value: 'technical', label: '⚙️ Technical' },
  { value: 'other', label: '📌 Other' },
];

const EventListing = () => {
  const { events, loading, fetchEvents } = useEvents();

  // Filter state
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('all');
  const [college, setCollege] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Dynamic colleges from backend
  const [colleges, setColleges] = useState<string[]>([]);

  // Debounce refs for text inputs
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locationDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build filters and re-fetch whenever any filter changes
  const buildAndFetch = useCallback(
    (overrides: Record<string, string> = {}) => {
      const filters: Record<string, string> = {};
      if (search) filters.search = search;
      if (location) filters.venue = location;
      if (category !== 'all') filters.category = category;
      if (college !== 'all') filters.college = college;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      fetchEvents({ ...filters, ...overrides });
    },
    [search, location, category, college, startDate, endDate, fetchEvents]
  );

  // Fetch colleges on mount
  useEffect(() => {
    eventsApi.getColleges().then(setColleges).catch(() => {});
  }, []);

  // Fetch events when non-text filters change immediately
  useEffect(() => {
    buildAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, college, startDate, endDate]);

  // Debounce search text
  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      const filters: Record<string, string> = {};
      if (val) filters.search = val;
      if (location) filters.venue = location;
      if (category !== 'all') filters.category = category;
      if (college !== 'all') filters.college = college;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      fetchEvents(filters);
    }, 400);
  };

  // Debounce location text
  const handleLocationChange = (val: string) => {
    setLocation(val);
    if (locationDebounce.current) clearTimeout(locationDebounce.current);
    locationDebounce.current = setTimeout(() => {
      const filters: Record<string, string> = {};
      if (search) filters.search = search;
      if (val) filters.venue = val;
      if (category !== 'all') filters.category = category;
      if (college !== 'all') filters.college = college;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      fetchEvents(filters);
    }, 400);
  };

  const clearAll = () => {
    setSearch('');
    setLocation('');
    setCategory('all');
    setCollege('all');
    setStartDate('');
    setEndDate('');
    fetchEvents({});
  };

  const hasFilters = search || location || category !== 'all' || college !== 'all' || startDate || endDate;

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
          Browse Events<span className="text-primary">.</span>
        </h1>
        <p className="text-muted-foreground mt-1 font-medium">Discover inter-college events across India</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="glass-card rounded-2xl p-5 space-y-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" /> Clear all
            </button>
          )}
        </div>

        {/* Row 1: Search + Location */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              className="pl-10 h-12 rounded-xl border-2 font-medium focus:border-primary"
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by venue / location..."
              value={location}
              onChange={e => handleLocationChange(e.target.value)}
              className="pl-10 h-12 rounded-xl border-2 font-medium focus:border-primary"
            />
          </div>
        </div>

        {/* Row 2: Category + College + Dates */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Select value={category} onValueChange={v => setCategory(v)}>
            <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl border-2 font-medium">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={college} onValueChange={v => setCollege(v)}>
            <SelectTrigger className="w-full sm:w-56 h-12 rounded-xl border-2 font-medium">
              <SelectValue placeholder="All Colleges" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colleges</SelectItem>
              {colleges.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Date range */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full pl-10 pr-3 h-12 rounded-xl border-2 border-input bg-background font-medium text-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="Start date"
              />
            </div>
            <span className="text-muted-foreground text-sm font-medium shrink-0">to</span>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                min={startDate}
                className="w-full pl-10 pr-3 h-12 rounded-xl border-2 border-input bg-background font-medium text-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="End date"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">
          {loading ? (
            <span className="flex items-center gap-1.5"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading events…</span>
          ) : (
            <>Showing <span className="font-bold text-foreground">{events.length}</span> event{events.length !== 1 ? 's' : ''}</>
          )}
        </p>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted/50 border border-border animate-pulse h-56" />
            ))}
          </motion.div>
        ) : events.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="h-20 w-20 rounded-2xl bg-muted border-2 border-border flex items-center justify-center mb-4">
              <Frown className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-xl font-display font-extrabold text-foreground">No events found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
            {hasFilters && (
              <button onClick={clearAll} className="mt-4 text-sm font-semibold text-primary hover:underline">
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventListing;
