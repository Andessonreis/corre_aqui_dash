"use client";

import { CompanyForm } from "@/components/company/CompanyForm";
import { AddressForm } from "@/components/company/AddressForm";
import { ImageForm } from "@/components/company/ImageForm";
import { supabase } from "@/lib/client";
import { SetupSidebar } from "@/components/company/setup/SetupSidebar";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Store, MapPin, Shield, Image } from "lucide-react";

export default function ProfileSetupPage() {
  const router = useRouter();
  // Estados para controlar a aba ativa e os dados do formulário
  const [activeTab, setActiveTab] = useState<"store" | "image" | "location">("store");
  const [companyData, setCompanyData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
  
  // Computed property to check if images are completed
  const imagesCompleted = profileImageUrl !== null && bannerImageUrl !== null;

  // Efeito para buscar usuário e perfil ao carregar a página
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      // Busca o usuário logado
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      // Redireciona se não estiver logado
      if (userError || !userData.user) {
        router.push("/signin");
        return;
      }

      setUser(userData.user);

      // Busca o perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
        router.push("/signin");
        return;
      }

      setProfile(profileData);
    };

    fetchUserAndProfile();
  }, [router]);

  // Função para lidar com o envio do formulário da empresa
  const handleCompanySubmit = async (values: any) => {
    if (!user || !profile) return;

    // Verifica se já existe uma loja com o mesmo CNPJ
    const { data: existingStore, error: cnpjError } = await supabase
      .from("stores")
      .select("id")
      .eq("cnpj", values.cnpj)
      .maybeSingle();

    if (existingStore) {
      alert("Já existe uma loja com este CNPJ.");
      return;
    }

    // Atualiza os dados da empresa e muda para a aba de imagem
    values.name = profile.name;
    setCompanyData(values);
    setActiveTab("image");
  };

  // Função para lidar com o envio das imagens
  const handleImagesSubmit = (storeImage: string, bannerImage: string) => {
    if (!storeImage || !bannerImage) {
      alert("Por favor, envie a logo e o banner antes de continuar.");
      return;
    }
  
    // Atualiza as imagens no estado global da página
    setProfileImageUrl(storeImage);
    setBannerImageUrl(bannerImage);
  
    // Atualiza os dados da empresa com as URLs das imagens
    setCompanyData((prev: any) => ({
      ...prev,
      image_url: storeImage,
      banner_url: bannerImage
    }));
  
    setActiveTab("location");
  };
  

  // Função para obter latitude e longitude a partir do endereço
  const getLatLongFromAddress = async (values: any) => {
    try {
      const addressComponents = [
        values.street,
        values.number,
        values.neighborhood,
        values.city,
        values.state,
        values.postal_code,
        "Brasil"
      ].filter(Boolean).join(", ");
  
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressComponents)}`,
        {
          headers: {
            "User-Agent": "CorreAqui (contact@correaqui.com)"
          }
        }
      );
  
      if (!response.ok) throw new Error("Erro na resposta da API");
      
      const data = await response.json();
  
      if (!data.length) {
        throw new Error("Endereço não encontrado. Verifique os dados informados.");
      }
  
      const { lat, lon } = data[0];
      return { 
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      };
  
    } catch (error) {
      console.error("Erro detalhado:", error);
      throw new Error("Não foi possível determinar a localização. Verifique o endereço ou tente novamente mais tarde.");
    }
  };

  // Função para lidar com o envio dos dados de endereço
  const handleAddressSubmit = async (values: any) => {
    if (!companyData || !user || !profile) return;

    try {
      // Formata o endereço completo
      const address = `${values.street}, ${values.number}, ${values.neighborhood}, ${values.city}, ${values.state}, ${values.postal_code}, Brasil`;

      // Obtém latitude e longitude a partir do endereço
      const { latitude, longitude } = await getLatLongFromAddress(address);

      const { cpf, ...storeData } = companyData;

      // Cria o owner (responsável) na tabela owners
      const { data: owner, error: ownerError } = await supabase
        .from("owners")
        .insert([{ user_id: profile.id, cpf }])
        .select()
        .single();

      if (ownerError) throw ownerError;

      // Cria a loja na tabela stores
      const { data: store, error: storeError } = await supabase
        .from("stores")
        .insert([{ ...storeData, owner_id: owner.id, latitude, longitude }])
        .select()
        .single();


        if (storeError) throw new Error(`Erro na store: ${storeError.message}`);

        // Criar address
        const { error: addressError } = await supabase.from("addresses").insert([
          {
            store_id: store.id,
            profile_id: profile.id,
            street: values.street,
            number: values.number,
            neighborhood: values.neighborhood,
            city: values.city,
            state: values.state,
            postal_code: values.postal_code,
            country: 'Brasil',
            latitude,
            longitude
          },
        ]);
  
        if (addressError) throw new Error(`Erro no address: ${addressError.message}`);

      // Redireciona para o dashboard após o sucesso
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      alert("Erro ao salvar os dados. Tente novamente.");
    }
  };

  const calculateProgress = () => {
    if (activeTab === "store") return 33;
    if (activeTab === "image") return 66;
    return 100;
  };


  return (
    <div className="min-h-screen w-full bg-gray-500">
  
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-red-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>
  
      {/* Main layout */}
      <div className="relative z-10 flex flex-col w-full min-h-screen lg:flex-row">
  
        {/* Left sidebar/preview panel - Hidden on mobile */}
        <div className="hidden lg:block">
          <SetupSidebar
            activeTab={activeTab}
            companyData={companyData}
            imagesCompleted={imagesCompleted}
            setActiveTab={setActiveTab}
          />
        </div>
  
        {/* Formulário principal - Ocupa todo o espaço restante */}
        <div className="flex-1 flex justify-center p-4 sm:p-6 md:p-8 lg:pt-20 lg:pb-10 w-full">
          <motion.div
            className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-auto lg:max-h-[85vh]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="relative overflow-hidden">
              {/* Elemento decorativo de fundo */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-indigo-50 to-red-50 opacity-70" />
  
              {/* Círculos decorativos animados */}
              <motion.div
                className="absolute top-4 right-12 w-16 h-16 rounded-full bg-red-500 opacity-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.15, 0.1]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-4 left-12 w-24 h-24 rounded-full bg-indigo-500 opacity-10"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.1, 0.15, 0.1]
                }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              />
  
              {/* Conteúdo do cabeçalho */}
              <div className="relative px-6 sm:px-8 py-6 sm:py-8">
                {/* Seletor de abas visível apenas em dispositivos móveis */}
                <div className="lg:hidden mb-4">
                  <select 
                    value={activeTab}
                    onChange={(e) => {
                      // Type assertion para resolver o problema de tipagem
                      const newTab = e.target.value as "store" | "image" | "location";
                      setActiveTab(newTab);
                    }}
                    className="w-full py-2 px-3 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 text-sm"
                  >
                    <option value="store">Detalhes da Loja</option>
                    <option value="image" disabled={!companyData}>Imagens da Loja</option>
                    <option value="location" disabled={!companyData}>Localização</option>
                  </select>
                </div>
                
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {activeTab === "store"
                      ? "Detalhes da Loja"
                      : activeTab === "image"
                        ? "Imagens da Loja"
                        : "Localização"}
                  </h2>
  
                  <p className="text-gray-500 mt-1">
                    {activeTab === "store"
                      ? "Personalize suas informações básicas"
                      : activeTab === "image"
                        ? "Adicione o logo e banner da sua loja"
                        : "Configure seu endereço e contato"}
                  </p>
                </motion.div>
  
                {/* Indicador de progresso elegante */}
                <div className="flex items-center mt-6">
                  <div className="flex-1">
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-red-500 to-red-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${calculateProgress()}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-500">
                    {activeTab === "store"
                      ? "Etapa 1/3"
                      : activeTab === "image"
                        ? "Etapa 2/3"
                        : "Etapa 3/3"}
                  </div>
                </div>
              </div>
            </div>
  
  
            {/* Navegação - visível apenas em desktop */}
            <div className="hidden lg:flex px-8 py-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("store")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center transition-all ${activeTab === "store"
                  ? "bg-red-500 text-white shadow-md shadow-red-100"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={activeTab === "store" ? { rotate: [0, -10, 0] } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Store className="w-4 h-4 mr-2" />
                </motion.div>
                Detalhes da Loja
              </motion.button>
  
              <motion.button
                whileHover={companyData ? { scale: 1.02 } : {}}
                whileTap={companyData ? { scale: 0.98 } : {}}
                onClick={() => companyData && setActiveTab("image")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center transition-all ${activeTab === "image"
                  ? "bg-red-500 text-white shadow-md shadow-red-100"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  } ${!companyData ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={activeTab === "image" ? { rotate: [0, 10, 0] } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Image className="w-4 h-4 mr-2" />
                </motion.div>
                Imagens
              </motion.button>
  
  
              <motion.button
                whileHover={companyData ? { scale: 1.02 } : {}}
                whileTap={companyData ? { scale: 0.98 } : {}}
                onClick={() => companyData && setActiveTab("location")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center transition-all ${activeTab === "location"
                  ? "bg-red-500 text-white shadow-md shadow-red-100"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  } ${!companyData ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={activeTab === "location" ? { rotate: [0, 10, 0] } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                </motion.div>
                Localização
              </motion.button>
            </div>
  
            {/* Linha separadora  */}
            <div className="px-8 relative">
              <div className="w-full h-px bg-gray-100" />
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </motion.div>
            </div>
  
            {/* Conteúdo do formulário  */}
            <div className="p-4 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {activeTab === "store" ? (
                    <CompanyForm
                      onSubmit={handleCompanySubmit}
                    />
                  ) : activeTab === "image" ? (
                    <ImageForm onSubmit={handleImagesSubmit} />
                  ) : (
                    <AddressForm onSubmit={handleAddressSubmit} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
  
            {/* Rodapé */}
            <div className="bg-gray-50 px-6 sm:px-8 py-4 sm:py-6 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center text-gray-500">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-2"
                >
                  <Shield className="w-4 h-4 text-red-500" />
                </motion.div>
                <span className="text-xs">Seus dados estão seguros</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}