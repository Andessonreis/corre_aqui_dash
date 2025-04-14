"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/client";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Email inválido").required("O email é obrigatório"),
      password: Yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required("A senha é obrigatória"),
    }),
    onSubmit: async ({ email, password }) => {
      setError(null);
      
      // 1. Login otimizado com obtenção direta do usuário
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (signInError) return setError(signInError.message);
      if (!user) return setError("Autenticação falhou");

      // 2. Consulta combinada usando JOIN para verificar owner e store
      const { data: ownerData, error: queryError } = await supabase
        .from("owners")
        .select(`
          id,
          stores!inner(id)
        `)
        .eq("user_id", user.id)
        .maybeSingle();

      // 3. Controle de erros unificado
      if (queryError) return setError(queryError.message);

      // 4. Redirecionamento inteligente baseado na presença de dados
      router.push(ownerData?.stores ? "/dashboard" : "/profile-setup");
    },
  });

  const handleGoogleSignin = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: "https://dashboard-correaqui.vercel.app" },
      });
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("Erro ao tentar fazer login com o Google.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 md:px-8 lg:px-10 py-10">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 animate-fade-in-scale border border-gray-100">
          <div className="mb-8 text-center">
            <div className="inline-block mb-4 animate-float">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-primary to-primary-hover flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Olá de novo!</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-2">Acesse sua conta para continuar</p>
          </div>
  
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {(["email", "password"] as const).map((field) => (
              <div key={field} className="relative">
                <input
                  id={field}
                  type={field === "password" ? "password" : "email"}
                  placeholder={field === "password" ? "••••••••" : "nome@exemplo.com"}
                  {...formik.getFieldProps(field)}
                  className={`w-full text-gray-800 bg-gray-50 border-0 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:ring-2 focus:outline-none transition placeholder-gray-400 ${
                    formik.touched[field] && formik.errors[field]
                      ? "focus:ring-red-300 ring-1 ring-red-300"
                      : "focus:ring-primary focus:bg-white"
                  }`}
                />
                <label 
                  htmlFor={field} 
                  className="absolute left-4 sm:left-5 -top-2.5 bg-gray-50 px-1 sm:px-2 text-xs font-semibold text-gray-500 rounded-md"
                >
                  {field === "email" ? "EMAIL" : "SENHA"}
                </label>
                {formik.touched[field] && formik.errors[field] && (
                  <p className="text-xs text-red-500 mt-1.5 ml-2">{formik.errors[field]}</p>
                )}
              </div>
            ))}
  
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center space-x-2 text-gray-600 select-none cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded peer-checked:bg-primary peer-checked:border-primary transition" />
                  <svg 
                    className="absolute top-0 left-0 w-3.5 h-3.5 sm:w-4 sm:h-4 text-white opacity-0 peer-checked:opacity-100" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Lembre de mim</span>
              </label>
              <a href="#" className="text-primary font-medium transition hover:text-primary-hover">
                Esqueceu a senha?
              </a>
            </div>
  
            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg text-red-600 text-sm">
                {error}
              </div>
            )}
  
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="relative w-full py-3 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-stone-700 to-stone-600 text-white font-semibold flex items-center justify-center gap-2 transition duration-300 hover:shadow-md disabled:cursor-not-allowed"
              style={{
                opacity: formik.isSubmitting ? 0.9 : 1,
                fontFamily: '"IBM Plex Serif", serif',
                letterSpacing: '0.5px',
                boxShadow: formik.isSubmitting ? 'inset 0 0 5px rgba(0,0,0,0.2)' : '',
              }}
            >
              {formik.isSubmitting && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
              <span className="tracking-wide">Entrar</span>
            </button>
          </form>
        </div>
  
        <div className="relative my-6 sm:my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 sm:px-4 bg-gradient-to-b from-white to-gray-50 text-xs sm:text-sm text-gray-500">
              ou continue com
            </span>
          </div>
        </div>
  
        <button
          onClick={handleGoogleSignin}
          className="w-full flex items-center justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow transition-all"
          aria-label="Login com Google"
        >
          <FcGoogle size={20} className="sm:size-[22px]" />
          <span className="text-sm sm:text-base text-gray-700 font-medium">Google</span>
        </button>
  
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-sm sm:text-base text-gray-600">
            Ainda não tem uma conta?{" "}
            <a href="/signup" className="text-primary font-semibold hover:underline transition">
              Cadastre-se agora
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}  