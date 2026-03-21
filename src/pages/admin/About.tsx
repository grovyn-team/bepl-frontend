import { useState, useEffect, useRef } from 'react';
import { Save, Plus, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { InlineLoader } from '@/components/ui/loader';
import { aboutAPI, uploadAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AboutData {
  heroTitle?: string;
  heroDescription?: string;
  aboutContent?: string;
  vision?: string;
  mission?: string;
  values?: Array<{ icon: string; title: string; description: string }>;
  milestones?: Array<{ year: string; title: string; description: string }>;
  certifications?: string[];
  teamStats?: {
    engineers: number;
    supervisors: number;
    technicians: number;
    yearsExperience: number;
  };
  mdMessage?: {
    name: string;
    position: string;
    message: string;
    image?: string;
  };
}

export default function AdminAbout() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<AboutData>({});
  const [mdImageUploading, setMdImageUploading] = useState(false);
  const mdImageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const response = await aboutAPI.get();
      setFormData(response.data || {});
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch about content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await aboutAPI.update(formData);
      toast({
        title: 'Success',
        description: 'About content updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update about content',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const addValue = () => {
    setFormData({
      ...formData,
      values: [...(formData.values || []), { icon: '', title: '', description: '' }],
    });
  };

  const removeValue = (index: number) => {
    const newValues = formData.values?.filter((_, i) => i !== index);
    setFormData({ ...formData, values: newValues });
  };

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...(formData.milestones || []), { year: '', title: '', description: '' }],
    });
  };

  const removeMilestone = (index: number) => {
    const newMilestones = formData.milestones?.filter((_, i) => i !== index);
    setFormData({ ...formData, milestones: newMilestones });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...(formData.certifications || []), ''],
    });
  };

  const removeCertification = (index: number) => {
    const newCerts = formData.certifications?.filter((_, i) => i !== index);
    setFormData({ ...formData, certifications: newCerts });
  };

  const handleMdImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please select an image file', variant: 'destructive' });
      return;
    }
    try {
      setMdImageUploading(true);
      const res = await uploadAPI.image(file, 'about');
      setFormData({
        ...formData,
        mdMessage: {
          ...formData.mdMessage,
          name: formData.mdMessage?.name || '',
          position: formData.mdMessage?.position || '',
          message: formData.mdMessage?.message || '',
          image: res.data.url,
        },
      });
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to upload image', variant: 'destructive' });
    } finally {
      setMdImageUploading(false);
      mdImageInputRef.current && (mdImageInputRef.current.value = '');
    }
  };

  const clearMdImage = () => {
    setFormData({
      ...formData,
      mdMessage: {
        ...formData.mdMessage,
        name: formData.mdMessage?.name || '',
        position: formData.mdMessage?.position || '',
        message: formData.mdMessage?.message || '',
        image: undefined,
      },
    });
    mdImageInputRef.current && (mdImageInputRef.current.value = '');
  };

  if (loading) {
    return (
      <AdminLayout title="Manage About">
        <InlineLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manage About">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hero Title</label>
              <Input
                value={formData.heroTitle || ''}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                placeholder="Hero title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hero Description</label>
              <Textarea
                value={formData.heroDescription || ''}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                placeholder="Hero description"
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* About Content */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">About Content</h3>
          <Textarea
            value={formData.aboutContent || ''}
            onChange={(e) => setFormData({ ...formData, aboutContent: e.target.value })}
            placeholder="About content"
            rows={6}
          />
        </Card>

        {/* Message from MD */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Message from Managing Director</h3>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={formData.mdMessage?.name || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mdMessage: { ...formData.mdMessage, name: e.target.value },
                    })
                  }
                  placeholder="e.g., K. Samuel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <Input
                  value={formData.mdMessage?.position || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mdMessage: { ...formData.mdMessage, position: e.target.value },
                    })
                  }
                  placeholder="e.g., Managing Director"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea
                value={formData.mdMessage?.message || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mdMessage: { ...formData.mdMessage, message: e.target.value },
                  })
                }
                placeholder="Message from the MD"
                rows={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Profile Image</label>
              <div className="flex items-center gap-3">
                <input
                  ref={mdImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMdImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => mdImageInputRef.current?.click()}
                  disabled={mdImageUploading}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {mdImageUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                {formData.mdMessage?.image && (
                  <Button type="button" variant="ghost" size="sm" onClick={clearMdImage} className="text-muted-foreground">
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
                {formData.mdMessage?.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0">
                    <img src={formData.mdMessage.image} alt="MD" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Vision</h3>
            <Textarea
              value={formData.vision || ''}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              placeholder="Company vision"
              rows={5}
            />
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Mission</h3>
            <Textarea
              value={formData.mission || ''}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              placeholder="Company mission"
              rows={5}
            />
          </Card>
        </div>

        {/* Values */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Values</h3>
            <Button type="button" variant="outline" size="sm" onClick={addValue} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Value
            </Button>
          </div>
          <div className="space-y-4">
            {formData.values?.map((value, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Value {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeValue(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Icon name"
                  value={value.icon}
                  onChange={(e) => {
                    const newValues = [...(formData.values || [])];
                    newValues[index].icon = e.target.value;
                    setFormData({ ...formData, values: newValues });
                  }}
                />
                <Input
                  placeholder="Title"
                  value={value.title}
                  onChange={(e) => {
                    const newValues = [...(formData.values || [])];
                    newValues[index].title = e.target.value;
                    setFormData({ ...formData, values: newValues });
                  }}
                />
                <Textarea
                  placeholder="Description"
                  value={value.description}
                  onChange={(e) => {
                    const newValues = [...(formData.values || [])];
                    newValues[index].description = e.target.value;
                    setFormData({ ...formData, values: newValues });
                  }}
                  rows={2}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Team Stats */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Team Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Engineers</label>
              <Input
                type="number"
                value={formData.teamStats?.engineers || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teamStats: { ...formData.teamStats, engineers: Number(e.target.value) } as any,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Supervisors</label>
              <Input
                type="number"
                value={formData.teamStats?.supervisors || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teamStats: { ...formData.teamStats, supervisors: Number(e.target.value) } as any,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Technicians</label>
              <Input
                type="number"
                value={formData.teamStats?.technicians || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teamStats: { ...formData.teamStats, technicians: Number(e.target.value) } as any,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Years Experience</label>
              <Input
                type="number"
                value={formData.teamStats?.yearsExperience || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teamStats: { ...formData.teamStats, yearsExperience: Number(e.target.value) } as any,
                  })
                }
              />
            </div>
          </div>
        </Card>

        {/* Milestones */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Milestones</h3>
            <Button type="button" variant="outline" size="sm" onClick={addMilestone} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Milestone
            </Button>
          </div>
          <div className="space-y-4">
            {formData.milestones?.map((milestone, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Milestone {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMilestone(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="Year"
                    value={milestone.year}
                    onChange={(e) => {
                      const newMilestones = [...(formData.milestones || [])];
                      newMilestones[index].year = e.target.value;
                      setFormData({ ...formData, milestones: newMilestones });
                    }}
                  />
                  <Input
                    placeholder="Title"
                    value={milestone.title}
                    onChange={(e) => {
                      const newMilestones = [...(formData.milestones || [])];
                      newMilestones[index].title = e.target.value;
                      setFormData({ ...formData, milestones: newMilestones });
                    }}
                  />
                  <Input
                    placeholder="Description"
                    value={milestone.description}
                    onChange={(e) => {
                      const newMilestones = [...(formData.milestones || [])];
                      newMilestones[index].description = e.target.value;
                      setFormData({ ...formData, milestones: newMilestones });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Certifications */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Certifications</h3>
            <Button type="button" variant="outline" size="sm" onClick={addCertification} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Certification
            </Button>
          </div>
          <div className="space-y-3">
            {formData.certifications?.map((cert, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={cert}
                  onChange={(e) => {
                    const newCerts = [...(formData.certifications || [])];
                    newCerts[index] = e.target.value;
                    setFormData({ ...formData, certifications: newCerts });
                  }}
                  placeholder="Certification name"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCertification(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}

