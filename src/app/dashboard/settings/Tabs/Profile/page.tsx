"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiEdit2, FiCamera } from "react-icons/fi"

export function Profile() {
  const [storeName, setStoreName] = useState("Minha Loja")
  const [category, setCategory] = useState("Tecnologia")
  const [description, setDescription] = useState("Loja especializada em tecnologia e inovação.")
  const [email, setEmail] = useState("contato@minhaloja.com")
  const [phone, setPhone] = useState("+55 11 99999-9999")
  const [address, setAddress] = useState("Rua Exemplo, 123 - São Paulo, SP")
  const [hours, setHours] = useState("Seg-Sex: 9h - 18h")

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">

      {/* 🔥 Banner / Hero Section */}
      <motion.div 
        className="relative w-full h-40 rounded-xl overflow-hidden shadow-md"
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <img 
          src="https://source.unsplash.com/1200x400/?technology,store" 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center px-6">
          <h1 className="text-white text-2xl font-bold">{storeName}</h1>
        </div>

        {/* 📸 Botão de edição da foto do banner */}
        <button 
          className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
        >
          <FiCamera size={16} />
        </button>
      </motion.div>

      {/* Perfil */}
      <motion.div 
        className="bg-white dark:bg-zinc-900 p-5 rounded-xl shadow-md flex justify-between items-center"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <div className="flex items-center gap-4">
          <img src="https://i.pravatar.cc/80" alt="Profile" className="w-16 h-16 rounded-full shadow-lg" />
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{storeName}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{category}</p>
          </div>
        </div>
        <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-all">
          <FiEdit2 size={18} />
          Editar
        </button>
      </motion.div>

      {/* Seções */}
      {[
        { title: "Informações", content: [
          { label: "Nome da Loja", value: storeName },
          { label: "Categoria", value: category },
          { label: "Descrição", value: description },
        ]},
        { title: "Contato", content: [
          { label: "E-mail", value: email },
          { label: "Telefone", value: phone },
        ]},
        { title: "Endereço", content: [
          { label: "Local", value: address },
        ]},
        { title: "Horário de Funcionamento", content: [
          { label: "Horários", value: hours },
        ]},
      ].map((section, index) => (
        <motion.div 
          key={section.title}
          className="bg-white dark:bg-zinc-900 p-5 rounded-xl shadow-md"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 + index * 0.1 }}
        >
          <div className="flex justify-between items-center border-b pb-3 border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{section.title}</h3>
            <button className="text-blue-500 hover:text-blue-600 flex items-center gap-1">
              <FiEdit2 size={16} />
              Editar
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-zinc-700 dark:text-zinc-400">
            {section.content.map((item) => (
              <div key={item.label}>
                <span className="font-semibold">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

    </div>
  )
}
