import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { isToday, isThisWeek, isThisMonth } from 'date-fns';
import { Plus, Search, Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EventFilters } from '@/components/events/EventFilters';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { eventTypeLabels, eventTypeColors, type Event } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Eventos = () => {
  const { user, canManageEvents, isAdmin } = useAuth();
  const { events } = useEvents();
  const navigate = useNavigate();

  const [selectedTypes, setSelectedTypes] = useState<Event['type'][]>([]);
  const [selectedDate, setSelectedDate] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [search, setSearch] = useState('');
  const [showOpen, setShowOpen] = useState(false);

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        if (!event.approved) return false;
        if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) return false;
        if (selectedDate === 'today' && !isToday(event.date)) return false;
        if (selectedDate === 'week' && !isThisWeek(event.date)) return false;
        if (selectedDate === 'month' && !isThisMonth(event.date)) return false;
        if (showOpen) {
          if (event.status === 'cancelled' || event.status === 'completed') return false;
          if (event.registrationType === 'registration' && event.currentParticipants >= event.maxParticipants) return false;
        }
        if (search) {
          const q = search.toLowerCase();
          if (!event.title.toLowerCase().includes(q) && !event.description.toLowerCase().includes(q) && !event.location.toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events, selectedTypes, selectedDate, search, showOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Eventos</h1>
            <p className="text-muted-foreground mt-1">Descubra e inscreva-se nos eventos da escola</p>
          </div>
          {canManageEvents && (
            <Button size="lg" className="gap-2" onClick={() => navigate('/eventos/novo')}>
              <Plus className="h-5 w-5" /> Criar Evento
            </Button>
          )}
        </motion.div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar eventos..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant={showOpen ? 'default' : 'outline'} onClick={() => setShowOpen(!showOpen)}>Apenas abertos</Button>
        </div>

        <EventFilters selectedTypes={selectedTypes} onTypeChange={setSelectedTypes}
          selectedDate={selectedDate} onDateChange={setSelectedDate} />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, index) => {
            const isOpen = event.registrationType === 'open';
            const spotsLeft = isOpen ? Infinity : event.maxParticipants - event.currentParticipants;
            const isFull = !isOpen && spotsLeft <= 0;
            const isAlmostFull = !isOpen && spotsLeft <= 10 && !isFull;
            const isCancelled = event.status === 'cancelled';
            const isCompleted = event.status === 'completed';

            return (
              <motion.article key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={cn("group glass-card rounded-2xl overflow-hidden card-hover flex flex-col", (isCancelled || isCompleted) && "opacity-60")}>
                <div className="relative flex h-36 items-center justify-center overflow-hidden bg-[linear-gradient(135deg,hsl(var(--primary)/0.18),hsl(var(--secondary)/0.08))]">
                  {event.coverImage && (
                    <img src={event.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className={cn("absolute inset-0", event.coverImage && "bg-foreground/40")} />
                  <div className="relative z-10 text-center px-6">
                    <Badge variant={eventTypeColors[event.type] as any} className="mb-2">{event.type === 'other' && event.customType ? event.customType : eventTypeLabels[event.type]}</Badge>
                    <h3 className={cn("font-display text-lg font-bold line-clamp-2 text-safe",
                      event.coverImage ? "text-white" : "text-foreground")}>{event.title}</h3>
                  </div>
                  {isCompleted && <div className="absolute top-3 right-3"><Badge variant="secondary">Concluído</Badge></div>}
                  {isCancelled && <div className="absolute top-3 right-3"><Badge variant="destructive">Encerrado</Badge></div>}
                  {isFull && !isCancelled && !isCompleted && <div className="absolute top-3 right-3"><Badge variant="destructive">Esgotado</Badge></div>}
                  {isAlmostFull && !isCancelled && !isCompleted && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary">Últimas vagas</Badge>
                    </div>
                  )}
                  {isOpen && !isCancelled && !isCompleted && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="success">Aberto</Badge>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-1 flex-col gap-3">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-foreground"><Calendar className="h-4 w-4" />
                      <span className="capitalize">
                        {event.dates && event.dates.length > 1
                          ? `${format(event.dates[0], "d MMM", { locale: pt })} - ${format(event.dates[event.dates.length - 1], "d MMM yyyy", { locale: pt })} (${event.dates.length} datas)`
                          : format(event.date, "d MMM yyyy", { locale: pt })}
                      </span></div>
                    <div className="flex items-center gap-2 text-foreground"><Clock className="h-4 w-4" />
                      <span>{event.time} · {event.duration} min</span></div>
                    <div className="flex items-center gap-2 text-foreground"><MapPin className="h-4 w-4" />
                      <span>{event.location}</span></div>
                    {!isOpen && (
                      <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{event.currentParticipants}/{event.maxParticipants} inscritos</span></div>
                    )}
                  </div>
                  {!isOpen && (
                    <div className="h-2 overflow-hidden rounded-full bg-white/40 dark:bg-white/10">
                      <div className={cn("h-full rounded-full", isFull ? "bg-destructive" : isAlmostFull ? "bg-secondary" : "bg-success")}
                        style={{ width: `${Math.min(100, (event.currentParticipants / event.maxParticipants) * 100)}%` }} />
                    </div>
                  )}
                  <div className="flex gap-2 pt-1 mt-auto">
                    <Button className="flex-1 group/btn" variant="default" size="sm" onClick={() => navigate(`/eventos/${event.id}`)}>
                      Ver detalhes <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                    {(isAdmin || (canManageEvents && event.organizerId === user?.id)) && (
                      <Button variant="outline" size="sm" onClick={() => navigate(`/eventos/${event.id}/editar`, { state: { from: '/eventos' } })}>Editar</Button>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-lg text-muted-foreground">Nenhum evento encontrado com os filtros selecionados.</p>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Eventos;
