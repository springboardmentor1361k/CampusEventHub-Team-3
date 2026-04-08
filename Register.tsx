import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, User, Mail, Lock, Building2, ArrowRight, Rocket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(name, email, password, college, role);
    setLoading(false);
    if (result.ok) {
      toast({ title: 'Account created!', description: 'Please sign in to continue.' });
      navigate('/login');
    } else {
      toast({ title: 'Registration failed', description: result.error ?? 'Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Visual Panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary relative items-center justify-center p-12 noise-overlay overflow-hidden">
        <div className="absolute inset-0 geometric-grid opacity-10" />
        <div className="absolute bottom-12 right-12 w-48 h-48 rounded-full border-2 border-primary-foreground/10" />
        <div className="absolute top-20 left-16 w-20 h-20 bg-accent/30 rounded-2xl -rotate-12" />
        <div className="absolute bottom-1/3 right-10 w-12 h-12 bg-secondary/30 rounded-full" />

        <div className="relative z-10 max-w-sm space-y-8">
          <motion.div
            className="h-20 w-20 rounded-2xl bg-primary-foreground flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            style={{ boxShadow: '4px 4px 0px 0px hsl(var(--accent))' }}
          >
            <Rocket className="h-10 w-10 text-primary" />
          </motion.div>
          <h2 className="font-display text-5xl font-extrabold text-primary-foreground leading-tight">
            Join the<br/>community<span className="text-accent">.</span>
          </h2>
          <p className="text-primary-foreground/60 text-lg leading-relaxed">Create your account and start discovering amazing inter-college events.</p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background geometric-dots">
        <motion.div
          className="w-full max-w-md space-y-7"
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
            <h1 className="font-display text-3xl font-extrabold text-foreground">Create Account</h1>
            <p className="text-muted-foreground mt-1.5">Join the inter-college event community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="pl-10 h-12 rounded-xl border-2 font-medium focus:border-primary" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold">Email</Label>
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
            <div className="space-y-2">
              <Label className="text-sm font-bold">College</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input type="text" placeholder="Enter your college name" value={college} onChange={e => setCollege(e.target.value)} className="pl-10 h-12 rounded-xl border-2 font-medium focus:border-primary" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold">Role</Label>
              <Select value={role} onValueChange={v => setRole(v as UserRole)}>
                <SelectTrigger className="h-12 rounded-xl border-2 font-medium"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">🎓 Student</SelectItem>
                  <SelectItem value="college_admin">🛡️ College Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-base brutal-shadow-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all gap-2 mt-2">
              {loading ? 'Creating Account...' : <> Create Account <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
