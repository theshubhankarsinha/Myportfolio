import { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Trash2, Edit2, Save, X, MessageSquare, User } from 'lucide-react';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  uploadTestimonialImage,
  type Testimonial,
} from '../lib/testimonialService';

interface TestimonialsManagerProps {
  onMessage: (type: 'success' | 'error', text: string) => void;
}

export default function TestimonialsManager({ onMessage }: TestimonialsManagerProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    quote: '',
    linkedin_url: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    const data = await getTestimonials();
    setTestimonials(data);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ name: '', title: '', quote: '', linkedin_url: '' });
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        onMessage('error', 'Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        onMessage('error', 'Image size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.title || !formData.quote) {
      onMessage('error', 'Please fill in name, title, and quote');
      return;
    }

    let profileImageUrl: string | null = null;

    if (selectedFile) {
      setUploading(true);
      profileImageUrl = await uploadTestimonialImage(selectedFile);
      setUploading(false);

      if (!profileImageUrl) {
        onMessage('error', 'Failed to upload image');
        return;
      }
    }

    const maxOrder = testimonials.length > 0
      ? Math.max(...testimonials.map(t => t.display_order))
      : -1;

    const newTestimonial = await createTestimonial({
      name: formData.name,
      title: formData.title,
      quote: formData.quote,
      linkedin_url: formData.linkedin_url || null,
      profile_image_url: profileImageUrl,
      display_order: maxOrder + 1,
    });

    if (newTestimonial) {
      onMessage('success', 'Testimonial created successfully');
      resetForm();
      setShowNewForm(false);
      loadTestimonials();
    } else {
      onMessage('error', 'Failed to create testimonial');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name || !formData.title || !formData.quote) {
      onMessage('error', 'Please fill in name, title, and quote');
      return;
    }

    let profileImageUrl: string | undefined = undefined;

    if (selectedFile) {
      setUploading(true);
      profileImageUrl = await uploadTestimonialImage(selectedFile);
      setUploading(false);

      if (!profileImageUrl) {
        onMessage('error', 'Failed to upload image');
        return;
      }
    }

    const updates: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>> = {
      name: formData.name,
      title: formData.title,
      quote: formData.quote,
      linkedin_url: formData.linkedin_url || null,
    };

    if (profileImageUrl) {
      updates.profile_image_url = profileImageUrl;
    }

    const updated = await updateTestimonial(id, updates);

    if (updated) {
      onMessage('success', 'Testimonial updated successfully');
      setEditingId(null);
      resetForm();
      loadTestimonials();
    } else {
      onMessage('error', 'Failed to update testimonial');
    }
  };

  const handleDelete = async (id: string, profileImageUrl?: string | null) => {
    if (!confirm('Delete this testimonial?')) return;

    const success = await deleteTestimonial(id, profileImageUrl || undefined);

    if (success) {
      onMessage('success', 'Testimonial deleted successfully');
      loadTestimonials();
    } else {
      onMessage('error', 'Failed to delete testimonial');
    }
  };

  const startEdit = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      title: testimonial.title,
      quote: testimonial.quote,
      linkedin_url: testimonial.linkedin_url || '',
    });
    setImagePreview(testimonial.profile_image_url);
    setEditingId(testimonial.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-[#00A9FF]" />
          <h2 className="text-2xl font-bold text-white">Testimonials</h2>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00A9FF] text-white rounded-lg hover:bg-[#0090DD] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      {showNewForm && (
        <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">New Testimonial</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#00A9FF]"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-500" />
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="new-testimonial-image"
                />
                <label
                  htmlFor="new-testimonial-image"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all cursor-pointer w-fit"
                >
                  <Upload className="w-4 h-4" />
                  Select Profile Image
                </label>
                <p className="text-xs text-gray-500 mt-2">Max 5MB, JPG/PNG</p>
              </div>
            </div>

            <input
              type="text"
              placeholder="Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none"
            />

            <input
              type="text"
              placeholder="Title/Role *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none"
            />

            <textarea
              placeholder="Testimonial Quote *"
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none resize-none"
            />

            <input
              type="url"
              placeholder="LinkedIn URL (optional)"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none"
            />

            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-[#00A9FF] text-white rounded-lg hover:bg-[#0090DD] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Create'}
              </button>
              <button
                onClick={() => {
                  setShowNewForm(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {editingId === testimonial.id ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#00A9FF]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                      <User className="w-10 h-10 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id={`edit-testimonial-image-${testimonial.id}`}
                    />
                    <label
                      htmlFor={`edit-testimonial-image-${testimonial.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all cursor-pointer w-fit"
                    >
                      <Upload className="w-4 h-4" />
                      Change Profile Image
                    </label>
                  </div>
                </div>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none"
                />

                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none"
                />

                <textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none resize-none"
                />

                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#00A9FF] focus:outline-none"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(testimonial.id)}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00A9FF] text-white rounded-lg hover:bg-[#0090DD] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                {testimonial.profile_image_url ? (
                  <img
                    src={testimonial.profile_image_url}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#00A9FF] flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-gray-500" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                      <p className="text-sm text-gray-400">{testimonial.title}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => startEdit(testimonial)}
                        className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id, testimonial.profile_image_url)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-3">"{testimonial.quote}"</p>
                  {testimonial.linkedin_url && (
                    <a
                      href={testimonial.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00A9FF] hover:underline text-sm flex items-center gap-1"
                    >
                      View on LinkedIn
                      <X className="w-3 h-3 rotate-45" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No testimonials yet. Add your first testimonial above.
          </div>
        )}
      </div>
    </div>
  );
}
