import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Building2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ScrollReveal } from '@/components/animations/ScrollAnimations';
import { projectAPI } from '@/lib/api';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchAllProjects();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getOne(id!);
      setProject(response.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      const projects = response.data || [];
      setAllProjects(projects);
      const index = projects.findIndex((p: any) => p._id === id || p.id === id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const getNextProject = () => {
    if (allProjects.length === 0) return;
    const nextIndex = (currentIndex + 1) % allProjects.length;
    const nextProject = allProjects[nextIndex];
    navigate(`/projects/${nextProject._id || nextProject.id}`);
  };

  const getPrevProject = () => {
    if (allProjects.length === 0) return;
    const prevIndex = (currentIndex - 1 + allProjects.length) % allProjects.length;
    const prevProject = allProjects[prevIndex];
    navigate(`/projects/${prevProject._id || prevProject.id}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">Loading project details...</div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Project not found</h2>
            <Link to="/projects">
              <Button>Back to Projects</Button>
            </Link>
          </div>
        </div>
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
            className="max-w-4xl mx-auto"
          >
            <Link to="/projects">
              <Button variant="ghost" className="mb-6 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {project.category}
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <span>{project.client}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{project.duration}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Image */}
      {project.image && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Project Details */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="prose prose-lg max-w-none">
                <h2 className="font-display text-3xl font-bold mb-6">Project Overview</h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.description}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Navigation */}
      {allProjects.length > 1 && (
        <section className="py-12 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Button
                variant="outline"
                onClick={getPrevProject}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous Project
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {allProjects.length}
              </span>
              <Button
                variant="outline"
                onClick={getNextProject}
                className="gap-2"
              >
                Next Project
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
                Interested in Similar Projects?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Let's discuss how we can help bring your vision to life.
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

