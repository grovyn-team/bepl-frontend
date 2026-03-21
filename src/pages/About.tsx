import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Eye, Users, Award, Shield, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionHeading } from '@/components/ui/section-heading';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/ScrollAnimations';
import { PageLoader } from '@/components/ui/loader';
import { aboutAPI } from '@/lib/api';
import aboutImage from '@/assets/about-industrial.jpg';
import servicesPiping from '@/assets/services-piping.jpg';
import founderImage from '@/assets/founder.jpeg';

// Icon mapping for values
const iconMap: Record<string, any> = {
  Shield,
  Target,
  Users,
  Award,
};

// Certifications & awards (from Essar Steel, EHESL, National Safety Day, etc.)
const certificationCards = [
  {
    title: 'Contractor Safety Performance Award',
    year: '2018',
    achievement: 'Second Prize for Contractors Safety Performance Award',
    recipient: 'M/s. Babu Erectors Pvt. Ltd.',
    occasion: '1st Steel Safety Day & 48th National Safety Day',
    date: '28th March 2019',
    issuer: 'Essar Steel India Limited, Hazira',
  },
  {
    title: 'Certificate of Appreciation',
    year: '2018-19',
    achievement: 'Winner amongst all contractors for Best HSE Conscious Contractor',
    recipient: 'M/s Babu Erectors Pvt. Ltd.',
    occasion: 'at EHESL Hazira',
    date: '2018-2019',
    issuer: 'EHESL Hazira',
  },
  {
    title: 'Safety Rally Award',
    year: '2014',
    achievement: 'Winner Trophy for participation in Safety Rally',
    recipient: 'M/s. Babu Enterprises',
    occasion: '43rd National Safety Day Celebration',
    date: '4th March 2014',
    issuer: 'Essar Steel',
  },
  {
    title: 'Contractor Safety Performance Award',
    year: '2012',
    achievement: 'Second Runners-up for Excellent Contractor Safety Performance',
    recipient: 'M/s. Babu Enterprises',
    occasion: '42nd National Safety Day Celebration',
    date: '4th March 2013',
    issuer: 'Essar Steel',
  },
  {
    title: 'Certificate of Excellence',
    year: '2012',
    achievement: 'Runner-up Trophy for Group Fire Fighting Competition',
    recipient: 'M/s. Babu Enterprise (CSP Mill)',
    occasion: '68th National Fire Service Day',
    date: '14th April 2012',
    issuer: 'Essar Steel India Limited, Hazira',
  },
  {
    title: 'Best Safety Rally Award',
    year: '2012',
    achievement: 'Second Prize for Best Safety Rally',
    recipient: 'M/s. Babu Engineering',
    occasion: '41st National Safety Day Celebration',
    date: '5th March 2012',
    issuer: 'Essar Steel',
  },
];

export default function About() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [certIndex, setCertIndex] = useState(0);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const response = await aboutAPI.get();
      setAboutData(response.data || {});
    } catch (error) {
      console.error('Failed to fetch about data:', error);
      setAboutData({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <PageLoader />
      </Layout>
    );
  }

  const milestones = aboutData?.milestones || [];
  const values = aboutData?.values || [];
  const certifications = aboutData?.certifications || [];
  const teamStats = aboutData?.teamStats || { engineers: 103, supervisors: 209, technicians: 3000, yearsExperience: 44 };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Our Story
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {aboutData?.heroTitle || "Building a Legacy of"} <span className="text-gradient">{aboutData?.heroTitle ? "" : "Excellence"}</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              {aboutData?.heroDescription || "For over 44 years, BEPL has been at the forefront of industrial construction, delivering precision engineering and unwavering commitment to safety."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <img
                  src={aboutData?.aboutImage || aboutImage}
                  alt="Industrial facility"
                  className="rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-card border border-border p-6 rounded-xl shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-display text-2xl font-bold">Zero</div>
                      <div className="text-sm text-muted-foreground">Accident Policy</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {aboutData?.aboutContent ? (
                  <div dangerouslySetInnerHTML={{ __html: aboutData.aboutContent.replace(/\n/g, '<br />') }} />
                ) : (
                  <>
                    <p>
                      The company M/s BABU ERECTORS PVT.LTD was formed in the year 2013, as a sister concern
                      of BABU ENGINEERING WORKS, established in 1982. We are the leading contractors in the area
                      of Fabrication and Erection of Structural works, Erection and Alignment of Mechanical Equipments,
                      and Fabrication and Erection of Piping works.
                    </p>
                    <p>
                      With the Head Office situated in Surat (Gujarat), Babu Erectors operates across India with
                      the highest ethical and professional standards. Our vision encompasses the tradition of
                      delivering quality by adopting best construction practices in the industry.
                    </p>
                    <p>
                      We specialize in mechanical and structural works, including fabrication and erection of 
                      Structural, Piping & Equipment for commercial and industrial clients. With over 44 years 
                      in the business, we've earned tremendous appreciation from our clients.
                    </p>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Message from MD */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-lg">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <span className="font-display font-bold text-primary-foreground text-2xl">
                          {(aboutData?.mdMessage?.name || 'K. Samuel')
                            .split(/\s+/)
                            .map((w) => w[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2) || 'KS'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-xl">{aboutData?.mdMessage?.name || 'K. Samuel'}</h3>
                        <p className="text-muted-foreground">{aboutData?.mdMessage?.position || 'Managing Director'}</p>
                      </div>
                    </div>
                    <blockquote className="text-lg leading-relaxed text-muted-foreground italic border-l-4 border-primary pl-6">
                      {aboutData?.mdMessage?.message ? (
                        <div dangerouslySetInnerHTML={{ __html: aboutData.mdMessage.message.replace(/\n/g, '<br />') }} />
                      ) : (
                        <>
                          "It is my pleasure to communicate with you the 44 Years of business of BABU ERECTORS PVT LTD. 
                          Since founded in 1982, we have achieved new levels of growth through implementing a wide range 
                          of projects and positioned ourselves as one of the leading Engineering Companies in India.
                          <br /><br />
                          Being an engineering company, we have never compromised on the quality of safety work. We have
                          always ensured safety as a fundamental requirement for the continuation of our business operations.
                          Our 'Zero-accidental' policy has always set a benchmark for our goals.
                          <br /><br />
                          We consider the people at BEPL as one team and treat each other with equal respect. Together we
                          will achieve our goals."
                        </>
                      )}
                    </blockquote>
                  </div>
                  <div className="flex items-center justify-center">
                    <img 
                      src={aboutData?.mdMessage?.image || founderImage} 
                      alt={aboutData?.mdMessage?.name || 'K. Samuel'} 
                      className="rounded-2xl shadow-xl w-full max-w-md aspect-[3/4] object-cover"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal direction="left">
              <div className="bg-card border border-border rounded-2xl p-8 h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {aboutData?.vision || "To be the most trusted and preferred partner in industrial construction, recognized for our commitment to excellence, safety, and innovation. We aim to set industry benchmarks in structural steel erection and heavy engineering services across India."}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="bg-card border border-border rounded-2xl p-8 h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {aboutData?.mission || "To deliver quality construction services with unwavering commitment to safety and on-time delivery. We strive to understand our clients' needs, provide technological solutions that add business value, and maintain the highest ethical and professional standards."}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Certifications Carousel */}
      {/*<section className="py-24 bg-muted/50 overflow-visible">
        <div className="container mx-auto px-4 overflow-visible">
          <SectionHeading
            badge="Our Achievements"
            title="Certifications & Awards"
            description="Industry recognition for safety, excellence, and consistent performance from leading clients."
          />

          <div className="max-w-6xl mx-auto mt-16 px-4 sm:px-6">
            {/* Single frame: 3 cards — center clear, left/right behind and blurry 
            <div className="relative h-[380px] flex items-center justify-center overflow-visible">
              {[-1, 0, 1].map((offset) => {
                const idx = (certIndex + offset + certificationCards.length) % certificationCards.length;
                const cert = certificationCards[idx];
                const isCenter = offset === 0;
                return (
                  <motion.div
                    key={`${idx}-${offset}`}
                    initial={false}
                    animate={{
                      scale: isCenter ? 1 : 0.9,
                      opacity: isCenter ? 1 : 0.5,
                      filter: isCenter ? 'blur(0px)' : 'blur(6px)',
                      x: offset * 220,
                      zIndex: isCenter ? 20 : 10 - Math.abs(offset),
                    }}
                    transition={{
                      type: 'tween',
                      duration: 0.26,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    style={{ willChange: isCenter ? 'auto' : 'transform' }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div
                      className={`w-full max-w-md rounded-2xl border shadow-xl transition-all duration-300 ${
                        isCenter
                          ? 'border-primary/40 bg-card shadow-xl'
                          : 'border-border bg-card/80 pointer-events-none'
                      }`}
                    >
                      <div className="p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wider">
                            <Award className="h-3.5 w-3.5" />
                            {cert.year}
                          </span>
                          {isCenter && (
                            <Shield className="h-8 w-8 text-primary/60" aria-hidden />
                          )}
                        </div>
                        <h3 className="font-display text-lg font-bold text-foreground mb-2 leading-tight">
                          {cert.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {cert.achievement}
                        </p>
                        <div className="border-t border-border pt-4 space-y-1">
                          <p className="text-xs font-medium text-foreground">{cert.recipient}</p>
                          <p className="text-xs text-muted-foreground">{cert.occasion} · {cert.date}</p>
                          <p className="text-xs text-muted-foreground/80">{cert.issuer}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Prev / Next and dots 
            <div className="flex items-center justify-between mt-8 px-2">
              <button
                type="button"
                onClick={() => setCertIndex((i) => (i === 0 ? certificationCards.length - 1 : i - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                aria-label="Previous certification"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                {certificationCards.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCertIndex(i)}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      i === certIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to certification ${i + 1}`}
                    aria-current={i === certIndex ? 'true' : undefined}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCertIndex((i) => (i === certificationCards.length - 1 ? 0 : i + 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                aria-label="Next certification"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>*/}

      {/* Certifications */}
      {/* <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Certifications
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Industry Recognized Excellence
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Our commitment to quality and safety is validated by prestigious certifications 
                and awards from leading industry bodies.
              </p>
              <ul className="space-y-4">
                {certifications.map((cert) => (
                  <li key={cert} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <img 
                src={aboutData?.certificationImage || servicesPiping} 
                alt="Quality work" 
                className="rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover"
              />
            </ScrollReveal>
          </div>
        </div>
      </section> */}

      {/* Team Stats */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Our Team"
            title="Strength in Numbers"
            description="A dedicated workforce committed to excellence in every project."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {[
              { value: teamStats.engineers || 50, suffix: '+', label: 'Engineers' },
              { value: teamStats.supervisors || 200, suffix: '+', label: 'Technical Supervisors' },
              { value: teamStats.technicians, suffix: '+', label: 'Skilled Technicians' },
              { value: teamStats.yearsExperience, suffix: '+', label: 'Years Experience' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-card border border-border rounded-2xl"
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
