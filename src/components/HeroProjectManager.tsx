import { useState, useEffect } from 'react';
import { Plus, X, Upload, ExternalLink, Eye, EyeOff, Trash2, GripVertical } from 'lucide-react';
import {
  getAllFeaturedProjects,
  createFeaturedProject,
  updateFeaturedProject,
  deleteFeaturedProject,
  uploadHeroImage,
  deleteHeroImage,
  type HeroFeaturedProject,
} from '../lib/heroProjectService';

export default function HeroProjectManager() {
  const [projects, setProjects] = useState<HeroFeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<HeroFeaturedProject | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mvp_url: '',
    display_order: 0,
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await getAllFeaturedProjects();
    setProjects(data);
    setLoading(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      mvp_url: '',
      display_order: 0,
      is_active: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editingProject?.image_url || null;

      if (imageFile) {
        const uploadedUrl = await uploadHeroImage(imageFile);
        if (uploadedUrl) {
          if (editingProject?.image_url) {
            await deleteHeroImage(editingProject.image_url);
          }
          imageUrl = uploadedUrl;
        }
      }

      const projectData = {
        ...formData,
        image_url: imageUrl,
      };

      if (editingProject) {
        await updateFeaturedProject(editingProject.id, projectData);
      } else {
        await createFeaturedProject(projectData);
      }

      await loadProjects();
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (project: HeroFeaturedProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      mvp_url: project.mvp_url || '',
      display_order: project.display_order,
      is_active: project.is_active,
    });
    setImagePreview(project.image_url);
    setShowForm(true);
  };

  const handleDelete = async (project: HeroFeaturedProject) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) return;

    if (project.image_url) {
      await deleteHeroImage(project.image_url);
    }
    await deleteFeaturedProject(project.id);
    await loadProjects();
  };

  const handleToggleActive = async (project: HeroFeaturedProject) => {
    await updateFeaturedProject(project.id, { is_active: !project.is_active });
    await loadProjects();
  };

  if (loading) {
    return (
      <div className="text-white text-center py-12">
        <p className="text-xl">Loading hero projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-bold text-white mb-2">Hero Featured Projects</h3>
          <p className="text-gray-400">Manage projects displayed in the hero carousel</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-[#FF7A59] text-white rounded-lg hover:bg-[#E66649] transition-colors"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] rounded-xl p-8 border border-[#FF7A59]/30 space-y-6">
          <h4 className="text-2xl font-bold text-white mb-4">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00A9FF] transition-colors"
                placeholder="e.g., OrderFlow Dashboard"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description/Tagline
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00A9FF] transition-colors"
                placeholder="Short description or tagline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                MVP/Project URL
              </label>
              <input
                type="url"
                value={formData.mvp_url}
                onChange={(e) => setFormData({ ...formData, mvp_url: e.target.value })}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00A9FF] transition-colors"
                placeholder="https://example.com"
              />
              <p className="text-xs text-gray-500 mt-1">Users can click the image to visit this URL</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Order <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00A9FF] transition-colors"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the carousel</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Image/Screenshot <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                {imagePreview && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden bg-black">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 px-6 py-4 bg-[#0A0A0A] border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-[#00A9FF] transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">
                    {imageFile ? imageFile.name : 'Choose an image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">
                  Recommended: High-resolution images (1920x1080 or larger) for full-screen display
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 text-[#00A9FF] focus:ring-[#00A9FF]"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-300">
                Active (show in carousel)
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={uploading || (!imageFile && !editingProject?.image_url)}
              className="flex-1 px-6 py-3 bg-[#00A9FF] text-white rounded-lg hover:bg-[#0090DD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {uploading ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-[#1A1A1A] rounded-xl border border-gray-800">
            <p className="text-gray-400 text-lg">No hero projects yet. Add your first project!</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#1A1A1A] rounded-xl p-6 border border-gray-800 hover:border-[#00A9FF]/50 transition-colors"
            >
              <div className="flex items-start gap-6">
                <div className="flex items-center text-gray-600">
                  <GripVertical className="w-6 h-6" />
                </div>

                {project.image_url && (
                  <div className="w-48 h-32 rounded-lg overflow-hidden bg-black flex-shrink-0">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{project.title}</h4>
                      {project.description && (
                        <p className="text-gray-400 text-sm mb-2">{project.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">Order: {project.display_order}</span>
                        {project.mvp_url && (
                          <a
                            href={project.mvp_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#00A9FF] hover:text-[#0090DD] transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Live
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(project)}
                        className={`p-2 rounded-lg transition-colors ${
                          project.is_active
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        }`}
                        title={project.is_active ? 'Active' : 'Inactive'}
                      >
                        {project.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleEdit(project)}
                        className="px-4 py-2 bg-[#00A9FF]/20 text-[#00A9FF] rounded-lg hover:bg-[#00A9FF]/30 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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
