"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Building } from "lucide-react";
import { useState } from "react";

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
      street: Yup.string().required("Rua obrigatória"),
      number: Yup.string().required("Número obrigatório"),
      neighborhood: Yup.string().required("Bairro obrigatório"),
      city: Yup.string().required("Cidade obrigatória"),
      state: Yup.string().required("Estado obrigatório"),
      postal_code: Yup.string().length(8, "CEP inválido").required("CEP obrigatório"),
    }),
    onSubmit,
  });

  const handleCepBlur = async () => {
    const cep = formik.values.postal_code;
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
      <motion.div
        variants={itemVariants}
        className="space-y-1"
      >
        <div className="flex items-center mb-2">
          <MapPin className="w-4 h-4 mr-2 text-red-500" />
          <h3 className="font-medium text-gray-700">Endereço de Localização</h3>
        </div>
        <Input
          label="CEP"
          {...formik.getFieldProps("postal_code")}
          onBlur={handleCepBlur}
          disabled={loadingCep}
          placeholder="00000-000"
          className="w-full !bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-xl px-4 py-3 text-gray-700"
          error={formik.touched.postal_code ? formik.errors.postal_code : undefined}
        />
        {formik.touched.postal_code && formik.errors.postal_code && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.postal_code}</p>
        )}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="space-y-1"
      >
        <div className="flex items-center mb-2">
          <Building className="w-4 h-4 mr-2 text-red-500" />
          <h3 className="font-medium text-gray-700">Informações do Endereço</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Rua"
              {...formik.getFieldProps("street")}
              placeholder="Ex: Av. Paulista"
              className="w-full !bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-xl px-4 py-3 text-gray-700"
              error={formik.touched.street ? formik.errors.street : undefined}
            />
            {formik.touched.street && formik.errors.street && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.street}</p>
            )}
          </div>

          <div>
            <Input
              label="Número"
              {...formik.getFieldProps("number")}
              placeholder="Ex: 1000"
              className="w-full !bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-xl px-4 py-3 text-gray-700"
              error={formik.touched.number ? formik.errors.number : undefined}
            />
            {formik.touched.number && formik.errors.number && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.number}</p>
            )}
          </div>
        </div>

        <Input
          label="Bairro"
          {...formik.getFieldProps("neighborhood")}
          placeholder="Ex: Centro"
          className="w-full !bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-xl px-4 py-3 text-gray-700 mt-4"
          error={formik.touched.neighborhood ? formik.errors.neighborhood : undefined}
        />
        {formik.touched.neighborhood && formik.errors.neighborhood && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.neighborhood}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <Input
              label="Cidade"
              {...formik.getFieldProps("city")}
              placeholder="Ex: São Paulo"
              className="w-full !bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-xl px-4 py-3 text-gray-700"
              error={formik.touched.city ? formik.errors.city : undefined}
            />
            {formik.touched.city && formik.errors.city && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.city}</p>
            )}
          </div>

          <div>
            <Input
              label="Estado"
              {...formik.getFieldProps("state")}
              placeholder="Ex: SP"
              className="w-full !bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-xl px-4 py-3 text-gray-700"
              error={formik.touched.state ? formik.errors.state : undefined}
            />
            {formik.touched.state && formik.errors.state && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.state}</p>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="pt-4"
      >
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center"
        >
          Finalizar Cadastro
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </motion.form>
  );
}