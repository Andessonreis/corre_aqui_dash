"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CompanyForm } from "@/components/company/CompanyForm";
import { AddressForm } from "@/components/company/AddressForm";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Store, MapPin, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/client";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"store" | "location">("store");
  const [companyData, setCompanyData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Busca o usuário e o perfil ao carregar a página
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
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

  // Função para lidar com o envio dos dados da loja
  const handleCompanySubmit = async (values: any) => {
    if (!user || !profile) return;

    // Verifica se o CNPJ já existe
    const { data: existingStore, error: cnpjError } = await supabase
      .from("stores")
      .select("id")
      .eq("cnpj", values.cnpj)
      .maybeSingle();

    if (existingStore) {
      alert("Já existe uma loja com este CNPJ.");
      return;
    }

    // Preenche o nome fantasia automaticamente com o nome do perfil
    values.name = profile.name;

    // Define URLs de imagem padrão caso o usuário não tenha enviado
    values.store_image_url = values.image_url || "https://example.com/default-image.jpg";
    values.banner_image_url = values.banner_url || "https://example.com/default-banner.jpg";

    setCompanyData(values);
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black p-0 m-0 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-red-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-40 w-64 h-64 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-purple-600 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Main layout */}
      <div className="relative w-full h-screen flex">
        {/* Left sidebar/preview panel - Always visible */}
        <motion.div
          className="hidden lg:block w-2/5 h-screen bg-black/30 backdrop-blur-sm p-10 overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-full flex flex-col justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h1 className="text-4xl font-bold text-white mb-4">Crie sua presença digital</h1>
                <p className="text-gray-300">Configure sua loja e comece a vender mais em minutos.</p>
              </motion.div>

              <div className="space-y-6 mt-12">
                <motion.div
                  className={`flex items-center space-x-4 p-4 rounded-xl ${activeTab === "store" ? "bg-red-500/20 border border-red-500/30" : "bg-gray-800/50"}`}
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === "store" ? "bg-red-500" : "bg-gray-700"}`}>
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Detalhes da Loja</h3>
                    <p className="text-sm text-gray-400">Informações básicas do seu negócio</p>
                  </div>
                  {companyData && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                </motion.div>

                <motion.div
                  className={`flex items-center space-x-4 p-4 rounded-xl ${activeTab === "location" ? "bg-red-500/20 border border-red-500/30" : "bg-gray-800/50"}`}
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === "location" ? "bg-red-500" : "bg-gray-700"}`}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Localização</h3>
                    <p className="text-sm text-gray-400">Endereço e informações de contato</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Preview section */}
            {companyData && (
              <motion.div
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="h-24 bg-gradient-to-r from-indigo-600 to-red-500 relative">
                  {companyData.banner_image_url ? (
                    <img src={companyData.banner_image_url} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white/50 text-sm">Banner da loja</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex items-start space-x-3">
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden -mt-8 ring-4 ring-gray-900 shadow-lg">
                    {companyData.profile_image_url ? (
                      <img src={companyData.profile_image_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500 text-xs">Logo</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-white font-bold">{companyData.name || "Nome da Empresa"}</h3>
                    <p className="text-sm text-gray-400">{companyData.description || "Descrição da empresa..."}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Right side - Form area */}
        <motion.div
          className="w-full lg:w-3/5 h-screen bg-white/10 backdrop-blur-md flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Form header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-red-500 p-6">
              <motion.h2
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {activeTab === "store" ? "Informações da Loja" : "Localização"}
              </motion.h2>
              <div className="w-full h-1 bg-white/20 rounded-full mt-4">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: activeTab === "store" ? "50%" : "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Tabs navigation */}
            <div className="bg-gray-50 px-6 pt-4 pb-4 flex space-x-2">
              <button
                onClick={() => setActiveTab("store")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center transition-all ${
                  activeTab === "store"
                    ? "bg-white shadow text-red-600"
                    : "bg-transparent text-gray-600 hover:bg-white/60"
                }`}
              >
                <Store className="w-4 h-4 mr-2" />
                Loja
              </button>

              <button
                onClick={() => companyData && setActiveTab("location")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center transition-all ${
                  activeTab === "location"
                    ? "bg-white shadow text-red-600"
                    : "bg-transparent text-gray-600 hover:bg-white/60"
                } ${!companyData ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Localização
              </button>
            </div>

            {/* Form container */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "store" ? (
                    <CompanyForm onSubmit={handleCompanySubmit} />
                  ) : (
                    <AddressForm onSubmit={handleAddressSubmit} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}