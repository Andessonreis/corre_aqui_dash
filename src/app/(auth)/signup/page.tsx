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

  const formik = useFormik({
    initialValues: { name: "", email: "", phone: "", password: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("O nome da empresa é obrigatório"),
      email: Yup.string().email("Email inválido").required("O email é obrigatório"),
      phone: Yup.string().matches(/\d{10,11}/, "Número de telefone inválido").required("O telefone é obrigatório"),
      password: Yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required("A senha é obrigatória"),
    }),
    onSubmit: async (values) => {
      setError(null);
      try {
        const { data: { user }, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              name: values.name,
              phone: values.phone,
              role: "company",
            },
          },
        });

        if (authError) throw new Error(authError.message);
        if (!user) throw new Error("Erro ao criar usuário.");

        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              role: "company",
              name: values.name,
              phone: values.phone,
              email: values.email,
              profile_image_url: "https://example.com/default-avatar.png",
            },
          ]);

        if (profileError) throw new Error(`Falha na criação do perfil: ${profileError.message}`);

        router.push("/profile-setup");
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
        options: { redirectTo: "https://dashboard-correaqui.vercel.app" },
      });

      if (error) throw new Error(error.message);

      supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          router.push("/profile-setup");
        }
      });
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 md:px-8 lg:px-10 py-10">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="bg-white rounded-3xl shadow-lg p-8 animate-fade-in-scale border border-gray-100">
          <div className="mb-8 text-center">
            <div className="inline-block mb-4 animate-float">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-primary-hover flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Crie sua conta</h1>
            <p className="text-gray-500 mt-2">
              Já tem uma conta?{" "}
              <a href="/signin" className="text-primary font-semibold hover:underline transition">
                Faça login
              </a>
            </p>
          </div>
  
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Nome */}
            <div className="relative">
              <input
                id="name"
                type="text"
                placeholder="Digite o nome da empresa"
                {...formik.getFieldProps("name")}
                className={`w-full text-gray-800 bg-gray-50 border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:outline-none transition placeholder-gray-400 ${
                  formik.touched.name && formik.errors.name
                    ? "focus:ring-red-300 ring-1 ring-red-300"
                    : "focus:ring-primary focus:bg-white"
                }`}
              />
              <label htmlFor="name" className="absolute left-5 -top-2.5 bg-gray-50 px-2 text-xs font-semibold text-gray-500 rounded-md">
                NOME DA EMPRESA
              </label>
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs text-red-500 mt-1.5 ml-2">{formik.errors.name}</p>
              )}
            </div>
  
            {/* Email */}
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                {...formik.getFieldProps("email")}
                className={`w-full text-gray-800 bg-gray-50 border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:outline-none transition placeholder-gray-400 ${
                  formik.touched.email && formik.errors.email
                    ? "focus:ring-red-300 ring-1 ring-red-300"
                    : "focus:ring-primary focus:bg-white"
                }`}
              />
              <label htmlFor="email" className="absolute left-5 -top-2.5 bg-gray-50 px-2 text-xs font-semibold text-gray-500 rounded-md">
                EMAIL
              </label>
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500 mt-1.5 ml-2">{formik.errors.email}</p>
              )}
            </div>
  
            {/* Telefone */}
            <div className="relative">
              <input
                id="phone"
                type="tel"
                placeholder="11987654321"
                {...formik.getFieldProps("phone")}
                className={`w-full text-gray-800 bg-gray-50 border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:outline-none transition placeholder-gray-400 ${
                  formik.touched.phone && formik.errors.phone
                    ? "focus:ring-red-300 ring-1 ring-red-300"
                    : "focus:ring-primary focus:bg-white"
                }`}
              />
              <label htmlFor="phone" className="absolute left-5 -top-2.5 bg-gray-50 px-2 text-xs font-semibold text-gray-500 rounded-md">
                TELEFONE
              </label>
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-xs text-red-500 mt-1.5 ml-2">{formik.errors.phone}</p>
              )}
            </div>
  
            {/* Senha */}
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...formik.getFieldProps("password")}
                className={`w-full text-gray-800 bg-gray-50 border-0 rounded-2xl px-5 py-4 focus:ring-2 focus:outline-none transition placeholder-gray-400 ${
                  formik.touched.password && formik.errors.password
                    ? "focus:ring-red-300 ring-1 ring-red-300"
                    : "focus:ring-primary focus:bg-white"
                }`}
              />
              <label htmlFor="password" className="absolute left-5 -top-2.5 bg-gray-50 px-2 text-xs font-semibold text-gray-500 rounded-md">
                SENHA
              </label>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-500 mt-1.5 ml-2">{formik.errors.password}</p>
              )}
            </div>
  
            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg text-red-600 text-sm">
                {error}
              </div>
            )}
  
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="relative w-full py-4 px-6 rounded-xl bg-gradient-to-r from-stone-700 to-stone-600 text-white font-semibold flex items-center justify-center gap-2 transition duration-300 hover:shadow-md disabled:cursor-not-allowed"
              style={{
                opacity: formik.isSubmitting ? 0.9 : 1,
                fontFamily: '"IBM Plex Serif", serif',
                letterSpacing: '0.5px',
                boxShadow: formik.isSubmitting ? 'inset 0 0 5px rgba(0,0,0,0.2)' : '',
              }}
            >
              {formik.isSubmitting && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                    5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 
                    5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              <span className="tracking-wide">Registrar</span>
            </button>
          </form>
  
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-b from-white to-gray-50 text-sm text-gray-500">
                ou registre-se com
              </span>
            </div>
          </div>
  
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center space-x-3 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow transition-all"
            aria-label="Cadastro com Google"
          >
            <FcGoogle size={22} />
            <span className="text-gray-700 font-medium">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}  
