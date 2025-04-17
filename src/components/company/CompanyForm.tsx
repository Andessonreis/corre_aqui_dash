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
}

interface CompanyFormValues {
  cnpj: string;
  cpf: string;
  category_id: string;
  description: string;
}

const formatDocument = (value: string, type: 'cnpj' | 'cpf') => {
  const cleaned = value.replace(/\D/g, '');

  if (type === 'cnpj') {
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    if (cleaned.length <= 12) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
  } else {
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  }
};

const removeMask = (value: string) => {
  return value.replace(/\D/g, '');
};


export function CompanyForm({ onSubmit }: CompanyFormProps) {
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const formik = useFormik<CompanyFormValues>({
    initialValues: {
      cnpj: "",
      cpf: "",
      category_id: "",
      description: "",
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object({
      cnpj: Yup.string()
        .test('is-valid-cnpj', '', (value) => removeMask(value || '').length === 14)
        .required(""),
      cpf: Yup.string()
        .test('is-valid-cpf', '', (value) => removeMask(value || '').length === 11)
        .required(""),
      category_id: Yup.string().required(""),
      description: Yup.string().required("").min(20, ""),
    }),
    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        cnpj: removeMask(values.cnpj),
        cpf: removeMask(values.cpf),
      };
      onSubmit(formattedValues);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    formik.handleSubmit(e);
  };


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
              labelClassName="text-gray-700 font-medium mb-1.5 block"
              name="cnpj"
              value={formik.values.cnpj}
              onChange={(e) => {
                const formattedCNPJ = formatDocument(e.target.value, 'cnpj');
                formik.setFieldValue("cnpj", formattedCNPJ);
              }}
              onBlur={formik.handleBlur}
              placeholder="00.000.000/0000-00"
              className="w-full !bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-gray-700 shadow-sm"
            />
          </div>

          <div>
            <Input
              label="CPF do Responsável"
              labelClassName="text-gray-700 font-medium mb-1.5 block"
              name="cpf"
              value={formik.values.cpf}
              onChange={(e) => {
                const formattedCPF = formatDocument(e.target.value, 'cpf');
                formik.setFieldValue("cpf", formattedCPF);
              }}
              onBlur={formik.handleBlur}
              placeholder="000.000.000-00"
              className="w-full !bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-gray-700 shadow-sm"
            />
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

        <div className="mt-3">
        <Input
              label="Descrição"
              labelClassName="text-gray-700 font-medium mb-1.5 block"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Descreva sua empresa em poucas palavras..."
              className="w-full !bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-gray-700"
              textarea
              rows={3}
            />

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
          Próximo Passo
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.div>
        </Button>
      </motion.div>
    </motion.form>
  );
}
