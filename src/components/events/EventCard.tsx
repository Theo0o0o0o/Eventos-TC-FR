import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event, eventTypeLabels, eventTypeColors } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const spotsLeft = event.maxParticipants - event.currentParticipants;
  const isAlmostFull = spotsLeft <= 10;
  const isFull = spotsLeft === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group glass-card rounded-2xl overflow-hidden card-hover"
    >
      {/* Event Image/Header */}
      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgwLDAsMCwwLjAzKSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative z-10 text-center px-6">
          <Badge variant={eventTypeColors[event.type] as any} className="mb-2">
            {eventTypeLabels[event.type]}
          </Badge>
          <h3 className="font-display text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
        </div>
        
        {/* Status indicator */}
        {isFull && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive">Esgotado</Badge>
          </div>
        )}
        {isAlmostFull && !isFull && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              Últimas vagas
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="capitalize">
              {format(event.date, "EEEE, d 'de' MMMM", { locale: pt })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>{event.time} · {event.duration} min</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Participants Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {event.currentParticipants} / {event.maxParticipants} inscritos
              </span>
            </div>
            <span className={cn(
              "font-medium",
              isFull ? "text-destructive" : isAlmostFull ? "text-amber-600" : "text-success"
            )}>
              {isFull ? 'Esgotado' : `${spotsLeft} vagas`}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
              className={cn(
                "h-full rounded-full transition-colors",
                isFull 
                  ? "bg-destructive" 
                  : isAlmostFull 
                    ? "bg-amber-500" 
                    : "bg-success"
              )}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full group/btn" 
          variant={isFull ? "outline" : "default"}
          disabled={isFull}
        >
          {isFull ? 'Lista de espera' : 'Inscrever-me'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </motion.article>
  );
}
