import { useState, useEffect, useRef } from 'react';
import { Upload, LogOut, Image, FileText, CheckCircle, AlertCircle, Loader, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAboutSection, uploadProfilePhoto, uploadResume, updateAboutSection, type AboutSection } from '../lib/aboutService';
import GalleryManager from './GalleryManager';
import ExperienceManager from './ExperienceManager';
import PortfolioManager from './PortfolioManager';
import TestimonialsManager from './TestimonialsManager';
import HeroProjectManager from './HeroProjectManager';

interface AdminDashboardProps {
  onBack?: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { signOut } = useAuth();
  const [aboutData, setAboutData] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<'photo' | 'resume' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getAboutSection();
    setAboutData(data);
    setLoading(false);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showMessage('error', 'Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showMessage('error', 'Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    const file = photoInputRef.current?.files?.[0];
    if (!file) return;

    setUploading('photo');
    const photoUrl = await uploadProfilePhoto(file);

    if (photoUrl) {
      const success = await updateAboutSection(photoUrl, undefined);
      if (success) {
        showMessage('success', 'Profile photo uploaded successfully!');
        await loadData();
        setPhotoPreview(null);
        if (photoInputRef.current) photoInputRef.current.value = '';
      } else {
        showMessage('error', 'Failed to update profile photo');
      }
    } else {
      showMessage('error', 'Failed to upload photo');
    }

    setUploading(null);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showMessage('error', 'Please select a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showMessage('error', 'Resume size must be less than 10MB');
      return;
    }

    setUploading('resume');
    const resumeUrl = await uploadResume(file);

    if (resumeUrl) {
      const success = await updateAboutSection(undefined, resumeUrl);
      if (success) {
        showMessage('success', 'Resume uploaded successfully!');
        await loadData();
        if (resumeInputRef.current) resumeInputRef.current.value = '';
      } else {
        showMessage('error', 'Failed to update resume');
      }
    } else {
      showMessage('error', 'Failed to upload resume');
    }

    setUploading(null);
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <Loader className="w-8 h-8 text-[#00A9FF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
                title="Back to portfolio"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500 text-green-500'
                : 'bg-red-500/10 border border-red-500 text-red-500'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <Image className="w-6 h-6 text-[#00A9FF]" />
              <h2 className="text-2xl font-bold text-white">Profile Photo</h2>
            </div>

            {aboutData?.photo_url && !photoPreview && (
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Current Photo:</p>
                <img
                  src={aboutData.photo_url}
                  alt="Current profile"
                  className="w-full aspect-[3/4] object-cover rounded-lg"
                />
              </div>
            )}

            {photoPreview && (
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Preview:</p>
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full aspect-[3/4] object-cover rounded-lg"
                />
              </div>
            )}

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
              id="photo-upload"
            />

            <div className="space-y-3">
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                Select Photo
              </label>

              {photoPreview && (
                <button
                  onClick={handlePhotoUpload}
                  disabled={uploading === 'photo'}
                  className="w-full px-6 py-3 bg-[#00A9FF] text-white font-semibold rounded-lg hover:bg-[#0090DD] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading === 'photo' ? 'Uploading...' : 'Upload Photo'}
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Max size: 5MB. Supported: JPG, PNG, WebP
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-[#FF7A59]" />
              <h2 className="text-2xl font-bold text-white">Resume</h2>
            </div>

            {aboutData?.resume_url && (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Current Resume:</p>
                <a
                  href={aboutData.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00A9FF] hover:underline text-sm"
                >
                  View Current Resume
                </a>
              </div>
            )}

            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="hidden"
              id="resume-upload"
            />

            <label
              htmlFor="resume-upload"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              {uploading === 'resume' ? 'Uploading...' : 'Upload Resume (PDF)'}
            </label>

            <p className="text-xs text-gray-500 mt-4">
              Max size: 10MB. PDF format only
            </p>
          </div>
        </div>

        <div className="mt-8">
          <HeroProjectManager />
        </div>

        <div className="mt-8">
          <GalleryManager onMessage={showMessage} />
        </div>

        <div className="mt-8">
          <ExperienceManager onMessage={showMessage} />
        </div>

        <div className="mt-8">
          <PortfolioManager />
        </div>

        <div className="mt-8">
          <TestimonialsManager onMessage={showMessage} />
        </div>
      </div>
    </div>
  );
}
