import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Award, CheckCircle2, Upload, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Layout } from '@/components/layout/Layout';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/ScrollAnimations';
import { useToast } from '@/hooks/use-toast';

const benefits = [
  { icon: Users, title: 'Team Collaboration', description: 'Work with experienced professionals' },
  { icon: Award, title: 'Career Growth', description: 'Opportunities for advancement' },
  { icon: Briefcase, title: 'Diverse Projects', description: 'Work on exciting industrial projects' },
];

export default function Careers() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    coverLetter: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile) {
      toast({
        title: "Resume required",
        description: "Please upload your resume (PDF).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const formDataToSend = new FormData();
      formDataToSend.append('resume', resumeFile);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('coverLetter', formData.coverLetter);

      const response = await fetch(`${API_URL}/careers`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        toast({
          title: "Application submitted successfully!",
          description: "We've received your application. Check your email for confirmation.",
        });
        // Reset form
        setFormData({ name: '', email: '', phone: '', position: '', experience: '', coverLetter: '' });
        setResumeFile(null);
        const fileInput = document.getElementById('resume') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        toast({
          title: "Failed to submit application",
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
              Careers
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Join Our <span className="text-gradient">Team</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Build your career with India's leading industrial construction company. 
              We're looking for talented professionals to join our growing team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="bg-card border border-border rounded-2xl p-8 lg:p-10">
                <h2 className="font-display text-2xl font-bold mb-2">Submit Your Application</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and upload your resume. We'll review your application and get back to you soon.
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
                    <h3 className="font-display text-xl font-semibold mb-2">Application Submitted!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for your interest in joining BEPL. We've received your application and will review it shortly.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', position: '', experience: '', coverLetter: '' });
                        setResumeFile(null);
                        const fileInput = document.getElementById('resume') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                    >
                      Submit Another Application
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
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Phone Number *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="position" className="block text-sm font-medium mb-2">
                          Position Applied For *
                        </label>
                        <Input
                          id="position"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          placeholder="e.g., Structural Engineer"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium mb-2">
                        Years of Experience
                      </label>
                      <Input
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="e.g., 5 years"
                      />
                    </div>

                    <div>
                      <label htmlFor="resume" className="block text-sm font-medium mb-2">
                        Resume (PDF) *
                      </label>
                      <div className="flex items-center gap-4">
                        <label
                          htmlFor="resume"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              {resumeFile ? (
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium">{resumeFile.name}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  Click to upload or drag and drop
                                </span>
                              )}
                            </div>
                          </div>
                          <input
                            id="resume"
                            name="resume"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            required
                          />
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Maximum file size: 10MB. PDF format only.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="coverLetter" className="block text-sm font-medium mb-2">
                        Cover Letter (Optional)
                      </label>
                      <Textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        placeholder="Tell us why you'd be a great fit for this position..."
                        rows={5}
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
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Why Join Us
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Benefits of Working at BEPL
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We offer a supportive work environment and opportunities for professional growth.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.1}>
            {benefits.map((benefit) => (
              <StaggerItem key={benefit.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </Layout>
  );
}

