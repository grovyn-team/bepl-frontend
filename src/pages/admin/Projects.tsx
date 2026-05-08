import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { InlineLoader } from '@/components/ui/loader';
import { projectAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Project {
  _id: string;
  title: string;
  client: string;
  category: string;
  location: string;
  duration: string;
  description: string;
  image?: string;
  order: number;
  isActive: boolean;
  isRunning: boolean;
  progress: number;
  highlights: string[];
  gallery: { src: string; caption: string }[];
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    category: 'Steel Plants',
    location: '',
    duration: '',
    description: '',
    image: '',
    order: 0,
    isActive: true,
    isRunning: false,
    progress: 0,
    highlights: [] as string[],
    gallery: [] as { src: string; caption: string }[],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll();
      setProjects(response.data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch projects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (project?: Project) => {
    setImageFile(null);
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        client: project.client,
        category: project.category,
        location: project.location,
        duration: project.duration,
        description: project.description,
        image: project.image || '',
        order: project.order,
        isActive: project.isActive,
        isRunning: project.isRunning || false,
        progress: project.progress || 0,
        highlights: project.highlights || [],
        gallery: project.gallery || [],
      });
      setImagePreview(project.image || null);
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        client: '',
        category: 'Steel Plants',
        location: '',
        duration: '',
        description: '',
        image: '',
        order: 0,
        isActive: true,
        isRunning: false,
        progress: 0,
        highlights: [],
        gallery: [],
      });
      setImagePreview(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setImagePreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
    setIsDialogOpen(false);
    setEditingProject(null);
    setImageFile(null);
    fileInputRef.current && (fileInputRef.current.value = '');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid file', description: 'Please select an image file', variant: 'destructive' });
        return;
      }
      setImagePreview((prev) => {
        if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      setImageFile(file);
      setFormData((prev) => ({ ...prev, image: '' })); // Clear URL when uploading file
    }
  };

  const clearImage = () => {
    setImagePreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
    setImageFile(null);
    setFormData((prev) => ({ ...prev, image: '' }));
    fileInputRef.current && (fileInputRef.current.value = '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('client', formData.client);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('order', String(formData.order));
      formDataToSend.append('isActive', String(formData.isActive));
      formDataToSend.append('isRunning', String(formData.isRunning));
      formDataToSend.append('progress', String(formData.progress));
      formDataToSend.append('highlights', JSON.stringify(formData.highlights));
      formDataToSend.append('gallery', JSON.stringify(formData.gallery));

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else {
        formDataToSend.append('image', formData.image);
      }

      if (editingProject) {
        await projectAPI.update(editingProject._id, formDataToSend);
        toast({
          title: 'Success',
          description: 'Project updated successfully',
        });
      } else {
        await projectAPI.create(formDataToSend);
        toast({
          title: 'Success',
          description: 'Project created successfully',
        });
      }
      handleCloseDialog();
      fetchProjects();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save project',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectAPI.delete(id);
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
      fetchProjects();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout title="Manage Projects">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-3xl font-bold">Projects</h2>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {loading ? (
        <InlineLoader />
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No projects found. Create your first project!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium">{project.client}</span> • {project.location}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                      {project.category}
                    </span>
                    {project.isRunning && (
                      <span className="inline-flex items-center px-2 py-1 bg-emerald-500/10 text-emerald-600 text-xs rounded font-medium border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                        Running
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(project)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(project._id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project title"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client *</label>
                <Input
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="Client name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Steel Plants">Steel Plants</SelectItem>
                    <SelectItem value="Power Plants">Power Plants</SelectItem>
                    <SelectItem value="Refineries">Refineries</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Location"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration *</label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 2022 - Present"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Project Image</label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {imageFile ? 'Change Image' : 'Upload Image'}
                  </Button>
                  {(imagePreview || imageFile) && (
                    <Button type="button" variant="ghost" size="sm" onClick={clearImage} className="text-muted-foreground">
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
                {imagePreview && (
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Or paste URL below</p>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Image URL (optional if uploading)"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Order</label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Progress (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Highlights (comma separated)</label>
              <Input
                value={formData.highlights.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  highlights: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                placeholder="e.g., PLTCM Structure, Precision equipment alignment"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Gallery Images</label>
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  setFormData({ ...formData, gallery: [...formData.gallery, { src: '', caption: '' }] });
                }}>
                  <Plus className="h-4 w-4 mr-1" /> Add Image
                </Button>
              </div>
              <div className="space-y-2">
                {formData.gallery.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Image URL"
                      value={item.src}
                      onChange={(e) => {
                        const newGallery = [...formData.gallery];
                        newGallery[index].src = e.target.value;
                        setFormData({ ...formData, gallery: newGallery });
                      }}
                    />
                    <Input
                      placeholder="Caption"
                      value={item.caption}
                      onChange={(e) => {
                        const newGallery = [...formData.gallery];
                        newGallery[index].caption = e.target.value;
                        setFormData({ ...formData, gallery: newGallery });
                      }}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => {
                      const newGallery = formData.gallery.filter((_, i) => i !== index);
                      setFormData({ ...formData, gallery: newGallery });
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRunning"
                  checked={formData.isRunning}
                  onChange={(e) => setFormData({ ...formData, isRunning: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="isRunning" className="text-sm font-medium">
                  Is Running (In Progress)
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingProject ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCloseDialog} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

