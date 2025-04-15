"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategorySelect } from "./CategorySelect";
import { ImageUpload } from "../Form/ImageUpload";
import { motion } from "framer-motion";
import { ArrowRight, Image, FileBadge, FileText } from "lucide-react";
import { useState } from "react";

interface CompanyFormProps {
  onSubmit: (values: CompanyFormValues) => void;
  onLogoUpload: (url: string) => void;
  onBannerUpload: (url: string) => void;
}

interface CompanyFormValues {
  cnpj: string;
  cpf: string;
  category_id: string;
  description: string;
  image_url: string;
  banner_url: string;
}

export function CompanyForm({ 
  onSubmit,
  onLogoUpload,
  onBannerUpload
}: CompanyFormProps) {
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);

  const formik = useFormik<CompanyFormValues>({
    initialValues: {
      cnpj: "",
      cpf: "",
      category_id: "",
      description: "",
      image_url: "",
      banner_url: "",
    },
    validationSchema: Yup.object({
      cnpj: Yup.string()
        .length(14, "CNPJ inválido")
        .required("CNPJ obrigatório")
        .matches(/^\d+$/, "CNPJ deve conter apenas números"),
      cpf: Yup.string()
        .length(11, "CPF inválido")
        .required("CPF obrigatório")
        .matches(/^\d+$/, "CPF deve conter apenas números"),
      category_id: Yup.string().required("Selecione uma categoria"),
      description: Yup.string()
        .required("Descrição obrigatória")
        .min(20, "A descrição deve ter pelo menos 20 caracteres"),
      image_url: Yup.string().required("Logo da loja é obrigatória"),
      banner_url: Yup.string().required("Banner da loja é obrigatório"),
    }),
    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        cnpj: values.cnpj.replace(/\D/g, ""),
        cpf: values.cpf.replace(/\D/g, ""),
      };
      onSubmit(formattedValues);
    },
  });

  // Animation variants
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

  return (
    <motion.form
      onSubmit={formik.handleSubmit}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="space-y-1">
        <div className="flex items-center mb-2">
          <FileBadge className="w-4 h-4 mr-2 text-red-500" />
          <h3 className="font-medium text-gray-700">Documentação</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="CNPJ"
              labelClassName="text-gray-800 font-medium"
              {...formik.getFieldProps("cnpj")}
              placeholder="00.000.000/0000-00"
              className="w-full !bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-xl px-4 py-3 text-gray-700"
              error={formik.touched.cnpj ? formik.errors.cnpj : undefined}
            />
            {formik.touched.cnpj && formik.errors.cnpj && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.cnpj}</p>
            )}
          </div>

          <div>
            <Input
              label="CPF do Responsável"
              {...formik.getFieldProps("cpf")}
              placeholder="000.000.000-00"
              className="w-full !bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-xl px-4 py-3 text-gray-700"
              error={formik.touched.cpf ? formik.errors.cpf : undefined}
            />
            {formik.touched.cpf && formik.errors.cpf && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.cpf}</p>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-1">
        <div className="flex items-center mb-2">
          <FileText className="w-4 h-4 mr-2 text-red-500" />
          <h3 className="font-medium text-gray-700">Sobre seu Negócio</h3>
        </div>
        <CategorySelect
          value={formik.values.category_id}
          onChange={(value: string) => formik.setFieldValue("category_id", value)}
          className="w-full !bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-xl px-4 py-3 text-gray-700"
          error={formik.touched.category_id ? formik.errors.category_id : undefined}
        />
        {formik.touched.category_id && formik.errors.category_id && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.category_id}</p>
        )}

        <div className="mt-3">
          <Input
            label="Descrição"
            {...formik.getFieldProps("description")}
            placeholder="Descreva sua empresa em poucas palavras..."
            className="w-full !bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-xl px-4 py-3 text-gray-700"
            error={formik.touched.description ? formik.errors.description : undefined}
            textarea
            rows={3}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-xl border border-gray-200 overflow-hidden mt-6">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Image className="w-4 h-4 mr-2 text-red-500" />
            <h3 className="font-medium text-gray-700">Identidade Visual</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">Adicione a logo e o banner da sua loja</p>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Logo da Loja</p>
            <ImageUpload
              label="Selecionar logo"
              onUpload={(url) => {
                formik.setFieldValue("image_url", url);
                onLogoUpload(url);
              }}
              previewUrl={formik.values.image_url}
              className="w-full"
              type="logo"
              onPreview={() => setShowImagePreview(formik.values.image_url)}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Banner</p>
            <ImageUpload
              label="Selecionar banner"
              onUpload={(url) => {
                formik.setFieldValue("banner_url", url);
                onBannerUpload(url);
              }}
              previewUrl={formik.values.banner_url}
              className="w-full"
              type="banner"
              onPreview={() => setShowImagePreview(formik.values.banner_url)}
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="pt-4">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center"
        >
          Próximo Passo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>

      {/* Image preview modal */}
      {showImagePreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
          onClick={() => setShowImagePreview(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative max-w-2xl max-h-[80vh] rounded-xl overflow-hidden bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={showImagePreview}
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />

            <button
              className="absolute top-2 right-2 bg-gray-900/60 text-white rounded-full p-2"
              onClick={() => setShowImagePreview(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.form>
  );
}