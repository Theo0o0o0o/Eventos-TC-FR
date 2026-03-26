import { motion } from 'framer-motion';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { useEvents } from '@/contexts/EventContext';

export function StatsSection() {
  const { events } = useEvents();

  const activeEvents = events.filter((e) => e.approved && e.status === 'upcoming').length;
  const totalParticipants = events.reduce((sum, e) => sum + e.currentParticipants, 0);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  const thisWeek = events.filter((e) => e.approved && e.date >= startOfWeek && e.date < endOfWeek).length;
  const totalMax = events
    .filter((e) => e.approved && e.registrationType === 'registration')
    .reduce((sum, e) => sum + e.maxParticipants, 0);
  const totalCurrent = events
    .filter((e) => e.approved && e.registrationType === 'registration')
    .reduce((sum, e) => sum + e.currentParticipants, 0);
  const occupancy = totalMax > 0 ? Math.round((totalCurrent / totalMax) * 100) : 0;

  const stats = [
    { label: 'Eventos Ativos', value: String(activeEvents), icon: Calendar, color: 'text-primary dark:text-white' },
    { label: 'Total Inscritos', value: String(totalParticipants), icon: Users, color: 'text-success' },
    { label: 'Esta Semana', value: String(thisWeek), icon: Clock, color: 'text-amber-600 dark:text-amber-300' },
    { label: 'Taxa de Ocupação', value: `${occupancy}%`, icon: TrendingUp, color: 'text-secondary dark:text-amber-300' },
  ];

  return (
    <section className="py-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="glass-card rounded-[1.5rem] p-5 text-center"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/40 bg-white/50 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <p className="mb-1 mt-4 text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
