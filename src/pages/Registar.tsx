import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowRight, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';
import escolaBg from '@/assets/escola-bg.jpg';

const Registar = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      toast.error('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setSubmitting(true);
      const ok = await register(name.trim(), email.trim(), password);

      if (ok) {
        toast.success('Conta criada com sucesso!', {
          description: 'Se a confirmação por email estiver ativada, confirme o email para poder entrar.',
        });
        navigate('/login');
      } else {
        toast.error('Não foi possível criar a conta.', {
          description: 'Verifique o email e tente novamente.',
        });
      }
    } catch (err) {
      toast.error('Erro ao criar conta.', {
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.24),transparent_42%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.18),transparent_36%)]" />
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
              <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Criar Conta</h1>
              <p className="text-sm text-muted-foreground">Registe-se como aluno para se inscrever nos eventos</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="O seu nome"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

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
                    placeholder="Mínimo 6 caracteres"
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
                {submitting ? 'A criar...' : 'Criar Conta'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem conta?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Entrar
                </Link>
              </p>
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

export default Registar;
