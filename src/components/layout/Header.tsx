import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Menu, X, LogIn, LogOut, LayoutDashboard, UserCircle, Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import logo from '@/assets/logo.png';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, canManageEvents } = useAuth();
  const { getUserNotifications, markAsRead, markAllAsRead, getUnreadCount } = useNotifications();

  const unreadCount = user ? getUnreadCount(user.email) + getUnreadCount(user.id) : 0;
  const userNotifications = user
    ? [...getUserNotifications(user.email), ...getUserNotifications(user.id)].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )
    : [];

  const navLinks = [
    { href: '/eventos', label: 'Eventos', icon: Calendar },
    ...(canManageEvents ? [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []),
    ...(user ? [{ href: '/profile', label: 'Perfil', icon: UserCircle }] : []),
  ];

  const handleLogout = async () => {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      await logout();
      setMobileMenuOpen(false);
      navigate('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container py-3">
        <div className="glass-nav rounded-[1.75rem] px-4 md:px-5">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link to="/" className="group flex items-center gap-3">
              <div className="glass-field flex h-11 w-11 items-center justify-center rounded-2xl border-white/50 p-2 shadow-sm">
                <img src={logo} alt="Eventos TC" className="h-8 w-auto transition-transform duration-300 group-hover:scale-[1.03]" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-2xl font-bold tracking-tight text-foreground">Eventos TC</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + '/');
                return (
                  <Link key={link.href} to={link.href}>
                    <Button variant={isActive ? 'default' : 'ghost'} size="sm" className="gap-2 rounded-full px-4">
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {user && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="relative h-10 w-10">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground shadow-sm">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="flex items-center justify-between border-b border-white/15 px-4 py-3 dark:border-white/10">
                      <h3 className="text-sm font-medium">Notificações</h3>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            if (!user) return;
                            markAllAsRead(user.email);
                            markAllAsRead(user.id);
                          }}
                        >
                          Marcar todas como lidas
                        </Button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {userNotifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-muted-foreground">Sem notificações</p>
                      ) : (
                        userNotifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            className={`cursor-pointer border-b border-white/10 px-4 py-3 transition-colors last:border-b-0 hover:bg-primary/6 dark:border-white/5 dark:hover:bg-white/5 ${
                              !n.read ? 'bg-primary/6 dark:bg-white/5' : ''
                            }`}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.type === 'event_update' && n.title?.includes('pendente')) {
                                navigate('/dashboard/pendentes');
                              } else if (n.eventId) {
                                navigate(`/eventos/${n.eventId}`);
                              }
                            }}
                          >
                            <p className="text-sm font-medium text-foreground">{n.title}</p>
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="border-t border-white/10 p-2 dark:border-white/5">
                      <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => navigate('/notificacoes')}>
                        Ver todas as notificações
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {user ? (
                <div className="flex items-center gap-3">
                  <span
                    className="glass-field max-w-[200px] rounded-full px-3 py-1.5 text-sm text-muted-foreground"
                    title={user.name}
                  >
                    {user.name}
                  </span>
                  <Button variant="outline" size="sm" className="gap-2 rounded-full px-4" onClick={handleLogout} disabled={loggingOut}>
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? 'A sair...' : 'Sair'}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="gap-2 rounded-full px-4">
                      <LogIn className="h-4 w-4" />
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/registar">
                    <Button size="sm" className="gap-2 rounded-full px-4">
                      Criar Conta
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              {user && unreadCount > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="relative h-10 w-10">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground shadow-sm">
                        {unreadCount}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0" align="end">
                    <div className="max-h-48 overflow-y-auto">
                      {userNotifications.slice(0, 5).map((n) => (
                        <div key={n.id} className="border-b border-white/10 px-4 py-3 last:border-b-0" onClick={() => markAsRead(n.id)}>
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-muted-foreground">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden px-1 pt-2"
            >
              <div className="glass-nav rounded-[1.5rem] p-4">
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + '/');
                    return (
                      <Link key={link.href} to={link.href} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant={isActive ? 'default' : 'ghost'} className="w-full justify-start gap-2 rounded-xl">
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </Button>
                      </Link>
                    );
                  })}
                  <div className="mt-2 border-t border-white/10 pt-3 dark:border-white/5">
                    {user ? (
                      <Button
                        variant="outline"
                        className="w-full gap-2 rounded-xl"
                        onClick={handleLogout}
                        disabled={loggingOut}
                      >
                        <LogOut className="h-4 w-4" />
                        {loggingOut ? 'A sair...' : `Sair (${user.name})`}
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full gap-2 rounded-xl">
                            <LogIn className="h-4 w-4" />
                            Entrar
                          </Button>
                        </Link>
                        <Link to="/registar" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full gap-2 rounded-xl">Criar Conta</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
