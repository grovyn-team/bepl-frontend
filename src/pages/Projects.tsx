import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Building2, ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/ScrollAnimations';
import { projectAPI } from '@/lib/api';
import projectsSteel from '@/assets/projects-steel.jpg';
import projectsPower from '@/assets/projects-power.jpg';
import servicesCrane from '@/assets/services-crane.jpg';
import servicesPiping from '@/assets/services-piping.jpg';

const categories = ['All', 'Steel Plants', 'Power Plants', 'Refineries', 'Infrastructure'];

const projects = [
  {
    id: 1,
    title: 'AMNS India - CRM 2 Project',
    client: 'AMNS',
    category: 'Steel Plants',
    location: 'Hazira',
    duration: '2022 - Present',
    description: 'PLTCM Structure & Equipment erection for Cold Rolling Mill expansion project.',
    image: projectsSteel,
  },
  {
    id: 2,
    title: 'JSW HSM-2 Project',
    client: 'JSW',
    category: 'Steel Plants',
    location: 'Dolvi',
    duration: '2018 - 2021',
    description: 'Structure, Equipment and Piping Erection for Hot Strip Mill project.',
    image: servicesCrane,
  },
  {
    id: 3,
    title: 'Essar Power Plant',
    client: 'ESSAR',
    category: 'Power Plants',
    location: 'Hazira',
    duration: '2011 - 2013',
    description: 'Boiler and Turbine Auxiliary equipment installation and maintenance.',
    image: projectsPower,
  },
  {
    id: 4,
    title: 'AMNS Coke Oven Project',
    client: 'AMNS',
    category: 'Steel Plants',
    location: 'Hazira',
    duration: '2024 - Present',
    description: 'Complete piping and structural work for new coke oven facility.',
    image: servicesPiping,
  },
  {
    id: 5,
    title: 'Reliance Industries - HMD',
    client: 'RELIANCE',
    category: 'Refineries',
    location: 'Hazira',
    duration: '2002 - 2007',
    description: 'Structure, Equipment, Piping and Gas Turbine installation.',
    image: projectsSteel,
  },
  {
    id: 6,
    title: 'JSW JVML BF Project',
    client: 'JSW',
    category: 'Steel Plants',
    location: 'Bellary',
    duration: '2024 - Present',
    description: 'Fabrication and erection of piping for Blast Furnace project.',
    image: servicesCrane,
  },
  {
    id: 7,
    title: 'NTPC Gas Based Plant',
    client: 'NTPC',
    category: 'Power Plants',
    location: 'Various',
    duration: '1991 - 1999',
    description: 'Gas based boiler installation across multiple NTPC locations.',
    image: projectsPower,
  },
  {
    id: 8,
    title: 'Delhi Metro Railway',
    client: 'DMRC',
    category: 'Infrastructure',
    location: 'Delhi',
    duration: '2002 - 2003',
    description: 'Structural steel erection for Delhi Metro infrastructure.',
    image: projectsSteel,
  },
  {
    id: 9,
    title: 'Hanji Khad Bridge',
    client: 'AMNS',
    category: 'Infrastructure',
    location: 'Hazira',
    duration: '2020 - 2022',
    description: "Fabrication of India's first cable-stayed railway bridge.",
    image: servicesCrane,
  },
];

const keyClients = [
  { name: 'AMNS India', projects: 15, description: 'Long-term partner for steel plant projects' },
  { name: 'JSW Steel', projects: 12, description: 'Multiple rolling mill and equipment projects' },
  { name: 'Essar Group', projects: 20, description: 'Steel, power, and infrastructure projects' },
  { name: 'Reliance Industries', projects: 8, description: 'Refinery and petrochemical projects' },
  { name: 'NTPC', projects: 6, description: 'Power plant construction and maintenance' },
  { name: 'BHEL', projects: 4, description: 'Equipment erection partnerships' },
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll();
      setProjectsData(response.data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      // Fallback to hardcoded projects if API fails
      setProjectsData(projects);
    } finally {
      setLoading(false);
    }
  };

  // Use API data if available, otherwise fallback to hardcoded
  const allProjects = projectsData.length > 0 ? projectsData : projects;

  const filteredProjects = activeCategory === 'All' 
    ? allProjects 
    : allProjects.filter(p => p.category === activeCategory);

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
              Our Projects
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Delivering <span className="text-gradient">Excellence</span> Across Industries
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              From steel mills to power plants, explore our portfolio of successfully 
              completed projects across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-md z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id || project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={project.image || projectsSteel} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <Link to={`/projects/${project._id || project.id}`}>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {project.client}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {project.location}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {project.duration}
                        </span>
                        <span className="text-primary text-sm font-medium flex items-center gap-1">
                          View Details
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Key Clients */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Our Clients"
            title="Trusted by Industry Leaders"
            description="Building long-term partnerships with India's leading industrial corporations."
          />

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16" staggerDelay={0.1}>
            {keyClients.map((client) => (
              <StaggerItem key={client.name}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display font-semibold text-xl">{client.name}</h3>
                    <span className="text-primary font-bold">{client.projects}+</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{client.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Project History Table */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Project History
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                100+ Projects Completed
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 font-semibold">Project</th>
                      <th className="text-left p-4 font-semibold">Client</th>
                      <th className="text-left p-4 font-semibold">Nature of Work</th>
                      <th className="text-left p-4 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { project: 'AMNS INDIA LTD', client: 'AMNS', work: 'Plant Maintenance', duration: '2020 - Continue' },
                      { project: 'JSW BELLARY', client: 'JSW', work: 'HSM-1 Revamp Project', duration: '2021 - Continue' },
                      { project: 'AMNS CRM 2', client: 'AMNS', work: 'PLTCM Equipment Erection', duration: '2023 - Continue' },
                      { project: 'JSW DOLVI', client: 'JSW', work: 'HSM#2 Structure & Piping', duration: '2018 - 2021' },
                      { project: 'ESSAR STEEL', client: 'ESSAR', work: 'Plant Maintenance', duration: '2013 - 2020' },
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-4">{row.project}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded bg-primary/10 text-primary text-sm">
                            {row.client}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">{row.work}</td>
                        <td className="p-4 text-muted-foreground">{row.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Start Your Next Project With Us
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join our growing list of satisfied clients and experience the BEPL difference.
              </p>
              <Link to="/contact">
                <Button variant="hero" size="xl" className="gap-2">
                  Discuss Your Project
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
