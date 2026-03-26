import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import logo from '@/assets/logo.png';

export function Footer() {
  return (
    <footer className="relative mt-12 overflow-hidden border-t border-white/10 bg-[linear-gradient(180deg,hsl(221_52%_14%/0.88),hsl(224_58%_10%/0.96))] text-[hsl(210,20%,85%)] backdrop-blur-xl dark:bg-[linear-gradient(180deg,hsl(224_36%_10%/0.88),hsl(226_44%_7%/0.98))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,hsl(var(--secondary)/0.16),transparent_60%)]" />
      <div className="container relative py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link to="/" className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-colors hover:bg-white/10">
            <img src={logo} alt="Eventos TC" className="h-11 w-auto opacity-95" />
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[hsl(210,18%,84%)]">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              289-889-570
            </span>
            <a href="mailto:secretaria@agr-tc.pt" className="transition-colors hover:text-white">
              secretaria@agr-tc.pt
            </a>
            <a href="mailto:direcao.agrupamento@agr-tc.pt" className="transition-colors hover:text-white">
              direcao.agrupamento@agr-tc.pt
            </a>
          </div>

          <p className="text-xs text-[hsl(210,18%,68%)]">
            Copyright © {new Date().getFullYear()}. Agrupamento de Escolas Tomás Cabreira, em Faro.
          </p>
        </div>
      </div>
    </footer>
  );
}
