import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, FileText, CheckCircle2, XCircle, Clock, Eye, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PageLoader, Loader } from '@/components/ui/loader';
import { careerAPI } from '@/lib/api';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker - use local worker from public folder
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience?: string;
  resume: string;
  coverLetter?: string;
  status: 'pending' | 'shortlisted' | 'rejected';
  createdAt: string;
}

export default function AdminCareers() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await careerAPI.getAll();
      let data = response.data || [];
      
      if (statusFilter !== 'all') {
        data = data.filter((app: Application) => app.status === statusFilter);
      }
      
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'shortlisted' | 'rejected') => {
    try {
      await careerAPI.updateStatus(id, status);
      toast({
        title: "Status updated",
        description: `Application ${status === 'shortlisted' ? 'shortlisted' : 'rejected'} successfully.`,
      });
      fetchApplications();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    try {
      await careerAPI.delete(id);
      toast({
        title: "Deleted",
        description: "Application deleted successfully",
      });
      fetchApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Shortlisted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    window.location.href = '/admin/login';
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm">← Back to Dashboard</Button>
              </Link>
              <h1 className="font-display text-2xl font-bold">Career Applications</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All ({applications.length})
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'shortlisted' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('shortlisted')}
          >
            Shortlisted
          </Button>
          <Button
            variant={statusFilter === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </Button>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No applications found</p>
            </Card>
          ) : (
            applications.map((application) => (
              <Card key={application._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-semibold text-lg">{application.name}</h3>
                      {getStatusBadge(application.status)}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                      <div>
                        <strong>Email:</strong> {application.email}
                      </div>
                      <div>
                        <strong>Phone:</strong> {application.phone}
                      </div>
                      <div>
                        <strong>Position:</strong> {application.position}
                      </div>
                      {application.experience && (
                        <div>
                          <strong>Experience:</strong> {application.experience}
                        </div>
                      )}
                      <div>
                        <strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {application.coverLetter && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {application.coverLetter}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        setSelectedApplication(application);
                        setIsDialogOpen(true);
                        setPageNumber(1);
                        setNumPages(0);
                        setPdfLoading(true);
                        setPdfError(null);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="w-full"
                    >
                      <Button variant="outline" size="sm" className="gap-2 w-full">
                        <Download className="h-4 w-4" />
                        Download Resume
                      </Button>
                    </a>
                    {application.status === 'pending' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-2 bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusUpdate(application._id, 'shortlisted')}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Shortlist
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleStatusUpdate(application._id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(application._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* View Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the candidate's application and resume
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="font-semibold">{selectedApplication.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p>{selectedApplication.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p>{selectedApplication.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Position</label>
                  <p>{selectedApplication.position}</p>
                </div>
                {selectedApplication.experience && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Experience</label>
                    <p>{selectedApplication.experience}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div>{getStatusBadge(selectedApplication.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Applied Date</label>
                  <p>{new Date(selectedApplication.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {selectedApplication.coverLetter && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cover Letter</label>
                  <p className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </p>
                </div>
              )}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-muted-foreground">Resume</label>
                  <div className="flex items-center gap-2">
                    {numPages > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                          disabled={pageNumber <= 1}
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Page {pageNumber} of {numPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                          disabled={pageNumber >= numPages}
                        >
                          Next
                        </Button>
                      </>
                    )}
                    <a
                      href={selectedApplication.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2"
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  </div>
                </div>
                <div className="border rounded-lg overflow-auto bg-muted/50 flex items-center justify-center min-h-[500px] max-h-[700px]">
                  {pdfLoading && (
                    <Loader size="lg" text="Loading PDF..." />
                  )}
                  {pdfError && (
                    <div className="flex flex-col items-center gap-2 py-12 px-4">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground text-center">{pdfError}</p>
                      <a
                        href={selectedApplication.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="mt-2">
                          Open in new tab
                        </Button>
                      </a>
                    </div>
                  )}
                  {!pdfError && (
                    <Document
                      file={{
                        url: careerAPI.getResumeUrl(selectedApplication._id),
                        httpHeaders: {
                          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
                        },
                        withCredentials: false,
                      }}
                      onLoadSuccess={({ numPages }) => {
                        setNumPages(numPages);
                        setPageNumber(1);
                        setPdfLoading(false);
                        setPdfError(null);
                      }}
                      onLoadError={(error) => {
                        setPdfError('Failed to load PDF. Please try downloading it instead.');
                        setPdfLoading(false);
                        console.error('PDF load error:', error);
                      }}
                      onLoadStart={() => {
                        setPdfLoading(true);
                        setPdfError(null);
                      }}
                      loading={
                        <Loader size="lg" text="Loading PDF..." />
                      }
                      className="flex justify-center"
                    >
                      {!pdfLoading && (
                        <div className="flex justify-center">
                          <Page
                            pageNumber={pageNumber}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="shadow-lg"
                            width={typeof window !== 'undefined' ? Math.min(800, window.innerWidth - 150) : 800}
                          />
                        </div>
                      )}
                    </Document>
                  )}
                </div>
              </div>
              {selectedApplication.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="default"
                    className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusUpdate(selectedApplication._id, 'shortlisted')}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Shortlist Candidate
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={() => handleStatusUpdate(selectedApplication._id, 'rejected')}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

