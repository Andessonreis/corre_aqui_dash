"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FiEdit2, FiCamera, FiClock, FiMapPin, FiMail, FiPhone, FiInfo, FiShield, FiTrendingUp } from "react-icons/fi"
import { supabase } from "@/lib/client";
import { Skeleton } from "@/components/ui/Skeleton";


interface StoreData {
  id: number
  name: string
  description: string
  category_id: number
  categories: {
    name: string
  }
  image_url: string
  banner_image_url: string
  addresses: Array<{
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    postal_code: string
  }> | null
}

interface UserProfile {
  email: string
  phone: string | null
  name: string
}

export function Profile() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [storeData, setStoreData] = useState<StoreData | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [hours, setHours] = useState("Seg-Sex: 9h - 18h")
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) throw new Error(authError?.message || "Usuário não autenticado");
  
        const userId = authData.user.id;
  
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('name, email, phone, role')
          .eq('id', userId)
          .single();
  
        if (profileError || !profile) throw new Error(profileError?.message || "Perfil não encontrado");
        if (profile.role !== 'company') throw new Error("Acesso permitido apenas para contas empresariais");
  
        const { data: owner, error: ownerError } = await supabase
          .from('owners')
          .select('id')
          .eq('user_id', userId)
          .single();
  
        if (ownerError || !owner) throw new Error(ownerError?.message || "Proprietário não registrado");
  
        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select(`
            id, name, description, category_id, image_url, banner_image_url,
            addresses!addresses_store_id_fkey (
              street, number, neighborhood, city, state, postal_code
            ),
            categories!stores_category_id_fkey (
              name
            )
          `)
          .eq('owner_id', owner.id)
          .maybeSingle();
        
  
        if (storeError) throw new Error(storeError.message);
        if (!store) throw new Error("Nenhuma loja cadastrada para este proprietário");
  
        setUserProfile({
          name: profile.name,
          email: profile.email || 'Não informado',
          phone: profile.phone
        });
  
        setStoreData({
          ...store,
          categories: store.categories ? store.categories[0] : { name: "Categoria não definida" }
        });
  
        setLoading(false);
      } catch (err) {
        console.error('Erro no fetchData:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="max-w-8xl mx-auto p-6 space-y-6 flex justify-center items-center h-screen bg-zinc-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-red-600 animate-spin absolute"></div>
            <div className="w-16 h-16 rounded-full border-4 border-l-transparent border-r-transparent border-red-800 animate-ping absolute opacity-70"></div>
          </div>
          <p className="mt-6 text-red-400 font-viking tracking-wider text-lg">CARREGANDO</p>
        </div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="max-w-8xl mx-auto p-6 space-y-6">
        <div className="bg-zinc-900 rounded-lg shadow-lg text-center py-16 border border-zinc-800">
          <div className="bg-red-900/20 w-24 h-24 mx-auto rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="mt-6 font-viking text-xl text-red-400 tracking-wider">NENHUM DADO ENCONTRADO</p>
          <p className="mt-2 text-zinc-400 max-w-md mx-auto">Não localizamos informações para esta loja. Verifique se você está conectado com a conta correta.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6 ">
      {/* Animated Banner*/}
      <motion.div 
        className="relative w-full h-64 rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-r from-cyan-900/10 to-indigo-900/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
     >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuNjI2NiAxMi42MjY2QzE0LjU5ODIgMTAuNjU1MSAxNC41OTgyIDcuMzQ0ODggMTIuNjI2NiA1LjM3MzM2QzEwLjY1NTEgMy40MDE4NSA3LjM0NDg4IDMuNDAxODUgNS4zNzMzNiA1LjM3MzM2QzMuNDAxODUgNy4zNDQ4OCAzLjQwMTg1IDEwLjY1NTEgNS4zNzMzNiAxMi42MjY2QzcuMzQ0ODggMTQuNTk4MiAxMC42NTUxIDE0LjU5ODIgMTIuNjI2NiAxMi42MjY2WiIgc3Ryb2tlPSIjMDBGN0ZGIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjEuNSIvPjwvc3ZnPg==')] opacity-5" />

      <img
        src={storeData.banner_image_url || 'https://source.unsplash.com/1200x400/?cyberpunk,night'}
        alt="Banner"
        className="w-full h-full object-cover opacity-90 mix-blend-soft-light"
      />
        
        {/* Banner title and logo section */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-5 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-red-700 shadow-lg shadow-red-900/30 bg-zinc-900">
              <img 
                src={storeData.image_url || 'https://i.pravatar.cc/80'} 
                alt="Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">{storeData.name}</h1>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-900/60 text-red-200 border border-red-700">
                  <FiShield className="mr-1 text-red-400" size={12} />
                  {storeData?.categories?.name || 'Sem categoria'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Edit buttons */}
        <div className="absolute top-4 right-4 flex space-x-2 z-30">
          <button className="bg-zinc-900/80 text-red-400 p-2 rounded backdrop-blur-sm border border-zinc-700 hover:bg-zinc-800 transition shadow-lg">
            <FiCamera size={16} />
          </button>
          <button className="bg-zinc-900/80 text-red-400 p-2 rounded backdrop-blur-sm border border-zinc-700 hover:bg-zinc-800 transition shadow-lg">
            <FiEdit2 size={16} />
          </button>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - info and stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <motion.div
            className="bg-[#0d1425] rounded-2xl border border-cyan-500/10 backdrop-blur-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-[#0d1425] rounded-2xl border border-cyan-500/10 backdrop-blur-sm  border-b border-zinc-800 p-4 flex justify-between items-center bg-gradient-to-r from-red-900/20 to-transparent">
              <div className="flex items-center">
                <FiInfo className="text-red-500 mr-2" size={18} />
                <h2 className="text-lg font-semibold text-white">Descrição da Loja</h2>
              </div>
              <button className="text-red-400 hover:text-red-300 transition bg-zinc-800/70 rounded-full p-1.5">
                <FiEdit2 size={16} />
              </button>
            </div>
            <div className="p-5">
              <p className="text-zinc-300 leading-relaxed">
                {storeData?.description || 'Adicione uma descrição para sua loja destacar os diferenciais do seu negócio e atrair mais clientes.'}
              </p>
            </div>
          </motion.div>
          
          {/* Address Card */}
          <motion.div
          className="bg-[#0d1425] rounded-2xl border border-cyan-500/10 backdrop-blur-sm"            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-[#0d1425] rounded-2xl border border-cyan-500/10 backdrop-blur-sm border-b border-zinc-800 p-4 flex justify-between items-center bg-gradient-to-r from-red-900/20 to-transparent">
              <div className="flex items-center">
                <FiMapPin className="text-red-500 mr-2" size={18} />
                <h2 className="text-lg font-semibold text-white">Endereço</h2>
              </div>
              <button className="text-red-400 hover:text-red-300 transition bg-zinc-800/70 rounded-full p-1.5">
                <FiEdit2 size={16} />
              </button>
            </div>
            <div className="p-5">
              {storeData?.addresses?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <p className="text-red-400 text-xs uppercase tracking-wider font-semibold">Endereço</p>
                    <p className="text-white">{storeData.addresses[0].street}, {storeData.addresses[0].number}</p>
                    <p className="text-zinc-400">{storeData.addresses[0].neighborhood}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-red-400 text-xs uppercase tracking-wider font-semibold">Cidade / Estado</p>
                    <p className="text-white">{storeData.addresses[0].city}, {storeData.addresses[0].state}</p>
                    <p className="text-zinc-400">CEP: {storeData.addresses[0].postal_code}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0d1425] rounded-2xl border border-cyan-500/10 backdrop-blur-sm  p-5 text-center border border-dashed border-zinc-700">
                  <p className="text-zinc-400">Nenhum endereço cadastrado</p>
                  <button className="mt-3 text-red-400 hover:text-red-300 transition text-sm inline-flex items-center gap-1 bg-zinc-800 px-4 py-2 rounded-full">
                    <FiMapPin size={14} />
                    Adicionar Endereço
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Hours Card */}
          <motion.div
            className="bg-[#0d1425] rounded-2xl border border-cyan-500/10 backdrop-blur-sm  border border-zinc-800 shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="bg-[#0d1425] rounded-2xl border border-cyan-500/10 backdrop-blur-sm border-b border-zinc-800 p-4 flex justify-between items-center bg-gradient-to-r from-red-900/20 to-transparent">
              <div className="flex items-center">
                <FiClock className="text-red-500 mr-2" size={18} />
                <h2 className="text-lg font-semibold text-white">Horário de Funcionamento</h2>
              </div>
              <button className="text-red-400 hover:text-red-300 transition bg-zinc-800/70 rounded-full p-1.5">
                <FiEdit2 size={16} />
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-red-900/20 to-red-950/10 rounded-lg p-4 border border-red-950 flex flex-col items-center justify-center">
                  <p className="text-red-400 text-xs uppercase tracking-wider font-semibold mb-1">Segunda - Sexta</p>
                  <p className="text-white text-lg font-medium">9h - 18h</p>
                </div>
                <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/30 flex flex-col items-center justify-center">
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-1">Sábado</p>
                  <p className="text-white text-lg font-medium">9h - 13h</p>
                </div>
                <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/30 flex flex-col items-center justify-center">
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-1">Domingo</p>
                  <p className="text-white text-lg font-medium">Fechado</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Right column - contact and stats */}
        <div className="space-y-6">
          {/* Contact Card */}
          <motion.div
            className="bg-[#0d1425] rounded-2xl border border-cyan-500/10 backdrop-blur-sm  border border-zinc-800 shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-[#0d1425] rounded-2xl border border-cyan-500/10 backdrop-blur-sm  border-b border-zinc-800 p-4 flex justify-between items-center bg-gradient-to-r from-red-900/20 to-transparent">
              <div className="flex items-center">
                <FiMail className="text-red-500 mr-2" size={18} />
                <h2 className="text-lg font-semibold text-white">Contato</h2>
              </div>
              <button className="text-red-400 hover:text-red-300 transition bg-zinc-800/70 rounded-full p-1.5">
                <FiEdit2 size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-900/30 text-red-400 mr-3">
                  <FiMail size={18} />
                </div>
                <div>
                  <p className="text-zinc-400 text-xs">Email</p>
                  <p className="text-white">{userProfile?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-900/30 text-red-400 mr-3">
                  <FiPhone size={18} />
                </div>
                <div>
                  <p className="text-zinc-400 text-xs">Telefone</p>
                  <p className="text-white">{userProfile?.phone || 'Não informado'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions Quick Buttons */}
          <motion.div
            className="bg-[#0d1425] rounded-2xl border border-cyan-500/10 backdrop-blur-sm  bg-gradient-to-br from-red-900/30 to-red-950/20 rounded-lg border border-red-900/30 shadow-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <p className="text-white font-semibold mb-3">Ações Rápidas</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-zinc-900/80 hover:bg-zinc-800 transition text-white py-2 px-4 rounded-lg border border-zinc-800 text-sm flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Novo Produto
              </button>
              <button className="bg-zinc-900/80 hover:bg-zinc-800 transition text-white py-2 px-4 rounded-lg border border-zinc-800 text-sm flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver Loja
              </button>
              <button className="bg-zinc-900/80 hover:bg-zinc-800 transition text-white py-2 px-4 rounded-lg border border-zinc-800 text-sm flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Relatórios
              </button>
              <button className="bg-zinc-900/80 hover:bg-zinc-800 transition text-white py-2 px-4 rounded-lg border border-zinc-800 text-sm flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configurar
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}