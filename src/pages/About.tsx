import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Users, Award, Shield, CheckCircle2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionHeading } from '@/components/ui/section-heading';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/ScrollAnimations';
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

export default function About() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    );
  }

  const milestones = aboutData?.milestones || [];
  const values = aboutData?.values || [];
  const certifications = aboutData?.certifications || [];
  const teamStats = aboutData?.teamStats || { engineers: 103, supervisors: 209, technicians: 3000, yearsExperience: 40 };

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
              {aboutData?.heroDescription || "For over 40 years, BEPL has been at the forefront of industrial construction, delivering precision engineering and unwavering commitment to safety."}
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
                      Structural, Piping & Equipment for commercial and industrial clients. With over 40 years 
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
                        <span className="font-display font-bold text-primary-foreground text-2xl">KS</span>
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
                          "It is my pleasure to communicate with you the 40 Years of business of BABU ERECTORS PVT LTD. 
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
                      src={founderImage} 
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

      {/* Values */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Our Values"
            title="What Drives Us"
            description="Core principles that guide every project we undertake."
          />

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16" staggerDelay={0.1}>
            {values.map((value) => {
              const IconComponent = value.icon && iconMap[value.icon] ? iconMap[value.icon] : Shield;
              return (
                <StaggerItem key={value.title}>
                  <div className="bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Our Journey"
            title="Milestones of Excellence"
            description="Key moments in our four-decade journey of building India's industrial infrastructure."
          />

          <div className="max-w-3xl mx-auto mt-16">
            <div className="relative">
              <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-border" />
              {milestones.map((milestone, index) => (
                <ScrollReveal key={milestone.year} delay={index * 0.1}>
                  <div className="flex gap-6 mb-12 last:mb-0">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm z-10 relative">
                        {milestone.year.slice(2)}
                      </div>
                    </div>
                    <div className="flex-1 pt-1.5">
                      <span className="text-primary font-medium text-sm">{milestone.year}</span>
                      <h3 className="font-display font-semibold text-xl mt-1 mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 bg-muted/50">
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
      </section>

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
              { value: teamStats.engineers, suffix: '+', label: 'Engineers' },
              { value: teamStats.supervisors, suffix: '+', label: 'Technical Supervisors' },
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
