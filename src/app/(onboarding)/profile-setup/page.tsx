"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { supabase } from "@/lib/client";
import { v4 as uuidv4 } from "uuid";

// Dados iniciais e esquema de validação
const initialValues = {
  name: "", phone: "", email: "", cnpj: "", cpf: "", description: "",
  street: "", number: "", neighborhood: "", city: "", state: "", zipCode: ""
};

const validationSchema = Yup.object({
  name: Yup.string().required("Nome é obrigatório"),
  cnpj: Yup.string().matches(/^\d{14}$/, "CNPJ inválido (deve ter 14 dígitos)").required("CNPJ é obrigatório"),
  cpf: Yup.string().matches(/^\d{11}$/, "CPF inválido (deve ter 11 dígitos)").required("CPF é obrigatório"),
  description: Yup.string().max(500, "Máximo de 500 caracteres"),
  street: Yup.string().required("Rua é obrigatória"),
  number: Yup.string().required("Número é obrigatório"),
  neighborhood: Yup.string().required("Bairro é obrigatório"),
  city: Yup.string().required("Cidade é obrigatória"),
  state: Yup.string().required("Estado é obrigatório"),
  zipCode: Yup.string().required("CEP é obrigatório"),
});

export default function ProfileSetup() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [storeImageFile, setStoreImageFile] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [storePreview, setStorePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError(null);
      
      try {
        if (!user) throw new Error("Usuário não autenticado");
        if (!location) throw new Error("Localização não definida");
        if (!storeImageFile) throw new Error("Selecione a imagem da loja");
        if (!selectedCategory) throw new Error("Selecione uma categoria");

        // Criar/atualizar proprietário
        const { data: ownerData, error: ownerError } = await supabase
          .from("owners")
          .upsert([{ user_id: user.id, cpf: values.cpf }])
          .select()
          .single();
        
        if (ownerError) throw new Error(ownerError.message);

        // Upload de imagens
        const storeImageUrl = await uploadImage(storeImageFile);
        const bannerImageUrl = bannerImageFile ? await uploadImage(bannerImageFile) : null;

        // Criar loja
        const { error: storeError } = await supabase.from("stores").insert([{
          name: values.name, cnpj: values.cnpj, 
          latitude: location.latitude, longitude: location.longitude,
          owner_id: ownerData.id, description: values.description,
          category_id: selectedCategory, 
          store_image_url: storeImageUrl, banner_image_url: bannerImageUrl
        }]);
        
        if (storeError) throw new Error(storeError.message);

        // Criar endereço
        const { error: addressError } = await supabase.from("addresses").insert([{
          street: values.street, number: values.number, 
          neighborhood: values.neighborhood, city: values.city, 
          state: values.state, zip_code: values.zipCode, store_id: ownerData.id
        }]);
        
        if (addressError) throw new Error(addressError.message);

        router.push("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Fetch inicial de dados
  useEffect(() => {
    const fetchData = async () => {
      // Verificar usuário autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return router.push("/signin");
      setUser(user);
      
      // Carregar perfil
      const { data: profile, error: profileError } = await supabase
        .from("profiles").select("name, phone, email").eq("id", user.id).single();

      if (!profileError && profile) {
        formik.setValues({
          ...initialValues,
          name: profile.name || "",
          phone: profile.phone || "",
          email: profile.email || user.email || ""
        });
      }

      // Carregar categorias
      const { data, error } = await supabase.from("categories").select("id, name");
      if (!error) setCategories(data || []);

      // Obter localização
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
          (error) => setError("Erro ao obter localização: " + error.message)
        );
      }
    };

    fetchData();
  }, [router]);

  // Funções auxiliares
  const uploadImage = async (file) => {
    const { data, error } = await supabase.storage
      .from("store-images").upload(`public/${uuidv4()}`, file);
    if (error) throw new Error("Erro ao fazer upload da imagem: " + error.message);
    return data?.path;
  };

  const handleImageChange = (setter, previewSetter) => (e) => {
    const file = e.target.files?.[0] || null;
    setter(file);
    if (file) previewSetter(URL.createObjectURL(file));
  };

  const getFieldError = (fieldName) => 
    formik.touched[fieldName] && formik.errors[fieldName] ? 
      <p className="text-red-400 text-xs mt-1">{formik.errors[fieldName]}</p> : null;

  // Verificar se o step atual pode avançar
  const canAdvanceToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formik.values.name && formik.values.cnpj && formik.values.cpf && 
               selectedCategory && !formik.errors.name && !formik.errors.cnpj && !formik.errors.cpf;
      case 2:
        return storeImageFile && formik.values.description;
      case 3:
        return formik.values.street && formik.values.number && formik.values.neighborhood && 
               formik.values.city && formik.values.state && formik.values.zipCode && 
               !formik.errors.street && !formik.errors.number && !formik.errors.neighborhood && 
               !formik.errors.city && !formik.errors.state && !formik.errors.zipCode;
      default:
        return false;
    }
  };

  // Componentes de UI para cada etapa
  const renderStep = () => {
    const steps = [
      // Step 1: Informações Básicas
      <div key="step1" className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-6">Informações Básicas</h2>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nome Fantasia</label>
          <input type="text" {...formik.getFieldProps("name")} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
          {getFieldError("name")}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">CNPJ</label>
          <input type="text" {...formik.getFieldProps("cnpj")} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" placeholder="Apenas números" />
          {getFieldError("cnpj")}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">CPF do Responsável</label>
          <input type="text" {...formik.getFieldProps("cpf")} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" placeholder="Apenas números" />
          {getFieldError("cpf")}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Categoria da Loja</label>
          <select onChange={(e) => setSelectedCategory(Number(e.target.value))} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white">
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>,
      
      // Step 2: Identidade Visual
      <div key="step2" className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-6">Identidade Visual</h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Descrição da Loja</label>
          <textarea {...formik.getFieldProps("description")} rows={3} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"></textarea>
          <p className="text-gray-400 text-xs mt-1">{formik.values.description.length}/500 caracteres</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagem da loja e banner - implementação simplificada */}
          <ImageUploader 
            label="Logo da Loja" 
            preview={storePreview} 
            onChange={handleImageChange(setStoreImageFile, setStorePreview)}
            onClear={() => {setStorePreview(null); setStoreImageFile(null);}}
          />
          <ImageUploader 
            label="Banner da Loja (opcional)"
            preview={bannerPreview} 
            onChange={handleImageChange(setBannerImageFile, setBannerPreview)}
            onClear={() => {setBannerPreview(null); setBannerImageFile(null);}}
          />
        </div>
      </div>,
      
      // Step 3: Endereço
      <div key="step3" className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-6">Endereço da Loja</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rua</label>
            <input type="text" {...formik.getFieldProps("street")} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
            {getFieldError("street")}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Número</label>
            <input type="text" {...formik.getFieldProps("number")} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
            {getFieldError("number")}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Bairro</label>
          <input type="text" {...formik.getFieldProps("neighborhood")} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
          {getFieldError("neighborhood")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
            <input type="text" {...formik.getFieldProps("city")} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
            {getFieldError("city")}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <input type="text" {...formik.getFieldProps("state")} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
            {getFieldError("state")}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">CEP</label>
          <input type="text" {...formik.getFieldProps("zipCode")} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
          {getFieldError("zipCode")}
        </div>
      </div>,
      
      // Step 4: Confirmação
      <div key="step4" className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-6">Confirmação</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-400 mb-4">Informações da Loja</h3>
          <p className="text-white">
            <strong>Nome:</strong> {formik.values.name}<br />
            <strong>CNPJ:</strong> {formik.values.cnpj}<br />
            <strong>Categoria:</strong> {categories.find(c => c.id === selectedCategory)?.name || ''}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-400 mb-4">Endereço</h3>
          <p className="text-white">
            {formik.values.street}, {formik.values.number}, {formik.values.neighborhood}<br />
            {formik.values.city} - {formik.values.state}, CEP: {formik.values.zipCode}
          </p>
        </div>
        {(storePreview || bannerPreview) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storePreview && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-400 mb-4">Logo da Loja</h3>
                <img src={storePreview} alt="Logo preview" className="h-32 object-contain mx-auto" />
              </div>
            )}
            {bannerPreview && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-400 mb-4">Banner da Loja</h3>
                <img src={bannerPreview} alt="Banner preview" className="h-32 object-cover w-full" />
              </div>
            )}
          </div>
        )}
      </div>
    ];

    return steps[currentStep - 1];
  };

  // Componente para upload de imagem
  const ImageUploader = ({ label, preview, onChange, onClear }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 bg-gray-800 h-40 flex flex-col items-center justify-center">
        {preview ? (
          <div className="relative w-full h-full">
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            <button onClick={onClear} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6">&times;</button>
          </div>
        ) : (
          <>
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p className="text-gray-400 text-sm mt-2">Clique para selecionar</p>
            <input type="file" onChange={onChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Cadastro da Loja</h1>
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between">
            {["Informações", "Identidade", "Endereço", "Confirmação"].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep > i+1 ? "bg-blue-600" : currentStep === i+1 ? "bg-blue-500 ring-2 ring-blue-300" : "bg-gray-700"}`}>
                  {currentStep > i+1 ? "✓" : i+1}
                </div>
                <span className={`text-xs mt-1 ${currentStep === i+1 ? "text-blue-400" : "text-gray-500"}`}>{step}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-700"></div>
            <div className="absolute top-0 left-0 h-1 bg-blue-500" style={{width: `${((currentStep-1)/3)*100}%`}}></div>
          </div>
        </div>
        
        <form onSubmit={formik.handleSubmit}>
          {error && (
            <div className="p-4 bg-red-900 text-red-200 rounded-lg mb-6">{error}</div>
          )}
          
          {renderStep()}
          
          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <button type="button" onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800">
                Voltar
              </button>
            )}
            
            {currentStep < 4 ? (
              <button type="button" onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canAdvanceToNextStep()}
                className={`ml-auto px-6 py-2 rounded-lg ${
                  canAdvanceToNextStep() ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}>
                Continuar
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting}
                className="ml-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                {isSubmitting ? "Cadastrando..." : "Finalizar Cadastro"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}