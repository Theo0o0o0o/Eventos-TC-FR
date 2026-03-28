import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { EventForm, type EventFormValues } from '@/components/events/EventForm';
import { mockEvents } from '@/data/mockData';

const EventEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">
            Evento não encontrado
          </h1>
          <p className="text-muted-foreground mb-6">
            O evento que procura não existe ou foi removido.
          </p>
          <Link to="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = (values: EventFormValues) => {
    console.log('Evento atualizado:', values);
    toast.success('Evento atualizado!', {
      description: `"${values.title}" foi atualizado com sucesso.`,
    });
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26 }}
        >
          <Button
            variant="ghost"
            className="gap-2 mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Editar Evento
            </h1>
            <p className="text-muted-foreground mt-1">
              Atualize os detalhes de "{event.title}".
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 md:p-8">
            <EventForm
              defaultValues={{
                title: event.title,
                description: event.description,
                type: event.type,
                date: event.date,
                time: event.time,
                duration: event.duration,
                location: event.location,
                maxParticipants: event.maxParticipants,
              }}
              onSubmit={handleSubmit}
              onCancel={() => navigate(-1)}
              isEditing
            />
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default EventEdit;
