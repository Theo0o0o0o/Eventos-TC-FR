import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { EventDetailCard } from '@/components/events/EventDetailCard';
import { mockEvents } from '@/data/mockData';
import { useState } from 'react';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

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
          <Link to="/">
            <Button>Voltar à lista de eventos</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleRegister = () => {
    setIsRegistered(!isRegistered);
    if (!isRegistered) {
      toast.success('Inscrição realizada!', {
        description: `Inscreveu-se em "${event.title}".`,
      });
    } else {
      toast.info('Inscrição cancelada.', {
        description: `Cancelou a inscrição em "${event.title}".`,
      });
    }
  };

  const handleCancel = () => {
    toast.error('Evento cancelado.', {
      description: `"${event.title}" foi cancelado.`,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8 max-w-4xl">
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

          <EventDetailCard
            event={event}
            onRegister={handleRegister}
            onEdit={() => navigate(`/events/${event.id}/edit`)}
            onCancel={handleCancel}
            isRegistered={isRegistered}
          />

          {/* Participants Link */}
          <div className="mt-6">
            <Link to={`/events/${event.id}/participants`}>
              <Button variant="outline" className="w-full md:w-auto">
                Ver Lista de Participantes
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
