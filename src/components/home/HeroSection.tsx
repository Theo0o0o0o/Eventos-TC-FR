import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-8 h-72 w-72 rounded-full bg-primary/14 blur-3xl" />
        <div className="absolute bottom-0 right-[12%] h-80 w-80 rounded-full bg-secondary/12 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl dark:bg-white/5" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-panel rounded-[2rem] px-6 py-10 text-center md:px-10 md:py-14"
          >
            <div className="pointer-events-none absolute inset-x-10 top-0 h-24 rounded-full bg-white/20 blur-3xl dark:bg-white/5" />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center font-display text-4xl font-normal leading-tight text-foreground md:text-5xl lg:text-6xl"
            >
              Conecte-se aos{' '}
              eventos da nossa escola!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-8 mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              Descubra palestras, espetáculos, feiras e atividades académicas.
              {' '}Inscreva-se facilmente e acompanhe tudo num só lugar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to="/eventos">
                <Button size="xl" variant="hero" className="group">
                  Ver Eventos
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
