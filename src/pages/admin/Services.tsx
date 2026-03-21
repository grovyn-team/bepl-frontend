import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { InlineLoader } from '@/components/ui/loader';
import { serviceAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Service {
  _id: string;
  id: string;
  title: string;
  description: string;
  image?: string;
  features: string[];
  icon?: string;
  order: number;
  isActive: boolean;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    image: '',
    features: '',
    icon: '',
    order: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getAll();
      setServices(response.data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch services',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service?: Service) => {
    setImageFile(null);
    if (service) {
      setEditingService(service);
      setFormData({
        id: service.id,
        title: service.title,
        description: service.description,
        image: service.image || '',
        features: service.features.join('\n'),
        icon: service.icon || '',
        order: service.order,
        isActive: service.isActive,
      });
      setImagePreview(service.image || null);
    } else {
      setEditingService(null);
      setFormData({
        id: '',
        title: '',
        description: '',
        image: '',
        features: '',
        icon: '',
        order: 0,
        isActive: true,
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
    setEditingService(null);
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
      setFormData((prev) => ({ ...prev, image: '' }));
    }
  };

  const clearImage = () => {
    setImagePreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
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
      formDataToSend.append('id', formData.id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('features', formData.features);
      formDataToSend.append('icon', formData.icon);
      formDataToSend.append('order', String(formData.order));
      formDataToSend.append('isActive', String(formData.isActive));

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else {
        formDataToSend.append('image', formData.image);
      }

      if (editingService) {
        await serviceAPI.update(editingService._id, formDataToSend);
        toast({
          title: 'Success',
          description: 'Service updated successfully',
        });
      } else {
        await serviceAPI.create(formDataToSend);
        toast({
          title: 'Success',
          description: 'Service created successfully',
        });
      }
      handleCloseDialog();
      fetchServices();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save service',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await serviceAPI.delete(id);
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });
      fetchServices();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete service',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout title="Manage Services">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-3xl font-bold">Services</h2>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      {loading ? (
        <InlineLoader />
      ) : services.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No services found. Create your first service!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service._id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(service)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(service._id)}
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
              {editingService ? 'Edit Service' : 'Create New Service'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Service ID *</label>
              <Input
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g., structural"
                required
                disabled={!!editingService}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Service title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Service description"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Service Image</label>
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
                    <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
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
            <div>
              <label className="block text-sm font-medium mb-2">Features (one per line)</label>
              <Textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon Name</label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., Building2"
              />
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
              <div className="flex items-center gap-2 pt-8">
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
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingService ? 'Update' : 'Create'}
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

