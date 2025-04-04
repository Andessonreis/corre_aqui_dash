"use client";

import { useState, useCallback } from "react";

export interface ImageUploadProps {
  label: string;
  onUpload: (url: string) => void;
  previewUrl?: string;
  onPreview?: () => void;
  className?: string;
}

export function ImageUpload({
  label,
  onUpload,
  previewUrl,
  onPreview,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        if (!e.target.files?.[0]) return;
        
        setUploading(true);
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        onUpload(url);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      {previewUrl ? (
        <div className="w-full h-full">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
            onClick={onPreview}
          />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-gray-500 hover:text-gray-700 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm font-medium">{label}</span>
        </div>
      )}
    </div>
  );
}