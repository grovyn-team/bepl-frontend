import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, Wrench, HardHat, Settings, Cog, Hammer, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/ScrollAnimations';
import { PageLoader } from '@/components/ui/loader';
import { serviceAPI } from '@/lib/api';

// Icon mapping
const iconMap: Record<string, any> = {
  Building2,
  Wrench,
  HardHat,
  Settings,
  Cog,
  Hammer,
};

const additionalServices = [
  { icon: Cog, title: 'Capital Projects & Planning' },
  { icon: HardHat, title: 'Safety Measures & Planning' },
  { icon: Building2, title: 'Occupancy & Space Management' },
  { icon: Hammer, title: 'Workplace Experience' },
  { icon: Settings, title: 'Operational Efficiencies' },
  { icon: Wrench, title: 'Technological Solutions' },
];

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getAll();
      setServices(response.data || []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setServices([]);
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
              Our Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Comprehensive <span className="text-gradient">Construction Solutions</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              From structural steel erection to complete plant maintenance, we deliver 
              end-to-end engineering services with precision and excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-32">
            {services.map((service, index) => (
              <div 
                key={service.id}
                id={service.id}
                className="scroll-mt-32"
              >
                <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  <ScrollReveal direction={index % 2 === 0 ? 'left' : 'right'}>
                    <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="relative">
                        {service.image && (
                          <img 
                            src={service.image} 
                            alt={service.title}
                            className="rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover"
                          />
                        )}
                        {service.icon && iconMap[service.icon] && (() => {
                          const IconComponent = iconMap[service.icon] as React.ComponentType<{ className?: string }>;
                          return (
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-xl flex items-center justify-center shadow-xl">
                              <IconComponent className="h-10 w-10 text-primary-foreground" />
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal direction={index % 2 === 0 ? 'right' : 'left'}>
                    <div className={`order-1 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                      {service.icon && iconMap[service.icon] && (() => {
                        const IconComponent = iconMap[service.icon] as React.ComponentType<{ className?: string }>;
                        return (
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                            <IconComponent className="h-7 w-7 text-primary" />
                          </div>
                        );
                      })()}
                      <Link to={`/services/${service._id || service.id}`}>
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 hover:text-primary transition-colors cursor-pointer">
                          {service.title}
                        </h2>
                      </Link>
                      <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        {service.description}
                      </p>
                      {service.features && service.features.length > 0 && (
                        <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex gap-3">
                        <Link to={`/services/${service._id || service.id}`}>
                          <Button variant="outline" className="gap-2">
                            View Details
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to="/contact">
                          <Button variant="default" className="gap-2">
                            Discuss Your Project
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Additional Services"
            title="Value-Added Engineering Services"
            description="Beyond our core services, we offer comprehensive support to optimize your operations."
          />

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16" staggerDelay={0.1}>
            {additionalServices.map((service) => (
              <StaggerItem key={service.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">{service.title}</h3>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Consulting Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Planning Expert
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Consulting & Project Planning
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Our engineers will take your vision and necessary requirements, then transform 
                  them into the products. Our experts work closely with your execution team to 
                  identify the appropriate technologies needed to achieve the target within the given time.
                </p>
                <p>
                  Our process starts with a clear understanding of all technical quality and safety 
                  requirements. We then utilize equipment and drawings, through analysis, and other 
                  disciplines as necessary to create custom production as per your exact needs.
                </p>
                <p>
                  We leverage our expertise from cross-industry experience in heavy engineering and 
                  industrial products to deliver solutions with the highest possible design and quality 
                  standards.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="bg-card border border-border rounded-2xl p-8">
                <h3 className="font-display font-semibold text-xl mb-6">Our Approach</h3>
                <div className="space-y-6">
                  {[
                    { step: '01', title: 'Understand', desc: 'Deep dive into your requirements and objectives' },
                    { step: '02', title: 'Plan', desc: 'Develop comprehensive project execution strategy' },
                    { step: '03', title: 'Execute', desc: 'Implement with precision and safety focus' },
                    { step: '04', title: 'Deliver', desc: 'On-time completion with quality assurance' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="font-display font-bold text-primary">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Our team is ready to discuss your industrial construction needs and 
                provide tailored solutions.
              </p>
              <Link to="/contact">
                <Button variant="hero" size="xl" className="gap-2">
                  Get in Touch
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
