"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/client";

export default function Signup() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validationSchema = Yup.object({
    companyName: Yup.string().required("O nome da empresa é obrigatório"),
    email: Yup.string().email("Email inválido").required("O email é obrigatório"),
    phone: Yup.string()
      .matches(/^\d{10,11}$/, "Número de telefone inválido")
      .required("O telefone é obrigatório"),
    password: Yup.string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .required("A senha é obrigatória"),
  });

  const formik = useFormik({
    initialValues: { companyName: "", email: "", phone: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: { companyName: values.companyName, phone: values.phone },
          },
        });

        if (supabaseError) throw new Error(supabaseError.message);

        router.push("/complete-profile");
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    },
  });

  const handleGoogleSignup = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:5173",
        },
      });
  
      if (error) throw new Error(error.message);
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (user) {
        router.push("/complete-profile");
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-red-600">Crie sua conta empresarial</h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Já tem uma conta?{" "}
          <a href="/login" className="text-red-600 hover:underline">
            Faça login
          </a>
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Nome da Empresa
            </label>
            <input
              id="companyName"
              type="text"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 text-gray-700 ${
                formik.touched.companyName && formik.errors.companyName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Digite o nome da sua empresa"
              {...formik.getFieldProps("companyName")}
            />
            {formik.touched.companyName && formik.errors.companyName && (
              <p className="text-red-500 text-sm">{formik.errors.companyName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 text-gray-700 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Digite seu e-mail"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              id="phone"
              type="tel"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 text-gray-700 ${
                formik.touched.phone && formik.errors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Ex: 11987654321"
              {...formik.getFieldProps("phone")}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm">{formik.errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 text-gray-700 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Digite sua senha"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-red-600 text-white py-2 rounded-md transition hover:bg-red-700 disabled:opacity-50"
          >
            {formik.isSubmitting ? "Criando conta..." : "Registrar"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="h-px w-16 bg-gray-300"></span>
          <span className="text-sm text-gray-600">ou registre-se com</span>
          <span className="h-px w-16 bg-gray-300"></span>
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={handleGoogleSignup}
            className="p-2 rounded-full shadow bg-gray-100 hover:bg-gray-200 transition"
          >
            <FcGoogle size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}
