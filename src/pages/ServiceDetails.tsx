import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Building2, Wrench, HardHat, Settings, Cog, Hammer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ScrollReveal } from '@/components/animations/ScrollAnimations';
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

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchService();
      fetchAllServices();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getOne(id!);
      setService(response.data);
    } catch (error) {
      console.error('Failed to fetch service:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllServices = async () => {
    try {
      const response = await serviceAPI.getAll();
      const services = response.data || [];
      setAllServices(services);
      const index = services.findIndex((s: any) => s._id === id || s.id === id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const getNextService = () => {
    if (allServices.length === 0) return;
    const nextIndex = (currentIndex + 1) % allServices.length;
    const nextService = allServices[nextIndex];
    navigate(`/services/${nextService._id || nextService.id}`);
  };

  const getPrevService = () => {
    if (allServices.length === 0) return;
    const prevIndex = (currentIndex - 1 + allServices.length) % allServices.length;
    const prevService = allServices[prevIndex];
    navigate(`/services/${prevService._id || prevService.id}`);
  };

  if (loading) {
    return (
      <Layout>
        <PageLoader />
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Service not found</h2>
            <Link to="/services">
              <Button>Back to Services</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const IconComponent = service.icon && iconMap[service.icon] ? iconMap[service.icon] : null;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Link to="/services">
              <Button variant="ghost" className="mb-6 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Services
              </Button>
            </Link>
            <div className="flex items-center gap-4 mb-6">
              {IconComponent && (
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
              )}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
                {service.title}
              </h1>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Image */}
      {service.image && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Service Details */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="prose prose-lg max-w-none mb-8">
                <h2 className="font-display text-3xl font-bold mb-6">Service Overview</h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {service.description}
                </div>
              </div>

              {service.features && service.features.length > 0 && (
                <div className="mt-12">
                  <h3 className="font-display text-2xl font-bold mb-6">Key Features</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Navigation */}
      {allServices.length > 1 && (
        <section className="py-12 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Button
                variant="outline"
                onClick={getPrevService}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous Service
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {allServices.length}
              </span>
              <Button
                variant="outline"
                onClick={getNextService}
                className="gap-2"
              >
                Next Service
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Interested in This Service?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Let's discuss how we can help with your project requirements.
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

