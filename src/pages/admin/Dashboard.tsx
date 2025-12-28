import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Mail, Briefcase, FolderOpen, Info, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    contacts: 0,
    services: 0,
    projects: 0,
    careers: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('adminToken');

        const [contacts, services, projects, careers] = await Promise.all([
          fetch(`${API_URL}/contact`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/services`),
          fetch(`${API_URL}/projects`),
          fetch(`${API_URL}/careers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const contactsData = await contacts.json();
        const servicesData = await services.json();
        const projectsData = await projects.json();
        const careersData = await careers.json();

        setStats({
          contacts: contactsData.data?.length || 0,
          services: servicesData.data?.length || 0,
          projects: projectsData.data?.length || 0,
          careers: careersData.data?.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Contacts</p>
                <p className="text-3xl font-bold">{stats.contacts}</p>
              </div>
              <Mail className="h-12 w-12 text-primary/20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Services</p>
                <p className="text-3xl font-bold">{stats.services}</p>
              </div>
              <Briefcase className="h-12 w-12 text-primary/20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Projects</p>
                <p className="text-3xl font-bold">{stats.projects}</p>
              </div>
              <FolderOpen className="h-12 w-12 text-primary/20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Career Applications</p>
                <p className="text-3xl font-bold">{stats.careers}</p>
              </div>
              <FileText className="h-12 w-12 text-primary/20" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link to="/admin/contacts">
            <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
              <Mail className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Manage Contacts</h3>
              <p className="text-sm text-muted-foreground">View and manage contact submissions</p>
            </Card>
          </Link>
          <Link to="/admin/services">
            <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
              <Briefcase className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Manage Services</h3>
              <p className="text-sm text-muted-foreground">Add, edit, or remove services</p>
            </Card>
          </Link>
          <Link to="/admin/projects">
            <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
              <FolderOpen className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Manage Projects</h3>
              <p className="text-sm text-muted-foreground">Manage project portfolio</p>
            </Card>
          </Link>
          <Link to="/admin/about">
            <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
              <Info className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Manage About</h3>
              <p className="text-sm text-muted-foreground">Update company information</p>
            </Card>
          </Link>
          <Link to="/admin/careers">
            <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
              <FileText className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Manage Careers</h3>
              <p className="text-sm text-muted-foreground">View and manage job applications</p>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}

