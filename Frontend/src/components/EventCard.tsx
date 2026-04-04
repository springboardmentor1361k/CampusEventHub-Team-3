import { Link } from 'react-router-dom';
import { CollegeEvent } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Building2, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const categoryConfig: Record<string, { bg: string; icon: string }> = {
  hackathon: { bg: 'bg-campus-sky text-white', icon: '💻' },
  sports: { bg: 'bg-campus-green text-white', icon: '⚽' },
  cultural: { bg: 'bg-accent text-accent-foreground', icon: '🎭' },
  workshop: { bg: 'bg-primary text-primary-foreground', icon: '🔧' },
  seminar: { bg: 'bg-campus-violet text-white', icon: '📚' },
  other: { bg: 'bg-muted text-muted-foreground', icon: '📌' },
};

const EventCard = ({ event, showManage }: { event: CollegeEvent; showManage?: boolean }) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const cat = categoryConfig[event.category] || categoryConfig.other;

  return (
    <motion.div
      className="glass-card-hover rounded-2xl overflow-hidden group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Category strip */}
      <div className="flex items-center justify-between px-5 pt-5 pb-0">
        <Badge className={`${cat.bg} font-bold text-xs px-3 py-1 rounded-lg border-0`}>
          {cat.icon} {event.category}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
          <CalendarDays className="h-3 w-3" />
          {format(startDate, 'MMM d')}
        </div>
      </div>
      
      <div className="p-5 pt-4 space-y-3">
        <h3 className="font-display text-lg font-extrabold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{event.description}</p>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate font-medium">{event.collegeName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t-2 border-border mt-2">
          <Link to={`/events/${event.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full rounded-lg gap-1.5 border-2 font-bold group/btn hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
              View Details
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Button>
          </Link>
          {showManage && (
            <Link to={`/manage/${event.id}`}>
              <Button size="sm" className="rounded-lg bg-accent text-accent-foreground font-bold border-0 hover:opacity-90">Manage</Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
