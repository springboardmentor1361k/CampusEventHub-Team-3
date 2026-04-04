import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, LayoutDashboard, CalendarDays, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NavItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
  <Link to={to}>
    <button
      className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
        active 
          ? 'text-primary bg-primary/10' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
      {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />}
    </button>
  </Link>
);

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-border bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary group-hover:scale-105 transition-transform">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-extrabold text-foreground tracking-tight">
            Campus<span className="text-primary">Event</span>Hub
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {isAuthenticated ? (
            <>
              <NavItem to="/events" icon={CalendarDays} label="Events" active={location.pathname === '/events'} />
              <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/dashboard'} />
              {user?.role === 'college_admin' && (
                <NavItem to="/create-event" icon={Plus} label="Create" active={location.pathname === '/create-event'} />
              )}
              <div className="ml-3 flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-card px-3 py-1.5">
                  <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-xs font-extrabold text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-tight">{user?.name}</span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {user?.role === 'college_admin' ? 'Admin' : 'Student'}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="icon" onClick={handleLogout} title="Logout" className="rounded-lg border-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-lg font-semibold">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-lg bg-primary text-primary-foreground font-bold brutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="outline" size="icon" className="md:hidden border-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-border bg-card animate-fade-in p-4 space-y-2">
          {isAuthenticated ? (
            <>
              <Link to="/events" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2 font-semibold"><CalendarDays className="h-4 w-4" />Events</Button>
              </Link>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2 font-semibold"><LayoutDashboard className="h-4 w-4" />Dashboard</Button>
              </Link>
              {user?.role === 'college_admin' && (
                <Link to="/create-event" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2 font-semibold"><Plus className="h-4 w-4" />Create Event</Button>
                </Link>
              )}
              <div className="border-t-2 border-border pt-3 mt-3 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-xs font-extrabold text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive gap-1 font-semibold">
                  <LogOut className="h-3.5 w-3.5" />Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full font-semibold">Login</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full font-semibold">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
