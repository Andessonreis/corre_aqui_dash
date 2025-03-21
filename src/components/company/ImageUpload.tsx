"use client";

import { useState } from "react";

export interface ImageUploadProps {
  label: string;
  onUpload: (url: string) => void;
  previewUrl?: string; 
  onPreview?: () => void;
  className?: string;
}

export function ImageUpload({ label, onUpload, previewUrl, onPreview, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files?.[0]) return;
      
      const file = e.target.files[0];
      // Implemente o upload real aqui
      const fakeUrl = URL.createObjectURL(file);
      onUpload(fakeUrl);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {previewUrl && (
        <div className="mt-2">
          <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
        </div>
      )}
    </div>
  );
}
