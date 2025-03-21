"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/client";
import { motion } from "framer-motion";

interface Category {
  id: number;
  name: string;
}

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("categories").select("*");

        if (error) throw new Error(error.message);
        setCategories((data as Category[]) || []);
      } catch (err) {
        setError("Erro ao carregar categorias.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-medium mb-2">Categoria *</label>

      <motion.div 
        whileFocus={{ scale: 1.02 }} 
        transition={{ duration: 0.2 }}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-700"
          disabled={loading}
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id.toString()}>
              {category.name}
            </option>
          ))}
        </select>
      </motion.div>

      {loading && <p className="text-sm text-gray-500 mt-2">Carregando categorias...</p>}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
