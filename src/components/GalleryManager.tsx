import { useState, useEffect, useRef } from 'react';
import { Upload, X, Loader, Images } from 'lucide-react';
import { getGalleryImages, uploadGalleryImage, addGalleryImage, deleteGalleryImage, type GalleryImage } from '../lib/aboutService';

interface GalleryManagerProps {
  onMessage: (type: 'success' | 'error', text: string) => void;
}

export default function GalleryManager({ onMessage }: GalleryManagerProps) {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    const images = await getGalleryImages();
    setGalleryImages(images);
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    const imageUrl = await uploadGalleryImage(file);

    if (imageUrl) {
      const nextOrder = galleryImages.length > 0
        ? Math.max(...galleryImages.map(img => img.display_order)) + 1
        : 0;

      const success = await addGalleryImage(imageUrl, nextOrder);
      if (success) {
        onMessage('success', 'Gallery image uploaded successfully!');
        await loadGallery();
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        onMessage('error', 'Failed to add image to gallery');
      }
    } else {
      onMessage('error', 'Failed to upload image');
    }

    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const success = await deleteGalleryImage(id);
    if (success) {
      onMessage('success', 'Image deleted successfully!');
      await loadGallery();
    } else {
      onMessage('error', 'Failed to delete image');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 text-[#00A9FF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Images className="w-6 h-6 text-[#00A9FF]" />
        <h2 className="text-2xl font-bold text-white">Image Gallery</h2>
      </div>

      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="gallery-upload"
        />

        {preview && (
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full max-w-xs aspect-[3/4] object-cover rounded-lg"
            />
          </div>
        )}

        <div className="space-y-3">
          <label
            htmlFor="gallery-upload"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all cursor-pointer"
          >
            <Upload className="w-5 h-5" />
            Select Image
          </label>

          {preview && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full px-6 py-3 bg-[#00A9FF] text-white font-semibold rounded-lg hover:bg-[#0090DD] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Add to Gallery'}
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Max size: 5MB. Images will appear in a carousel on your About section.
        </p>
      </div>

      {galleryImages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Current Gallery ({galleryImages.length} images)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.image_url}
                  alt="Gallery"
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <button
                  onClick={() => handleDelete(image.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {galleryImages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Images className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No images in gallery yet. Upload some images to get started!</p>
        </div>
      )}
    </div>
  );
}
