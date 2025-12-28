import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Layout } from '@/components/layout/Layout';
import { ScrollReveal } from '@/components/animations/ScrollAnimations';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Registered Office',
    details: ['A-201 Capital Corner, Adajan,', 'Surat-395009, Gujarat, India'],
  },
  {
    icon: MapPin,
    title: 'Head Office',
    details: ['Kadukoickal House, Pallippad,', 'Haripad, Alappuzha, Kerala'],
  },
  {
    icon: Phone,
    title: 'Phone',
    details: ['+91 944 700 9417', '+91 990 943 6910', '0479-2409417'],
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['babuerectors@yahoo.com', 'babuerectorspvtltd@gmail.com'],
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible. Check your email for confirmation.",
        });
        // Reset form
        setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
      } else {
        toast({
          title: "Failed to send message",
          description: data.message || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
              Contact Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Let's <span className="text-gradient">Work Together</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Have a project in mind? Get in touch with our team to discuss how we can 
              help bring your vision to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <ScrollReveal direction="left">
              <div className="bg-card border border-border rounded-2xl p-8 lg:p-10">
                <h2 className="font-display text-2xl font-bold mb-2">Send us a Message</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We'll be in touch soon.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@company.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium mb-2">
                          Company Name
                        </label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Project Inquiry"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Contact Information */}
            <ScrollReveal direction="right">
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-2xl font-bold mb-2">Get in Touch</h2>
                  <p className="text-muted-foreground">
                    Reach out to us through any of these channels.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <motion.div
                      key={item.title}
                      whileHover={{ x: 4 }}
                      className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        {item.details.map((detail, index) => (
                          <p key={index} className="text-muted-foreground text-sm">
                            {item.title === 'Phone' || item.title === 'Email' ? (
                              <a 
                                href={item.title === 'Phone' ? `tel:${detail.replace(/\s/g, '')}` : `mailto:${detail}`}
                                className="hover:text-primary transition-colors"
                              >
                                {detail}
                              </a>
                            ) : (
                              detail
                            )}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Business Hours */}
                <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Business Hours</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Saturday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Map Section - Full Width */}
      <section className="py-12">
        <div className="w-full">
          <div className="aspect-video w-full h-[500px] overflow-hidden bg-muted">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.6399999999994!2d72.7750!3d21.1700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDEwJzEyLjAiTiA3MsKwNDYnMzAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="BEPL Office Location"
            />
          </div>
        </div>
      </section>

      {/* Quick Contact Bar */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-primary-foreground">
            <div className="text-center md:text-left">
              <h3 className="font-display text-xl font-semibold mb-1">Need Immediate Assistance?</h3>
              <p className="opacity-90">Call us directly for urgent project inquiries.</p>
            </div>
            <a href="tel:+919447009417">
              <Button 
                variant="secondary" 
                size="lg" 
                className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Phone className="h-5 w-5" />
                +91 944 700 9417
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
