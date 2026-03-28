import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EventForm, type EventFormValues } from '@/components/events/EventForm';

const EventCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: EventFormValues) => {
    // Mock: just show success and navigate
    console.log('Novo evento:', values);
    toast.success('Evento criado com sucesso!', {
      description: `"${values.title}" foi adicionado à lista de eventos.`,
    });
    navigate('/dashboard');
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
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Criar Novo Evento
            </h1>
            <p className="text-muted-foreground mt-1">
              Preencha os detalhes para criar um novo evento escolar.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 md:p-8">
            <EventForm
              onSubmit={handleSubmit}
              onCancel={() => navigate(-1)}
            />
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default EventCreate;
