"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Building } from "lucide-react";
import { useState } from "react";

// Função para aplicar máscara visual no CEP (00000-000)
const formatCep = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
};

const removeMask = (value: string) => value.replace(/\D/g, "");

interface AddressFormValues {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
}

export function AddressForm({ onSubmit }: { onSubmit: (values: AddressFormValues) => void }) {
  const [loadingCep, setLoadingCep] = useState(false);

  const formik = useFormik<AddressFormValues>({
    initialValues: {
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      postal_code: "",
    },
    validationSchema: Yup.object({
      street: Yup.string().required(),
      number: Yup.string().required(),
      neighborhood: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      postal_code: Yup.string()
        .length(9)
        .required(),
    }),
    onSubmit: (values) => {
      const valuesUnmasked = {
        ...values,
        postal_code: removeMask(values.postal_code),
      };
      onSubmit(valuesUnmasked);
    },
  });

  const handleCepBlur = async () => {
    const cep = removeMask(formik.values.postal_code);
    if (cep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          formik.setFieldValue("street", data.logradouro);
          formik.setFieldValue("neighborhood", data.bairro);
          formik.setFieldValue("city", data.localidade);
          formik.setFieldValue("state", data.uf);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP", error);
      }
      setLoadingCep(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    formik.setFieldValue("postal_code", formatted);
  };

  // Animações
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

  const shouldShowError = (field: keyof AddressFormValues) =>
    !!(formik.touched[field] && formik.errors[field]);
  

  return (
    <motion.form
      onSubmit={formik.handleSubmit}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Seção de Título e Descrição */}
      <motion.div variants={itemVariants} className="mb-3">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mr-3">
            <MapPin className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Endereço</h3>
            <p className="text-sm text-gray-500">Informe onde sua empresa está localizada</p>
          </div>
        </div>
      </motion.div>

      {/* Campo CEP */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm">
          <Input
            label="CEP"
            labelClassName="text-gray-700 font-medium mb-1.5 block"
            name="postal_code"
            value={formik.values.postal_code}
            onChange={handleCepChange}
            onBlur={handleCepBlur}
            disabled={loadingCep}
            placeholder="00000-000"
            className="w-full !bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-gray-700 shadow-sm"
            error={shouldShowError('postal_code') ? formik.errors.postal_code : undefined}
          />
          {shouldShowError('postal_code') && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1.5 text-sm text-red-500 flex items-center"
            >
              <span className="inline-block w-4 h-4 mr-1">⚠️</span>
              {formik.errors.postal_code}
            </motion.p>
          )}
          {loadingCep && (
            <p className="mt-2 text-sm text-gray-500">Buscando informações do CEP...</p>
          )}
        </div>
      </motion.div>

      {/* Informações do Endereço */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mr-3">
            <Building className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Informações do Endereço</h3>
            <p className="text-sm text-gray-500">Complete os dados da localização</p>
          </div>
        </div>
        
        <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Input
                label="Rua"
                labelClassName="text-gray-700 font-medium mb-1.5 block"
                name="street"
                value={formik.values.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ex: Av. Paulista"
                className="w-full !bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-gray-700 shadow-sm"
                error={shouldShowError('street') ? formik.errors.street : undefined}
              />
              {shouldShowError('street') && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-sm text-red-500 flex items-center"
                >
                  <span className="inline-block w-4 h-4 mr-1">⚠️</span>
                  {formik.errors.street}
                </motion.p>
              )}
            </div>

            <div>
              <Input
                label="Número"
                labelClassName="text-gray-700 font-medium mb-1.5 block"
                name="number"
                value={formik.values.number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ex: 1000"
                className="w-full !bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-gray-700 shadow-sm"
                error={shouldShowError('number') ? formik.errors.number : undefined}
              />
              {shouldShowError('number') && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-sm text-red-500 flex items-center"
                >
                  <span className="inline-block w-4 h-4 mr-1">⚠️</span>
                  {formik.errors.number}
                </motion.p>
              )}
            </div>
          </div>

          <div>
            <Input
              label="Bairro"
              labelClassName="text-gray-700 font-medium mb-1.5 block"
              name="neighborhood"
              value={formik.values.neighborhood}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Ex: Centro"
              className="w-full !bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-gray-700 shadow-sm"
              error={shouldShowError('neighborhood') ? formik.errors.neighborhood : undefined}
            />
            {shouldShowError('neighborhood') && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-sm text-red-500 flex items-center"
              >
                <span className="inline-block w-4 h-4 mr-1">⚠️</span>
                {formik.errors.neighborhood}
              </motion.p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Input
                label="Cidade"
                labelClassName="text-gray-700 font-medium mb-1.5 block"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ex: São Paulo"
                className="w-full !bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-gray-700 shadow-sm"
                error={shouldShowError('city') ? formik.errors.city : undefined}
              />
              {shouldShowError('city') && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-sm text-red-500 flex items-center"
                >
                  <span className="inline-block w-4 h-4 mr-1">⚠️</span>
                  {formik.errors.city}
                </motion.p>
              )}
            </div>

            <div>
              <Input
                label="Estado"
                labelClassName="text-gray-700 font-medium mb-1.5 block"
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ex: SP"
                className="w-full !bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-gray-700 shadow-sm"
                error={shouldShowError('state') ? formik.errors.state : undefined}
              />
              {shouldShowError('state') && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-sm text-red-500 flex items-center"
                >
                  <span className="inline-block w-4 h-4 mr-1">⚠️</span>
                  {formik.errors.state}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Botão de submissão */}
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
          Finalizar Cadastro
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
