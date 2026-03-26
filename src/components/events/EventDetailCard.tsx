import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Users, User, Timer, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { eventTypeLabels, eventTypeColors } from '@/data/mockData';
import type { Event } from '@/data/mockData';
import { buildEventOccurrences, dateFromDateKey } from '@/lib/eventSchedule';

interface EventDetailCardProps {
  event: Event;
  onRegister?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onApprove?: () => void;
  isRegistered?: boolean;
}

export function EventDetailCard({ event, onRegister, onEdit, onCancel, onApprove, isRegistered }: EventDetailCardProps) {
  const isFull = event.registrationType !== 'open' && event.currentParticipants >= event.maxParticipants;
  const occupancyPercent = event.registrationType !== 'open' ? Math.round((event.currentParticipants / event.maxParticipants) * 100) : 0;

  const statusLabel: Record<Event['status'], string> = {
    upcoming: 'Próximo',
    ongoing: 'A Decorrer',
    completed: 'Concluído',
    cancelled: 'Cancelado',
  };

  const occurrences = buildEventOccurrences({
    dates: event.dates as Array<Date | string> | undefined,
    fallbackDate: event.date,
    defaultTime: event.time,
    defaultDuration: event.duration,
    exceptions: event.timeExceptions || [],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={eventTypeColors[event.type] as any}>
              {event.type === 'other' && event.customType ? event.customType : eventTypeLabels[event.type]}
            </Badge>
            <Badge variant={event.status === 'upcoming' ? 'success' : event.status === 'cancelled' ? 'destructive' : 'secondary'}>
              {statusLabel[event.status]}
            </Badge>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-safe">
            {event.title}
          </h1>
        </div>
        {(onEdit || onCancel || onApprove) && (
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" onClick={onEdit}>Editar</Button>
            )}
            {onApprove && (
              <Button className="gap-2" onClick={onApprove}>
                <CheckCircle2 className="h-4 w-4" /> Aprovar Evento
              </Button>
            )}
            {onCancel && event.approved && (
              <Button variant={event.status === 'cancelled' ? 'default' : 'destructive'} onClick={onCancel}>
                {event.status === 'cancelled' ? 'Reabrir Evento' : 'Cancelar Evento'}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-3">Sobre o Evento</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-safe">{event.description}</p>
      </div>

      {/* Dates section - show all dates */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" /> Datas e Horários
        </h2>
        {occurrences.length === 1 ? (
          <div className="space-y-2">
            <p className="font-medium text-foreground">
              {format(dateFromDateKey(occurrences[0].dateKey), "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })}
            </p>
            <p className="text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" /> {occurrences[0].time} · {occurrences[0].duration} min
            </p>
            {occurrences[0].hasException && (
              <Badge variant="secondary" className="text-xs">Exceção</Badge>
            )}
          </div>
        ) : (
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
            <p className="text-sm text-muted-foreground mb-3">
              Horário padrão: {event.time} · {event.duration} min
            </p>
            {occurrences.map((occurrence) => (
              <div key={occurrence.dateKey} className="glass-muted flex items-center gap-3 rounded-2xl p-3">
                <Badge variant="outline" className="shrink-0">
                  {format(dateFromDateKey(occurrence.dateKey), "d MMM", { locale: pt })}
                </Badge>
                <span className="text-foreground text-sm">
                  {occurrence.hasException ? (
                    <span className="text-primary font-medium">{occurrence.time} · {occurrence.duration} min</span>
                  ) : (
                    <span>{occurrence.time} · {occurrence.duration} min</span>
                  )}
                </span>
                {occurrence.hasException && (
                  <Badge variant="secondary" className="text-xs">Exceção</Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Timer className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duração (padrão)</p>
            <p className="font-medium text-foreground">{event.duration} minutos</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Local</p>
            <p className="font-medium text-foreground text-safe">{event.location}</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Organizador</p>
            <p className="font-medium text-foreground">{event.organizerName}</p>
          </div>
        </div>

        {event.registrationType !== 'open' && (
          <div className="glass-card rounded-xl p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vagas</p>
              <p className="font-medium text-foreground">
                {event.currentParticipants} / {event.maxParticipants}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {event.registrationType !== 'open' && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Ocupação</span>
            <span className="text-sm text-muted-foreground">{occupancyPercent}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/40 dark:bg-white/10">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull ? 'bg-destructive' : occupancyPercent > 80 ? 'bg-amber-500' : 'bg-primary'
              }`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
          {isFull && (
            <p className="text-sm text-destructive mt-2 font-medium">Evento esgotado!</p>
          )}
        </div>
      )}

      {/* Registration Button */}
      {onRegister && event.status === 'upcoming' && (
        <Button
          size="xl"
          className="w-full"
          variant={isRegistered ? 'outline' : isFull ? 'secondary' : 'hero'}
          disabled={isFull && !isRegistered}
          onClick={onRegister}
        >
          {isRegistered ? 'Cancelar Inscrição' : isFull ? 'Evento Esgotado' : 'Inscrever-se'}
        </Button>
      )}
    </div>
  );
}
