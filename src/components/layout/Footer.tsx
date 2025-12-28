import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowUpRight, Linkedin, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoImage from '@/assets/logo.png';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Services', href: '/services' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', href: '/contact' },
  ],
  services: [
    { label: 'Structural Steel Erection', href: '/services' },
    { label: 'Equipment Installation', href: '/services' },
    { label: 'Piping Works', href: '/services' },
    { label: 'Plant Maintenance', href: '/services' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      {/* CTA Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            <div className="text-center lg:text-left">
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-3">
                Ready to Build Your Vision?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                Partner with BEPL for your next industrial construction project.
              </p>
            </div>
            <Link to="/contact">
              <Button size="lg" className="gap-2 text-lg px-8">
                Start a Project
                <ArrowUpRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center mb-6">
              <img 
                src={logoImage} 
                alt="BEPL Logo" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <p className="text-xs text-muted-foreground">Babu Erectors Pvt. Ltd.</p>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              An ISO Certified Company delivering excellence in structural steel erection, 
              equipment installation, and heavy engineering services since 1982.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  A-201 Capital Corner, Adajan,<br />
                  Surat-395009, Gujarat, India
                </span>
              </li>
              <li>
                <a 
                  href="tel:+919447009417" 
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  +91 944 700 9417
                </a>
              </li>
              <li>
                <a 
                  href="mailto:babuerectors@yahoo.com" 
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  babuerectors@yahoo.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Babu Erectors Pvt. Ltd. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                ISO Certified Company
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
