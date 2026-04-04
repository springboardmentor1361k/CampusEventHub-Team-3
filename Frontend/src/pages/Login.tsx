import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
      navigate('/dashboard');
    } else {
      toast({ title: 'Login failed', description: result.error ?? 'Invalid credentials.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Visual Panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-foreground relative items-center justify-center p-12 noise-overlay overflow-hidden">
        <div className="absolute inset-0 geometric-grid opacity-10" />
        <div className="absolute top-12 right-12 w-40 h-40 rounded-full border-2 border-background/10" />
        <div className="absolute bottom-20 left-16 w-24 h-24 bg-primary/30 rounded-2xl rotate-12" />
        <div className="absolute top-1/3 left-10 w-16 h-16 bg-accent/20 rounded-full" />

        <div className="relative z-10 max-w-sm space-y-8">
          <motion.div
            className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center brutal-shadow-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            style={{ boxShadow: '4px 4px 0px 0px hsl(var(--background))' }}
          >
            <GraduationCap className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <h2 className="font-display text-5xl font-extrabold text-background leading-tight">
            Welcome<br/>back<span className="text-primary">.</span>
          </h2>
          <p className="text-background/50 text-lg leading-relaxed">Your gateway to inter-college events, hackathons, and more.</p>
          <div className="flex gap-4 pt-4">
            {['500+ Events', '50+ Colleges', '10K+ Students'].map((s, i) => (
              <div key={i} className="px-3 py-2 rounded-lg border border-background/10 text-center">
                <p className="text-sm font-bold text-background/80">{s.split(' ')[0]}</p>
                <p className="text-[10px] text-background/40 font-medium">{s.split(' ').slice(1).join(' ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background geometric-dots">
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:hidden flex flex-col items-center gap-2 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-extrabold text-foreground">CampusEventHub</h1>
          </div>

          <div>
            <h1 className="font-display text-3xl font-extrabold text-foreground">Sign in</h1>
            <p className="text-muted-foreground mt-1.5">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@college.com" className="pl-10 h-12 rounded-xl border-2 font-medium focus:border-primary" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 h-12 rounded-xl border-2 font-medium focus:border-primary" required />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-base brutal-shadow-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all gap-2">
              {loading ? 'Signing in...' : <> Sign In <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          {/* <div className="rounded-xl border-2 border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Demo Accounts
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-muted/50 p-3 border-2 border-border">
                <p className="font-bold text-sm text-foreground">Student</p>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">student@demo.com</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 border-2 border-border">
                <p className="font-bold text-sm text-foreground">Admin</p>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">admin@demo.com</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center pt-0.5">Use any password to login</p>
          </div> */}

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
