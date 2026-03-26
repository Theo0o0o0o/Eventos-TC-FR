import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';
import escolaBg from '@/assets/escola-bg.jpg';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClearSession = () => {
    try {
      localStorage.removeItem('eventostc-auth');

      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
          localStorage.removeItem(key);
        }
      });

      sessionStorage.clear();

      toast.success('Sessão local limpa!', {
        description: 'A página vai recarregar para permitir um novo login.',
      });

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch {
      toast.error('Não foi possível limpar a sessão.', {
        description: 'Tente novamente ou use uma janela anónima.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    if (!email.trim() || !password.trim()) {
      toast.error('Preencha todos os campos.');
      return;
    }

    try {
      setSubmitting(true);
      const ok = await login(email.trim(), password);

      if (ok) {
        toast.success('Login efetuado com sucesso!');
        navigate('/eventos');
      } else {
        toast.error('Não foi possível entrar.', {
          description: 'Verifique o email e a palavra-passe.',
        });
      }
    } catch (err) {
      toast.error('Erro ao entrar.', {
        description: err instanceof Error ? err.message : 'Tente novamente.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={escolaBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.28),transparent_42%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.18),transparent_36%)]" />
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass-panel rounded-[2rem] p-8 shadow-2xl">
            <div className="mb-6 flex justify-center">
              <div className="glass-field rounded-[1.5rem] p-3 shadow-sm">
                <img src={logo} alt="Eventos TC" className="h-14 w-auto" />
              </div>
            </div>

            <div className="mb-8 text-center">
              <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Entrar</h1>
              <p className="text-sm text-muted-foreground">Entre na sua conta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@escola.pt"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Palavra-passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    disabled={submitting}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="group w-full" size="lg" disabled={submitting}>
                {submitting ? 'A entrar...' : 'Entrar'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem conta?{' '}
                <Link to="/registar" className="font-medium text-primary hover:underline">
                  Criar conta de aluno
                </Link>
              </p>
            </div>

            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={handleClearSession}
                className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Problemas a entrar? Limpar sessão
              </button>
            </div>

            <div className="glass-muted mt-5 rounded-[1.25rem] p-4">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                Credenciais de demonstração (para avaliação/testes)
              </p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <strong>Administrador:</strong> admin@eventostc.test · Admin123!
                </p>
                <p>
                  <strong>Professor:</strong> professor@eventostc.test · Prof123!
                </p>
                <p className="opacity-80">
                  <strong>Aluno:</strong> pode criar uma conta em “Criar conta de aluno”
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-white/80 transition-colors hover:text-white">
              ← Voltar à página inicial
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
