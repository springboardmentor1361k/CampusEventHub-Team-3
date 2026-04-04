import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, CalendarDays, Users, Zap, ArrowRight, Sparkles, Globe, Shield, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const marqueeItems = [
  '🎯 Hackathons', '⚽ Sports Fests', '🎭 Cultural Events', '🔧 Workshops',
  '📚 Seminars', '🏆 Competitions', '🎵 Music Fests', '💡 Innovation Challenges',
  '🎯 Hackathons', '⚽ Sports Fests', '🎭 Cultural Events', '🔧 Workshops',
  '📚 Seminars', '🏆 Competitions', '🎵 Music Fests', '💡 Innovation Challenges',
];

const features = [
  { icon: CalendarDays, title: 'Discover Events', desc: 'Browse upcoming inter-college events filtered by category, date, or college.', accent: 'bg-primary', size: 'lg:col-span-2' },
  { icon: Users, title: 'Easy Registration', desc: 'Register with one click and track your status.', accent: 'bg-secondary', size: '' },
  { icon: Zap, title: 'Admin Dashboard', desc: 'Create and manage events with analytics.', accent: 'bg-accent', size: '' },
  { icon: Globe, title: 'Inter-College Network', desc: 'Connect with students from top colleges across India for competitions and collaborations.', accent: 'bg-campus-sky', size: 'lg:col-span-2' },
  { icon: Sparkles, title: 'Live Feedback', desc: 'Rate and review in real-time.', accent: 'bg-campus-green', size: '' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Secure student & admin roles.', accent: 'bg-campus-violet', size: '' },
];

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center geometric-dots">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/6 blur-[80px]" />
        
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-24 right-[20%] w-20 h-20 border-2 border-primary/20 rounded-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-32 left-[15%] w-14 h-14 bg-accent/15 rounded-full"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-40 left-[8%] w-8 h-8 bg-secondary/20 rotate-45"
          animate={{ rotate: [45, 135, 45] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-primary/20 bg-primary/5 text-sm font-medium text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Inter-College Event Platform
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground">
                Campus
                <span className="relative inline-block mx-2">
                  <span className="relative z-10 text-primary">Event</span>
                  <span className="absolute -bottom-1 left-0 w-full h-3 bg-accent/30 -skew-x-6" />
                </span>
                Hub
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Your centralized platform for discovering hackathons, sports fests, cultural programs, and workshops from top colleges.
              </p>

              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/events">
                      <Button size="lg" className="gap-2 text-base font-bold rounded-xl bg-primary text-primary-foreground h-13 px-8 brutal-shadow-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                        <CalendarDays className="h-5 w-5" />Browse Events
                      </Button>
                    </Link>
                    <Link to="/dashboard">
                      <Button size="lg" variant="outline" className="gap-2 text-base font-bold rounded-xl border-2 h-13 px-8 hover:bg-muted transition-all">
                        Dashboard <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="gap-2 text-base font-bold rounded-xl bg-primary text-primary-foreground h-13 px-8 brutal-shadow-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                        <Zap className="h-5 w-5" />Get Started Free
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="gap-2 text-base font-bold rounded-xl border-2 h-13 px-8 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">
                        Sign In <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            {/* Right side — Stats bento */}
            <motion.div
              className="hidden lg:grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {[
                { value: '500+', label: 'Events Hosted', bg: 'bg-primary text-primary-foreground', span: '' },
                { value: '50+', label: 'Colleges', bg: 'bg-accent text-accent-foreground', span: '' },
                { value: '10K+', label: 'Active Students', bg: 'bg-card border-2 border-border text-foreground', span: 'col-span-2' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  className={`${s.bg} ${s.span} rounded-2xl p-8 ${i < 2 ? 'brutal-shadow-sm' : 'brutal-shadow-sm'}`}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <p className="font-display text-4xl sm:text-5xl font-extrabold">{s.value}</p>
                  <p className="text-sm mt-2 opacity-80 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y-2 border-border bg-card py-4 overflow-hidden">
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <span key={i} className="flex-shrink-0 px-8 text-lg font-display font-bold text-muted-foreground/60 whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Features — Bento Grid */}
      <section className="container py-24">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-md border border-primary/20 mb-4">Features</span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">
            Why Campus<span className="text-primary">Event</span>Hub?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg text-lg">Everything you need to discover, manage, and participate in inter-college events.</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className={`${f.size} glass-card-hover rounded-2xl p-7 group relative overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${f.accent} opacity-5 rounded-bl-[60px]`} />
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${f.accent} text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-foreground p-12 sm:p-16 text-center noise-overlay"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 left-0 w-full h-full geometric-grid opacity-10" />
          <div className="absolute top-8 right-12 w-32 h-32 rounded-full border-2 border-background/10" />
          <div className="absolute bottom-8 left-12 w-20 h-20 bg-primary/20 rounded-2xl rotate-12" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-background leading-tight">
              Ready to explore<br />campus events?
            </h2>
            <p className="text-background/60 max-w-lg mx-auto text-lg">Join thousands of students discovering inter-college events every day.</p>
            <Link to={isAuthenticated ? '/events' : '/register'}>
              <Button size="lg" className="bg-primary text-primary-foreground rounded-xl px-10 h-13 text-base font-bold hover:opacity-90 mt-2 gap-2">
                {isAuthenticated ? 'Browse Events' : 'Get Started Now'} <ArrowUpRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-border bg-card py-10">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">CampusEventHub</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 CampusEventHub. Built for inter-college event management.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
