import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import logo from '@/assets/logo.png';

export function Footer() {
  return (
    <footer className="relative mt-14 overflow-hidden border-t border-foreground/10 bg-[hsl(223_42%_16%)] text-[hsl(45_28%_90%)]">
      <div className="absolute inset-0 poster-grid-bg opacity-[0.12]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,hsl(var(--secondary)/0.16),transparent_58%)]" />
      <div className="container relative py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <Link to="/" className="inline-flex rounded-[1.5rem] bg-white/10 p-2.5 shadow-sm transition-transform duration-150 hover:-translate-y-0.5">
              <div className="flex items-center gap-3 rounded-[1.1rem] border border-white/10 bg-white/8 px-3 py-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] bg-white/10 p-2">
                  <img src={logo} alt="Eventos TC" className="h-8 w-auto" />
                </div>
                <div>
                  <span className="block font-display text-lg font-black uppercase tracking-[-0.04em] text-white">
                    Eventos TC
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-3 text-sm text-white/82 md:items-end">
            <a href="tel:+351289889570" className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 transition-colors hover:bg-white/12">
              <Phone className="h-4 w-4" />
              289-889-570
            </a>
            <a href="mailto:secretaria@agr-tc.pt" className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 transition-colors hover:bg-white/12">
              <Mail className="h-4 w-4" />
              secretaria@agr-tc.pt
            </a>
            <a href="mailto:direcao.agrupamento@agr-tc.pt" className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 transition-colors hover:bg-white/12">
              <Mail className="h-4 w-4" />
              direcao.agrupamento@agr-tc.pt
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.12em] text-white/56">
          Copyright © {new Date().getFullYear()}. Agrupamento de Escolas Tomás Cabreira, em Faro.
        </div>
      </div>
    </footer>
  );
}
