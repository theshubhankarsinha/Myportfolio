import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, Upload, ExternalLink } from 'lucide-react';
import * as Icons from 'lucide-react';
import { getPortfolioPlaybooks, createPlaybook, updatePlaybook, deletePlaybook, type PortfolioPlaybook } from '../lib/portfolioService';
import { supabase } from '../lib/supabase';

export default function PortfolioManager() {
  const [playbooks, setPlaybooks] = useState<PortfolioPlaybook[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    teaser: '',
    icon_name: '',
    challenge: '',
    actions: [''],
    result: '',
    image_url: '',
    mvp_url: '',
    display_order: 0
  });

  useEffect(() => {
    loadPlaybooks();
  }, []);

  const loadPlaybooks = async () => {
    const data = await getPortfolioPlaybooks();
    setPlaybooks(data);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      title: '',
      teaser: '',
      icon_name: '',
      challenge: '',
      actions: [''],
      result: '',
      image_url: '',
      mvp_url: '',
      display_order: playbooks.length + 1
    });
  };

  const handleEdit = (playbook: PortfolioPlaybook) => {
    setEditingId(playbook.id);
    setFormData({
      title: playbook.title,
      teaser: playbook.teaser,
      icon_name: playbook.icon_name || '',
      challenge: playbook.challenge,
      actions: playbook.actions,
      result: playbook.result,
      image_url: playbook.image_url || '',
      mvp_url: playbook.mvp_url || '',
      display_order: playbook.display_order
    });
  };

  const handleSave = async () => {
    if (isCreating) {
      await createPlaybook(formData);
      setIsCreating(false);
    } else if (editingId) {
      await updatePlaybook(editingId, formData);
      setEditingId(null);
    }
    loadPlaybooks();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this playbook?')) {
      await deletePlaybook(id);
      loadPlaybooks();
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8" /> : null;
  };

  const updateAction = (index: number, value: string) => {
    const newActions = [...formData.actions];
    newActions[index] = value;
    setFormData({ ...formData, actions: newActions });
  };

  const addAction = () => {
    setFormData({ ...formData, actions: [...formData.actions, ''] });
  };

  const removeAction = (index: number) => {
    const newActions = formData.actions.filter((_, i) => i !== index);
    setFormData({ ...formData, actions: newActions });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveUploadedImage = async () => {
    if (!formData.image_url) return;

    if (formData.image_url.includes('portfolio-images')) {
      try {
        const urlParts = formData.image_url.split('portfolio-images/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1].split('?')[0];
          await supabase.storage
            .from('portfolio-images')
            .remove([filePath]);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    setFormData({ ...formData, image_url: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Portfolio Playbooks</h2>
          <p className="text-gray-400 mt-1">Manage your portfolio case studies and playbooks</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-[#00A9FF] text-white rounded-lg hover:bg-[#0090DD] transition-all hover:scale-105 shadow-lg hover:shadow-[#00A9FF]/30"
        >
          <Plus className="w-5 h-5" />
          Add New Playbook
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-[#1A1A1A] rounded-xl p-8 border-2 border-[#FF7A59] shadow-[0_0_30px_rgba(255,122,89,0.3)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">
              {isCreating ? '✨ Create New Playbook' : '✏️ Edit Playbook'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-[#2A2A2A] p-6 rounded-lg border border-gray-700">
              <h4 className="text-lg font-semibold text-[#00A9FF] mb-4">Card Display</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Playbook Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A9FF] border border-gray-600"
                    placeholder='e.g., The "$0-to-Acquisition" Playbook'
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Teaser (Card Description) *</label>
                  <textarea
                    value={formData.teaser}
                    onChange={(e) => setFormData({ ...formData, teaser: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A9FF] border border-gray-600"
                    rows={2}
                    placeholder="A brief teaser shown on the card"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Icon Name (Lucide Icon)</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.icon_name}
                      onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                      className="flex-1 px-4 py-3 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A9FF] border border-gray-600"
                      placeholder="e.g., Recycle, Factory, TrendingUp"
                    />
                    {formData.icon_name && (
                      <div className="w-14 h-14 bg-[#1A1A1A] border border-[#00A9FF] rounded-lg flex items-center justify-center text-[#00A9FF]">
                        {getIcon(formData.icon_name)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Browse icons at: <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-[#00A9FF] hover:underline">lucide.dev/icons</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#2A2A2A] p-6 rounded-lg border border-gray-700">
              <h4 className="text-lg font-semibold text-[#00A9FF] mb-4">Case Study Content</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">The Challenge *</label>
                  <textarea
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A9FF] border border-gray-600"
                    rows={3}
                    placeholder="Describe the problem or challenge you were solving..."
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">My "Conductor" Actions *</label>
                  <p className="text-sm text-gray-500 mb-3">List the key actions you took to solve this challenge</p>
                  {formData.actions.map((action, index) => (
                    <div key={index} className="flex gap-2 mb-3">
                      <div className="flex items-center justify-center w-8 h-10 text-[#FF7A59] font-bold">
                        {index + 1}.
                      </div>
                      <input
                        type="text"
                        value={action}
                        onChange={(e) => updateAction(index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A9FF] border border-gray-600"
                        placeholder="Describe an action you took..."
                      />
                      {formData.actions.length > 1 && (
                        <button
                          onClick={() => removeAction(index)}
                          className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addAction}
                    className="flex items-center gap-2 text-[#00A9FF] hover:text-[#0090DD] text-sm font-medium mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Action
                  </button>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">The Result *</label>
                  <textarea
                    value={formData.result}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A9FF] border border-gray-600"
                    rows={3}
                    placeholder="Describe the quantified outcome and impact..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Include specific metrics, timeframes, or achievements</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2A2A2A] p-6 rounded-lg border border-gray-700">
              <h4 className="text-lg font-semibold text-[#00A9FF] mb-4">Product Preview & Links</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Product/Project Image
                  </label>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <label
                        htmlFor="image-upload"
                        className={`flex items-center justify-center gap-2 px-6 py-3 bg-[#00A9FF] text-white rounded-lg cursor-pointer smooth-transition hover:bg-[#0090DD] hover:scale-105 shadow-lg ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Upload className="w-5 h-5" />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />

                      {formData.image_url && (
                        <button
                          onClick={handleRemoveUploadedImage}
                          className="px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 smooth-transition"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      Upload a product screenshot or preview image (max 5MB, JPG/PNG/GIF)
                    </div>

                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 border-t border-gray-600"></div>
                        <span className="text-xs text-gray-500">OR</span>
                        <div className="flex-1 border-t border-gray-600"></div>
                      </div>

                      <input
                        type="text"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A9FF] border border-gray-600"
                        placeholder="Paste an external image URL"
                      />
                    </div>

                    {formData.image_url && (
                      <div className="mt-3 relative group">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full max-w-md rounded-lg border-2 border-[#00A9FF]/30 shadow-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-gray-300 mb-2 font-medium">
                    Live Project URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.mvp_url}
                    onChange={(e) => setFormData({ ...formData, mvp_url: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A9FF] border border-gray-600"
                    placeholder="https://example.com/live-project"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add the URL to your live project or MVP. When provided, the product image becomes clickable.
                  </p>
                  {formData.mvp_url && formData.image_url && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-[#00A9FF]">
                      <ExternalLink className="w-4 h-4" />
                      <span>Users can click the product image to visit this URL</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-32 px-4 py-3 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A9FF] border border-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-[#00A9FF] text-white font-semibold rounded-lg hover:bg-[#0090DD] transition-all hover:scale-105 shadow-lg"
              >
                <Save className="w-5 h-5" />
                Save Playbook
              </button>
              <button
                onClick={handleCancel}
                className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {playbooks.length === 0 ? (
          <div className="bg-[#1A1A1A] rounded-xl p-12 border border-gray-800 text-center">
            <p className="text-gray-400 text-lg">No playbooks yet. Click "Add New Playbook" to get started!</p>
          </div>
        ) : (
          playbooks.map((playbook) => (
            <div key={playbook.id} className="bg-[#1A1A1A] rounded-xl border border-gray-800 overflow-hidden hover:border-[#00A9FF] transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 bg-gradient-to-br from-[#00A9FF]/20 to-[#FF7A59]/20 p-8 flex items-center justify-center border-r border-gray-800">
                  {playbook.icon_name ? (
                    <div className="text-[#00A9FF]">
                      {getIcon(playbook.icon_name) && (
                        <div style={{ transform: 'scale(2)' }}>
                          {getIcon(playbook.icon_name)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Eye className="w-16 h-16 text-gray-600" />
                  )}
                </div>

                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-[#00A9FF]/20 text-[#00A9FF] text-xs font-semibold rounded-full">
                          Order: {playbook.display_order}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{playbook.title}</h3>
                      <p className="text-gray-400 mb-3">{playbook.teaser}</p>
                      <div className="text-sm text-gray-500">
                        <p>{playbook.actions.length} actions • {playbook.image_url ? 'With image' : 'No image'}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(playbook)}
                        className="p-3 bg-[#00A9FF]/20 text-[#00A9FF] rounded-lg hover:bg-[#00A9FF]/30 transition-all hover:scale-110"
                        title="Edit playbook"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(playbook.id)}
                        className="p-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all hover:scale-110"
                        title="Delete playbook"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Challenge</p>
                        <p className="text-gray-300 line-clamp-2">{playbook.challenge}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Result</p>
                        <p className="text-gray-300 line-clamp-2">{playbook.result}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Icon</p>
                        <p className="text-gray-300">{playbook.icon_name || 'None'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">MVP URL</p>
                        <p className="text-gray-300 truncate">{playbook.mvp_url || 'None'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
