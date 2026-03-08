import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Shield, Clock, Award, Users, Building2, Wrench, HardHat, ChevronRight, ChevronLeft, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { SectionHeading } from '@/components/ui/section-heading';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ScrollReveal, StaggerContainer, StaggerItem, ParallaxSection } from '@/components/animations/ScrollAnimations';
import { serviceAPI, projectAPI, aboutAPI } from '@/lib/api';
import heroImage from '@/assets/Hero.jpeg';
import aboutImage from '@/assets/about-industrial.jpg';
import projectsSteel from '@/assets/projects-steel.jpg';
import projectsPower from '@/assets/projects-power.jpg';
import logoImage from '@/assets/logo.png';

// Icon mapping
const iconMap: Record<string, any> = {
  Building2,
  Wrench,
  HardHat,
  Shield,
  Award,
  Clock,
  Users,
};

const whyChooseUs = [
  { icon: Shield, title: 'Data Credible', description: 'Transparent and verified project records' },
  { icon: Award, title: 'Trusted Company', description: 'ISO certified with 40+ years of excellence' },
  { icon: Clock, title: 'Fast Execution', description: 'On-time delivery with efficient workflows' },
  { icon: Users, title: 'Best Output', description: 'Quality results backed by skilled workforce' },
];

const clients = ['AMNS', 'JSW', 'ESSAR', 'RELIANCE', 'NTPC', 'ONGC'];

const testimonials = [
  {
    quote: 'BEPL delivered our CRM 2 expansion with precision and on schedule. Their expertise in structural steel erection and equipment installation is unmatched. A trusted partner for critical projects.',
    client: 'AMNS India',
    context: 'Cold Rolling Mill & PLTCM Projects',
  },
  {
    quote: 'From Hot Strip Mill to Blast Furnace projects, BEPL has consistently met our quality and safety standards. Their team\'s technical capability and execution focus make them our preferred contractor.',
    client: 'JSW Steel',
    context: 'Steel Plant Construction',
  },
  {
    quote: 'We have partnered with BEPL across power and steel projects. Their commitment to safety, on-time delivery, and engineering excellence has been instrumental in our plant operations.',
    client: 'Essar Group',
    context: 'Power & Steel',
  },
  {
    quote: 'BEPL\'s execution on refinery and petrochemical projects has been exemplary. Their experience in structure, equipment, and piping installation gives us confidence in complex turnkey assignments.',
    client: 'Reliance Industries',
    context: 'Refinery & Petrochemical',
  },
  {
    quote: 'A reliable partner for gas-based and thermal power installations. BEPL\'s disciplined approach and skilled workforce have supported our projects across multiple locations.',
    client: 'NTPC',
    context: 'Power Plant Projects',
  },
  {
    quote: 'BEPL brings rigour and professionalism to every project. Their heavy engineering and fabrication capabilities align well with our requirements for large-scale industrial construction.',
    client: 'ONGC',
    context: 'Oil & Gas Infrastructure',
  },
];

export default function Index() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  const [services, setServices] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { value: 40, suffix: '+', label: 'Years Experience' },
    { value: 100, suffix: '+', label: 'Projects Completed' },
    { value: 3000, suffix: '+', label: 'Skilled Workers' },
    { value: 103, suffix: '+', label: 'Equipments' },
  ]);
  const [projects, setProjects] = useState<any[]>([]);
  const [aboutImageUrl, setAboutImageUrl] = useState<string | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch services (limit to 3 for homepage)
      const servicesResponse = await serviceAPI.getAll();
      const servicesData = servicesResponse.data || [];
      setServices(servicesData.slice(0, 3));

      // Fetch projects (limit to 2 for homepage)
      const projectsResponse = await projectAPI.getAll();
      const projectsData = projectsResponse.data || [];
      setProjects(projectsData.slice(0, 2));

      // Fetch stats from about
      const aboutResponse = await aboutAPI.get();
      const aboutData = aboutResponse.data;
      if (aboutData?.teamStats) {
        const projectCount = projectsData.length;
        setStats([
          { value: aboutData.teamStats.yearsExperience || 40, suffix: '+', label: 'Years Experience' },
          { value: projectCount || 100, suffix: '+', label: 'Projects Completed' },
          { value: aboutData.teamStats.technicians || 3000, suffix: '+', label: 'Skilled Workers' },
          { value: aboutData.teamStats.equipments || 103, suffix: '+', label: 'Equipaments' },
        ]);
      }
      // Set about image if available
      if (aboutData?.aboutImage) {
        setAboutImageUrl(aboutData.aboutImage);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: heroScale }}
        >
          <img
            src={heroImage}
            alt="Industrial construction site at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-background/10 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/35 via-transparent to-transparent" />
        </motion.div>

        {/* Rotating Logo Element */}
        <div className="absolute right-0 lg:right-10 top-1/2 -translate-y-1/2 w-2/5 h-[600px] hidden lg:flex items-center justify-center opacity-80 pointer-events-none" style={{ perspective: "1000px" }}>
          <motion.img
            src={logoImage}
            alt="Rotating Logo"
            className="w-full max-w-[550px] object-contain drop-shadow-2xl"
            animate={{ rotateY: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                ISO Certified Company
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
            >
              Your Trusted{' '}
              <span className="text-gradient">Service Partner</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/95 font-bold mb-10 max-w-2xl leading-relaxed"
            >
              Leading contractors in structural steel erection, equipment installation,
              and heavy engineering services. Delivering excellence across India for over four decades.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/projects">
                <Button variant="hero" size="xl" className="gap-2">
                  View Our Projects
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="heroOutline" size="xl">
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 construction-grid opacity-30" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-muted-foreground text-sm md:text-base">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <img
                  src={aboutImageUrl || aboutImage}
                  alt="Industrial warehouse interior"
                  className="rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-xl">
                  <div className="font-display text-4xl font-bold">44+</div>
                  <div className="text-sm opacity-90">Years of Excellence</div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                About BEPL
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Building a Legacy of <span className="text-gradient">Excellence</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Babu Erectors Pvt. Ltd. was formed in 2013 as a sister concern of Babu Engineering Works,
                established in 1982. We are the leading contractors in fabrication and erection of structural works,
                mechanical equipment installation, and piping systems.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                With headquarters in Surat, Gujarat, and operations across India, we've positioned ourselves
                as one of the leading engineering companies, committed to zero-accidents and on-time delivery.
              </p>
              <Link to="/about">
                <Button variant="default" className="gap-2">
                  Learn More About Us
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Our Services"
            title="Comprehensive Construction Solutions"
            description="From structural steel erection to complete plant maintenance, we deliver end-to-end engineering services."
          />

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {services.map((service, index) => {
              const IconComponent = service.icon && iconMap[service.icon] ? iconMap[service.icon] : Building2;
              return (
                <ScrollReveal key={service.id || service._id || index} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-card rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl transition-all group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComponent className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" size="lg" className="gap-2">
                View All Services
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Why Choose Us"
            title="The BEPL Advantage"
            description="Decades of experience, unwavering commitment to safety, and a track record of excellence."
          />

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16" staggerDelay={0.1}>
            {whyChooseUs.map((item) => (
              <StaggerItem key={item.title}>
                <div className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Our Projects"
            title="Delivering Excellence Across Industries"
            description="From power plants to steel mills, we've successfully completed major projects for leading industrial clients."
          />

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {projects.map((project, index) => (
              <ParallaxSection key={project._id || project.id || index} offset={index % 2 === 0 ? 30 : -30}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full aspect-[16/10] bg-muted flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="font-display text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-white/90">{project.client} • {project.location}</p>
                  </div>
                </motion.div>
              </ParallaxSection>
            ))}
            {projects.length === 0 && (
              <>
                <ParallaxSection offset={30}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={projectsSteel}
                      alt="Steel structure project"
                      className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="font-display text-2xl font-bold text-white mb-2">Steel Mill Projects</h3>
                      <p className="text-white/90">JSW, AMNS, ESSAR Steel</p>
                    </div>
                  </motion.div>
                </ParallaxSection>
                <ParallaxSection offset={-30}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={projectsPower}
                      alt="Power plant project"
                      className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="font-display text-2xl font-bold text-white mb-2">Power Plant Projects</h3>
                      <p className="text-white/90">NTPC, ESSAR Power, BHEL</p>
                    </div>
                  </motion.div>
                </ParallaxSection>
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/projects">
              <Button variant="default" size="lg" className="gap-2">
                Explore All Projects
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-muted-foreground text-sm uppercase tracking-widest">Trusted by Industry Leaders</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {clients.map((client, index) => (
              <motion.div
                key={client}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-2xl md:text-3xl font-display font-bold text-muted-foreground/70 hover:text-primary transition-colors"
              >
                {client}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Carousel */}
      <section className="py-24 lg:py-32 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Testimonials"
            title="What Our Clients Say"
            description="Hear from industry leaders who have partnered with BEPL for their most critical projects."
          />

          <div className="max-w-4xl mx-auto mt-16">
            <div className="relative">
              {/* Single card carousel */}
              <motion.div
                className="group relative rounded-2xl border border-border bg-background/50 p-8 lg:p-12 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 min-h-[280px] flex flex-col"
                whileHover={{ y: -2 }}
              >
                <div className="absolute top-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="h-14 w-14 text-primary" aria-hidden />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={testimonialIndex}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 flex-1 flex flex-col"
                  >
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8 flex-1">
                      &ldquo;{testimonials[testimonialIndex].quote}&rdquo;
                    </p>
                    <div className="border-t border-border pt-6">
                      <p className="font-display font-semibold text-foreground text-lg">{testimonials[testimonialIndex].client}</p>
                      <p className="text-sm text-muted-foreground mt-1">{testimonials[testimonialIndex].context}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Prev / Next buttons */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-11 w-11 shrink-0"
                  onClick={() => setTestimonialIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1))}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIndex(i)}
                      className={`h-2 rounded-full transition-all duration-200 ${i === testimonialIndex
                        ? 'w-8 bg-primary'
                        : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                        }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                      aria-current={i === testimonialIndex ? 'true' : undefined}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-11 w-11 shrink-0"
                  onClick={() => setTestimonialIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1))}
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
