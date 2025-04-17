"use client";

import { motion } from "framer-motion";

type SetupStep = {
  id: "store" | "image" | "location";
  label: string;
  desc: string;
  step: number;
};

type StoreData = {
  name: string;
  description?: string;
  image_url?: string | null;
  banner_url?: string | null;
  [key: string]: any;
};

interface SetupSidebarProps {
  activeTab: "store" | "image" | "location";
  companyData: StoreData | null;
  imagesCompleted: boolean;
  setActiveTab: (tab: "store" | "image" | "location") => void;
}

export const SetupSidebar: React.FC<SetupSidebarProps> = ({
  activeTab,
  companyData,
  imagesCompleted,
  setActiveTab,
}) => {
  const calculateProgress = () => {
    if (activeTab === "store") return 33;
    if (activeTab === "image") return 66;
    return 100;
  };

  const setupSteps: SetupStep[] = [
    {
      id: "store",
      label: "Detalhes da Loja",
      desc: "Informações básicas do seu negócio",
      step: 1,
    },
    {
      id: "image",
      label: "Imagens da Loja",
      desc: "Logo e banner do seu negócio",
      step: 2,
    },
    {
      id: "location",
      label: "Localização",
      desc: "Endereço e informações de contato",
      step: 3,
    },
  ];

  return (
    <motion.aside
      className="hidden lg:flex w-96 bg-white flex-col h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Seção superior com logo e cabeçalho */}
      <div className="relative">
        {/* Elemento decorativo superior */}
        <div className="absolute top-0 right-0 left-0 h-36 bg-gradient-to-br from-red-50 to-indigo-50 rounded-br-[100px]" />

        <div className="relative pt-8 px-8 pb-4">
          {/* Logo animada */}
          <motion.div
            className="mb-16 relative"
            initial={{ y: -30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div
              className="text-3xl font-extrabold tracking-tight flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <span className="text-gray-900">Corre</span>
              <span className="text-red-500">Aqui</span>
              <motion.div
                className="ml-2 w-2 h-2 bg-red-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
              />
            </motion.div>
            <motion.div
              className="h-0.5 w-0 bg-gradient-to-r from-red-500 to-purple-600 mt-2"
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

          {/* Título principal */}
          <motion.h1
            className="text-gray-900 text-3xl font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Bem-vindo
          </motion.h1>
          <motion.p
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Configure sua presença digital
          </motion.p>
        </div>
      </div>

      {/* Progress tracker vertical */}
      <div className="py-8 pl-12 pr-6 flex-1">
        <div className="relative">
          {/* Linha de progresso vertical */}
          <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-gray-100" />

          {/* Itens de progresso */}
          {setupSteps.map((item, index) => (
            <motion.div
              key={item.id}
              className="mb-12 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.2 }}
            >
              {/* Indicador de etapa */}
              <motion.div
                className={`absolute -left-8 flex items-center justify-center w-8 h-8 rounded-full z-10 text-sm font-medium
                  ${activeTab === item.id
                    ? 'bg-red-500 text-white'
                    : companyData && item.id === "store"
                      ? 'bg-emerald-500 text-white'
                      : imagesCompleted && item.id === "image"
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-gray-400 border border-gray-200'
                  }`}
                initial={false}
                animate={activeTab === item.id ? {
                  scale: [1, 1.15, 1],
                  transition: { repeat: Infinity, duration: 2 }
                } : {}}
                onClick={() => {
                  if (item.id === "store" ||
                    (item.id === "image" && companyData) ||
                    (item.id === "location" && companyData && imagesCompleted)) {
                    setActiveTab(item.id);
                  }
                }}
              >
                {((companyData && item.id === "store") || (imagesCompleted && item.id === "image")) ? (
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </motion.svg>
                ) : (
                  item.step
                )}
              </motion.div>

              {/* Conteúdo do item */}
              <motion.div
                className={`pl-6 cursor-pointer ${(!companyData && item.id !== "store") ||
                  (!imagesCompleted && item.id === "location")
                  ? "opacity-40" : ""
                  }`}
                whileHover={
                  (item.id === "store" ||
                    (item.id === "image" && companyData) ||
                    (item.id === "location" && imagesCompleted))
                    ? { x: 5 } : {}
                }
                onClick={() => {
                  if (item.id === "store" ||
                    (item.id === "image" && companyData) ||
                    (item.id === "location" && companyData && imagesCompleted)) {
                    setActiveTab(item.id);
                  }
                }}
              >
                <h3 className={`font-semibold mb-1 ${activeTab === item.id ? "text-red-500" : "text-gray-900"}`}>
                  {item.label}
                </h3>
                <p className="text-sm text-gray-500">{item.desc}</p>

                {/* Borda indicadora de ativo */}
                {activeTab === item.id && (
                  <motion.div
                    className="h-0.5 bg-red-500 mt-2"
                    layoutId="activeTabIndicator"
                    initial={{ width: 0 }}
                    animate={{ width: "30%" }}
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Área de visualização e status */}
      {companyData ? (
        <motion.div
          className="mx-8 mb-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            {/* Header exclusivo para loja */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h4 className="font-medium text-gray-800">Visualização da Loja</h4>
              <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                Preview
              </span>
            </div>

            {/* Preview do banner */}
            <div className="w-full aspect-video bg-white relative">
              {companyData.banner_url ? (
                <motion.img
                  src={companyData.banner_url}
                  alt="Banner da loja"
                  className="w-full h-full object-cover object-center"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center">
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-300 mb-2"
                      initial={{ y: -10 }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </motion.svg>
                    <span className="text-gray-400 text-xs">Banner da loja</span>
                  </div>
                </div>
              )}
            </div>

            {/* Informações da loja */}
            <div className="p-4 flex items-start space-x-3 bg-white">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                {companyData.image_url ? (
                  <img
                    src={companyData.image_url}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <span className="text-gray-300 text-xs">Logo</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium text-gray-900">{companyData.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{companyData.description}</p>
              </div>
            </div>

            {/* Rodapé com status */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Progresso: {calculateProgress()}%</span>
                <motion.div
                  className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1 max-w-[120px]"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "120px" }}
                  transition={{ delay: 0.9 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-red-400"
                    initial={{ width: "0%" }}
                    animate={{
                      width: activeTab === "store"
                        ? "33%"
                        : activeTab === "image"
                          ? "66%"
                          : "100%"
                    }}
                    transition={{ duration: 0.8 }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="mx-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-red-50 to-indigo-50 rounded-xl p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.7 }}
              className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="M14 3v5h5M16 13l5 5m-5 0l5-5" />
              </svg>
            </motion.div>
            <h3 className="text-gray-900 font-medium mb-2">Comece sua configuração</h3>
            <p className="text-gray-500 text-sm mb-4">Preencha as informações da sua loja para visualizar o preview</p>
            <motion.button
              className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg shadow-sm inline-flex items-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab("store")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Começar agora
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};