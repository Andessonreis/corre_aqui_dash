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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-red-600">Crie sua conta</h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Já tem uma conta? <a href="/signin" className="text-red-600 hover:underline">Faça login</a>
        </p>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {[
            { field: "name", label: "Nome da Empresa", type: "text", placeholder: "Digite o nome da empresa" },
            { field: "email", label: "Email", type: "email", placeholder: "Digite seu e-mail" },
            { field: "phone", label: "Telefone", type: "tel", placeholder: "Ex: 11987654321" },
            { field: "password", label: "Senha", type: "password", placeholder: "Digite sua senha" },
          ].map(({ field, label, type, placeholder }) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                id={field}
                type={type}
                placeholder={placeholder}
                {...formik.getFieldProps(field)}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 text-gray-700 ${
                  formik.touched[field as keyof typeof formik.touched] && formik.errors[field as keyof typeof formik.errors]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {formik.touched[field as keyof typeof formik.touched] && formik.errors[field as keyof typeof formik.errors] && (
                <p className="text-red-500 text-sm">{formik.errors[field as keyof typeof formik.errors]}</p>
              )}
            </div>
          ))}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button type="submit" disabled={formik.isSubmitting} className="w-full bg-red-600 text-white py-2 rounded-md transition hover:bg-red-700 disabled:opacity-50">
            {formik.isSubmitting ? "Criando conta..." : "Registrar"}
          </button>
        </form>
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="h-px w-16 bg-gray-300"></span>
          <span className="text-sm text-gray-600">ou registre-se com</span>
          <span className="h-px w-16 bg-gray-300"></span>
        </div>
        <div className="mt-4 flex justify-center gap-4">
          <button onClick={handleGoogleSignup} className="p-2 rounded-full shadow bg-gray-100 hover:bg-gray-200 transition">
            <FcGoogle size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}
