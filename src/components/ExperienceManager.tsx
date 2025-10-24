import { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Edit2, X, Save, Clock } from 'lucide-react';
import {
  getExperienceTimeline,
  createExperience,
  updateExperience,
  deleteExperience,
  addMoment,
  updateMoment,
  deleteMoment,
  uploadExperienceImage,
  deleteExperienceImage,
  type ExperienceItem,
  type ExperienceMoment,
} from '../lib/experienceService';

interface ExperienceManagerProps {
  onMessage: (type: 'success' | 'error', text: string) => void;
}

export default function ExperienceManager({ onMessage }: ExperienceManagerProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExp, setEditingExp] = useState<string | null>(null);
  const [editingMoment, setEditingMoment] = useState<string | null>(null);
  const [showNewExp, setShowNewExp] = useState(false);
  const [showNewMoment, setShowNewMoment] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const [expForm, setExpForm] = useState({ year: '', title: '', intro: '' });
  const [momentForm, setMomentForm] = useState({
    heading: '',
    subtitle: '',
    bullets: '',
  });

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    const data = await getExperienceTimeline();
    setExperiences(data);
    setLoading(false);
  };

  const handleCreateExperience = async () => {
    if (!expForm.year || !expForm.title || !expForm.intro) {
      onMessage('error', 'Please fill all fields');
      return;
    }

    const id = await createExperience(expForm.year, expForm.title, expForm.intro);
    if (id) {
      onMessage('success', 'Experience created successfully');
      setExpForm({ year: '', title: '', intro: '' });
      setShowNewExp(false);
      loadExperiences();
    } else {
      onMessage('error', 'Failed to create experience');
    }
  };

  const handleUpdateExperience = async (id: string) => {
    const success = await updateExperience(id, expForm.year, expForm.title, expForm.intro);
    if (success) {
      onMessage('success', 'Experience updated successfully');
      setEditingExp(null);
      loadExperiences();
    } else {
      onMessage('error', 'Failed to update experience');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Delete this experience and all its moments and images?')) return;

    const success = await deleteExperience(id);
    if (success) {
      onMessage('success', 'Experience deleted successfully');
      loadExperiences();
    } else {
      onMessage('error', 'Failed to delete experience');
    }
  };

  const handleAddMoment = async (experienceId: string) => {
    if (!momentForm.heading) {
      onMessage('error', 'Please enter a heading');
      return;
    }

    const bullets = momentForm.bullets
      ? momentForm.bullets.split('\n').filter((b) => b.trim())
      : undefined;

    const success = await addMoment(
      experienceId,
      momentForm.heading,
      momentForm.subtitle || undefined,
      bullets
    );

    if (success) {
      onMessage('success', 'Moment added successfully');
      setMomentForm({ heading: '', subtitle: '', bullets: '' });
      setShowNewMoment(null);
      loadExperiences();
    } else {
      onMessage('error', 'Failed to add moment');
    }
  };

  const handleUpdateMoment = async (id: string) => {
    const bullets = momentForm.bullets
      ? momentForm.bullets.split('\n').filter((b) => b.trim())
      : undefined;

    const success = await updateMoment(
      id,
      momentForm.heading,
      momentForm.subtitle || undefined,
      bullets
    );

    if (success) {
      onMessage('success', 'Moment updated successfully');
      setEditingMoment(null);
      loadExperiences();
    } else {
      onMessage('error', 'Failed to update moment');
    }
  };

  const handleDeleteMoment = async (id: string) => {
    if (!confirm('Delete this moment?')) return;

    const success = await deleteMoment(id);
    if (success) {
      onMessage('success', 'Moment deleted successfully');
      loadExperiences();
    } else {
      onMessage('error', 'Failed to delete moment');
    }
  };

  const handleImageUpload = async (experienceId: string, file: File) => {
    setUploading(experienceId);
    const imageUrl = await uploadExperienceImage(experienceId, file);

    if (imageUrl) {
      onMessage('success', 'Image uploaded successfully');
      loadExperiences();
    } else {
      onMessage('error', 'Failed to upload image');
    }

    setUploading(null);
  };

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    if (!confirm('Delete this image?')) return;

    const success = await deleteExperienceImage(imageId, imageUrl);
    if (success) {
      onMessage('success', 'Image deleted successfully');
      loadExperiences();
    } else {
      onMessage('error', 'Failed to delete image');
    }
  };

  const startEditExp = (exp: ExperienceItem) => {
    setExpForm({ year: exp.year, title: exp.title, intro: exp.intro });
    setEditingExp(exp.id);
  };

  const startEditMoment = (moment: ExperienceMoment) => {
    setMomentForm({
      heading: moment.heading,
      subtitle: moment.subtitle || '',
      bullets: moment.bullets?.join('\n') || '',
    });
    setEditingMoment(moment.id);
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-[#00A9FF]" />
          <h2 className="text-2xl font-bold text-white">Experience Timeline</h2>
        </div>
        <button
          onClick={() => setShowNewExp(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00A9FF] text-white rounded-lg hover:bg-[#0090DD] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Experience
        </button>
      </div>

      {showNewExp && (
        <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">New Experience</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Year (e.g., 2015-2019)"
              value={expForm.year}
              onChange={(e) => setExpForm({ ...expForm, year: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Title"
              value={expForm.title}
              onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none"
            />
            <textarea
              placeholder="Introduction"
              value={expForm.intro}
              onChange={(e) => setExpForm({ ...expForm, intro: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateExperience}
                className="flex items-center gap-2 px-4 py-2 bg-[#00A9FF] text-white rounded-lg hover:bg-[#0090DD] transition-all"
              >
                <Save className="w-4 h-4" />
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewExp(false);
                  setExpForm({ year: '', title: '', intro: '' });
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {editingExp === exp.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={expForm.year}
                  onChange={(e) => setExpForm({ ...expForm, year: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none"
                />
                <input
                  type="text"
                  value={expForm.title}
                  onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none"
                />
                <textarea
                  value={expForm.intro}
                  onChange={(e) => setExpForm({ ...expForm, intro: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateExperience(exp.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00A9FF] text-white rounded-lg hover:bg-[#0090DD] transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingExp(null)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{exp.year}: {exp.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{exp.intro}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditExp(exp)}
                      className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-300">Moments</h4>
                    <button
                      onClick={() => setShowNewMoment(exp.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Moment
                    </button>
                  </div>

                  {showNewMoment === exp.id && (
                    <div className="mb-4 p-4 bg-gray-700 rounded-lg">
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Heading"
                          value={momentForm.heading}
                          onChange={(e) => setMomentForm({ ...momentForm, heading: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-[#00A9FF] focus:outline-none text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Subtitle (optional)"
                          value={momentForm.subtitle}
                          onChange={(e) => setMomentForm({ ...momentForm, subtitle: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-[#00A9FF] focus:outline-none text-sm"
                        />
                        <textarea
                          placeholder="Bullets (one per line, optional)"
                          value={momentForm.bullets}
                          onChange={(e) => setMomentForm({ ...momentForm, bullets: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-[#00A9FF] focus:outline-none text-sm resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddMoment(exp.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-[#00A9FF] text-white text-sm rounded-lg hover:bg-[#0090DD] transition-all"
                          >
                            <Save className="w-4 h-4" />
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowNewMoment(null);
                              setMomentForm({ heading: '', subtitle: '', bullets: '' });
                            }}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-500 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {exp.moments.map((moment) => (
                      <div key={moment.id} className="p-3 bg-gray-700 rounded-lg">
                        {editingMoment === moment.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={momentForm.heading}
                              onChange={(e) => setMomentForm({ ...momentForm, heading: e.target.value })}
                              className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-[#00A9FF] focus:outline-none text-sm"
                            />
                            <input
                              type="text"
                              value={momentForm.subtitle}
                              onChange={(e) => setMomentForm({ ...momentForm, subtitle: e.target.value })}
                              className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-[#00A9FF] focus:outline-none text-sm"
                            />
                            <textarea
                              value={momentForm.bullets}
                              onChange={(e) => setMomentForm({ ...momentForm, bullets: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-[#00A9FF] focus:outline-none text-sm resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateMoment(moment.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-[#00A9FF] text-white text-sm rounded-lg hover:bg-[#0090DD] transition-all"
                              >
                                <Save className="w-4 h-4" />
                                Save
                              </button>
                              <button
                                onClick={() => setEditingMoment(null)}
                                className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-500 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-white text-sm font-medium">{moment.heading}</p>
                              {moment.subtitle && (
                                <p className="text-gray-400 text-xs mt-1">{moment.subtitle}</p>
                              )}
                              {moment.bullets && moment.bullets.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                  {moment.bullets.map((bullet, idx) => (
                                    <li key={idx} className="text-gray-400 text-xs flex items-start">
                                      <span className="text-[#FF7A59] mr-2">•</span>
                                      <span>{bullet}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => startEditMoment(moment)}
                                className="p-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-all"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteMoment(moment.id)}
                                className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-300">Images</h4>
                    <label className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-all cursor-pointer">
                      <Upload className="w-4 h-4" />
                      {uploading === exp.id ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading === exp.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(exp.id, file);
                        }}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {exp.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.image_url}
                          alt="Experience"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleDeleteImage(image.id, image.image_url)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
