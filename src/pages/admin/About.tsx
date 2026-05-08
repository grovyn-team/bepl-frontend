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
  safetyEvents?: Array<{
    title: string;
    date: string;
    location: string;
    topics: string[];
    participation: string;
    description: string;
    image: string;
  }>;
  staffMeetings?: Array<{
    icon: string;
    purpose: string;
    frequency: string;
    description: string;
    keyPoints: string[];
    participation: string;
  }>;
  trainingActivities?: Array<{
    icon: string;
    title: string;
    frequency: string;
    description: string;
  }>;
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

  const addSafetyEvent = () => {
    setFormData({
      ...formData,
      safetyEvents: [...(formData.safetyEvents || []), { title: '', date: '', location: '', topics: [], participation: '', description: '', image: '' }],
    });
  };

  const removeSafetyEvent = (index: number) => {
    const newEvents = formData.safetyEvents?.filter((_, i) => i !== index);
    setFormData({ ...formData, safetyEvents: newEvents });
  };

  const addStaffMeeting = () => {
    setFormData({
      ...formData,
      staffMeetings: [...(formData.staffMeetings || []), { icon: '', purpose: '', frequency: '', description: '', keyPoints: [], participation: '' }],
    });
  };

  const removeStaffMeeting = (index: number) => {
    const newMeetings = formData.staffMeetings?.filter((_, i) => i !== index);
    setFormData({ ...formData, staffMeetings: newMeetings });
  };

  const addTrainingActivity = () => {
    setFormData({
      ...formData,
      trainingActivities: [...(formData.trainingActivities || []), { icon: '', title: '', frequency: '', description: '' }],
    });
  };

  const removeTrainingActivity = (index: number) => {
    const newActivities = formData.trainingActivities?.filter((_, i) => i !== index);
    setFormData({ ...formData, trainingActivities: newActivities });
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

        {/* Safety Events */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Safety Events</h3>
            <Button type="button" variant="outline" size="sm" onClick={addSafetyEvent} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
          <div className="space-y-4">
            {formData.safetyEvents?.map((event, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Event {index + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSafetyEvent(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Title" value={event.title} onChange={(e) => {
                    const newEvents = [...(formData.safetyEvents || [])];
                    newEvents[index].title = e.target.value;
                    setFormData({ ...formData, safetyEvents: newEvents });
                  }} />
                  <Input placeholder="Date" value={event.date} onChange={(e) => {
                    const newEvents = [...(formData.safetyEvents || [])];
                    newEvents[index].date = e.target.value;
                    setFormData({ ...formData, safetyEvents: newEvents });
                  }} />
                  <Input placeholder="Location" value={event.location} onChange={(e) => {
                    const newEvents = [...(formData.safetyEvents || [])];
                    newEvents[index].location = e.target.value;
                    setFormData({ ...formData, safetyEvents: newEvents });
                  }} />
                  <Input placeholder="Participation (e.g. 300+ workers)" value={event.participation} onChange={(e) => {
                    const newEvents = [...(formData.safetyEvents || [])];
                    newEvents[index].participation = e.target.value;
                    setFormData({ ...formData, safetyEvents: newEvents });
                  }} />
                  <div className="flex gap-2">
                    <Input placeholder="Image URL" value={event.image} onChange={(e) => {
                      const newEvents = [...(formData.safetyEvents || [])];
                      newEvents[index].image = e.target.value;
                      setFormData({ ...formData, safetyEvents: newEvents });
                    }} />
                    <label className="cursor-pointer shrink-0">
                      <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          toast({ title: 'Uploading...', description: 'Please wait.' });
                          const res = await uploadAPI.image(file, 'about');
                          const newEvents = [...(formData.safetyEvents || [])];
                          newEvents[index].image = res.data.url;
                          setFormData({ ...formData, safetyEvents: newEvents });
                          toast({ title: 'Success', description: 'Image uploaded successfully' });
                        } catch (err: any) {
                          toast({ title: 'Error', description: err.message || 'Upload failed', variant: 'destructive' });
                        }
                      }} />
                      <span className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 whitespace-nowrap shadow">
                        <Upload className="h-4 w-4" />
                        Upload
                      </span>
                    </label>
                  </div>
                  <Input placeholder="Topics (comma separated)" value={event.topics?.join(', ')} onChange={(e) => {
                    const newEvents = [...(formData.safetyEvents || [])];
                    newEvents[index].topics = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setFormData({ ...formData, safetyEvents: newEvents });
                  }} />
                </div>
                <Textarea placeholder="Description" value={event.description} onChange={(e) => {
                  const newEvents = [...(formData.safetyEvents || [])];
                  newEvents[index].description = e.target.value;
                  setFormData({ ...formData, safetyEvents: newEvents });
                }} rows={2} />
              </div>
            ))}
          </div>
        </Card>

        {/* Staff Meetings */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Staff Meetings</h3>
            <Button type="button" variant="outline" size="sm" onClick={addStaffMeeting} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Meeting
            </Button>
          </div>
          <div className="space-y-4">
            {formData.staffMeetings?.map((meeting, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Meeting {index + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeStaffMeeting(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Purpose" value={meeting.purpose} onChange={(e) => {
                    const newMeetings = [...(formData.staffMeetings || [])];
                    newMeetings[index].purpose = e.target.value;
                    setFormData({ ...formData, staffMeetings: newMeetings });
                  }} />
                  <Input placeholder="Frequency (e.g. Weekly)" value={meeting.frequency} onChange={(e) => {
                    const newMeetings = [...(formData.staffMeetings || [])];
                    newMeetings[index].frequency = e.target.value;
                    setFormData({ ...formData, staffMeetings: newMeetings });
                  }} />
                  <Input placeholder="Icon Name (e.g. Target)" value={meeting.icon} onChange={(e) => {
                    const newMeetings = [...(formData.staffMeetings || [])];
                    newMeetings[index].icon = e.target.value;
                    setFormData({ ...formData, staffMeetings: newMeetings });
                  }} />
                  <Input placeholder="Participation" value={meeting.participation} onChange={(e) => {
                    const newMeetings = [...(formData.staffMeetings || [])];
                    newMeetings[index].participation = e.target.value;
                    setFormData({ ...formData, staffMeetings: newMeetings });
                  }} />
                </div>
                <Input placeholder="Key Points (comma separated)" value={meeting.keyPoints?.join(', ')} onChange={(e) => {
                  const newMeetings = [...(formData.staffMeetings || [])];
                  newMeetings[index].keyPoints = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  setFormData({ ...formData, staffMeetings: newMeetings });
                }} />
                <Textarea placeholder="Description" value={meeting.description} onChange={(e) => {
                  const newMeetings = [...(formData.staffMeetings || [])];
                  newMeetings[index].description = e.target.value;
                  setFormData({ ...formData, staffMeetings: newMeetings });
                }} rows={2} />
              </div>
            ))}
          </div>
        </Card>

        {/* Training Activities */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Training Activities</h3>
            <Button type="button" variant="outline" size="sm" onClick={addTrainingActivity} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Activity
            </Button>
          </div>
          <div className="space-y-4">
            {formData.trainingActivities?.map((activity, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Activity {index + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeTrainingActivity(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="Title" value={activity.title} onChange={(e) => {
                    const newActivities = [...(formData.trainingActivities || [])];
                    newActivities[index].title = e.target.value;
                    setFormData({ ...formData, trainingActivities: newActivities });
                  }} />
                  <Input placeholder="Frequency" value={activity.frequency} onChange={(e) => {
                    const newActivities = [...(formData.trainingActivities || [])];
                    newActivities[index].frequency = e.target.value;
                    setFormData({ ...formData, trainingActivities: newActivities });
                  }} />
                  <Input placeholder="Icon Name" value={activity.icon} onChange={(e) => {
                    const newActivities = [...(formData.trainingActivities || [])];
                    newActivities[index].icon = e.target.value;
                    setFormData({ ...formData, trainingActivities: newActivities });
                  }} />
                </div>
                <Textarea placeholder="Description" value={activity.description} onChange={(e) => {
                  const newActivities = [...(formData.trainingActivities || [])];
                  newActivities[index].description = e.target.value;
                  setFormData({ ...formData, trainingActivities: newActivities });
                }} rows={2} />
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

