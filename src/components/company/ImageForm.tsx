"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "../Form/ImageUpload";
import { Image, ArrowRight, Check } from "lucide-react";

interface ImageFormProps {
  onSubmit: (storeImage: string, bannerImage: string) => void;
}


export function ImageForm({ onSubmit }: ImageFormProps) {
  const [localStoreImage, setLocalStoreImage] = useState<string>("");
  const [localBannerImage, setLocalBannerImage] = useState<string>("");
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
  const [hasValidationError, setHasValidationError] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!localStoreImage || !localBannerImage) {
      setHasValidationError(true);
      return;
    }

    onSubmit(localStoreImage, localBannerImage);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mr-3">
            <Image className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Identidade Visual</h3>
            <p className="text-sm text-gray-500">Adicione a logo e o banner da sua loja</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Logo */}
          <motion.div
            className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex justify-between items-start mb-4">
              <p className="font-medium text-gray-800">Logo da Loja</p>
              {localStoreImage && (
                <motion.button
                  type="button"
                  className="text-gray-400 hover:text-red-500"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowImagePreview(localStoreImage)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </motion.button>
              )}
            </div>

            <ImageUpload
              label="Selecionar logo"
              onUpload={(url) => {
                setLocalStoreImage(url);
                setHasValidationError(false);
              }}

              previewUrl={localStoreImage}
              className="w-full"
              type="logo"
              onPreview={() => setShowImagePreview(localStoreImage)}
            />

            <p className="text-xs text-gray-500 mt-2">
              Recomendamos uma imagem quadrada de pelo menos 200x200px
            </p>

            {hasValidationError && !localStoreImage && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-sm text-red-500 flex items-center"
              >
                <span className="inline-block w-4 h-4 mr-1">⚠️</span>
                Logo da loja é obrigatória
              </motion.p>
            )}
          </motion.div>

          {/* Banner */}
          <motion.div
            className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex justify-between items-start mb-4">
              <p className="font-medium text-gray-800">Banner</p>
              {localBannerImage && (
                <motion.button
                  type="button"
                  className="text-gray-400 hover:text-red-500"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowImagePreview(localBannerImage)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </motion.button>
              )}
            </div>

            <ImageUpload
              label="Selecionar banner"
              onUpload={(url) => {
                setLocalBannerImage(url);
                setHasValidationError(false);
              }}

              previewUrl={localBannerImage}
              className="w-full"
              type="banner"
              onPreview={() => setShowImagePreview(localBannerImage)}
            />

            <p className="text-xs text-gray-500 mt-2">
              Recomendamos uma imagem de 1200x400px para melhor visualização
            </p>

            {hasValidationError && !localBannerImage && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-sm text-red-500 flex items-center"
              >
                <span className="inline-block w-4 h-4 mr-1">⚠️</span>
                Banner da loja é obrigatório
              </motion.p>
            )}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="pt-4"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center"
        >
          Confirmar Imagens
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Check className="w-4 h-4 ml-2" />
          </motion.div>
        </Button>
      </motion.div>


      {showImagePreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => setShowImagePreview(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none" />

            <img
              src={showImagePreview}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain"
            />

            <motion.button
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2.5 backdrop-blur-sm"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.7)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowImagePreview(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.form>
  );
}
