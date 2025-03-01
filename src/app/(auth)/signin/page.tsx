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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      error ? setError(error.message) : router.push("/dashboard");
    },
  });

  const handleGoogleSignin = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: {redirectTo: "https://dashboard-correaqui.vercel.app/signin"} });
    error ? setError(error.message) : router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-red-600">Acesse sua conta</h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Ainda não tem uma conta? <a href="/signup" className="text-red-600 hover:underline">Cadastre-se</a>
        </p>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {(["email", "password"] as const).map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                {field === "email" ? "Email" : "Senha"}
              </label>
              <input
                id={field}
                type={field === "password" ? "password" : "email"}
                placeholder={`Digite seu ${field === "password" ? "senha" : "email"}`}
                {...formik.getFieldProps(field)}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 text-gray-700 ${
                  formik.touched[field] && formik.errors[field] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {formik.touched[field] && formik.errors[field] && (
                <p className="text-red-500 text-sm">{formik.errors[field]}</p>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2" /> Lembre de mim
            </label>
            <a href="#" className="text-sm text-red-600 hover:underline">Esqueceu sua senha?</a>
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button type="submit" disabled={formik.isSubmitting} className="w-full bg-[var(--primary)] text-white py-2 rounded-md transition hover:bg-[var(--primary-hover)] disabled:opacity-50">
            {formik.isSubmitting ? "Entrando..." : "Login"}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="h-px w-16 bg-gray-300"></span>
          <span className="text-sm text-gray-600">ou continue com</span>
          <span className="h-px w-16 bg-gray-300"></span>
        </div>
        <div className="mt-4 flex justify-center">
          <button onClick={handleGoogleSignin} className="p-2 rounded-full shadow bg-gray-100 hover:bg-gray-200 transition">
            <FcGoogle size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}
