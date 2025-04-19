import { supabase } from "@/lib/client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ProfileData = {
  store_image_url?: string;
  store_name?: string;
};

export function Profile() {
  const [data, setData] = useState<ProfileData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileAndStore = async () => {
      setLoading(true);
      setError(null);

      try {

        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) {
          setError("Você precisa estar logado para ver sua loja.");
          return;
        }

        const user = authData.user;

        const { data: owner, error: ownerErr } = await supabase
          .from("owners")
          .select("id")
          .eq("user_id", user.id)
          .single();
        if (ownerErr || !owner) {
          throw new Error(ownerErr?.message || "Owner não encontrado");
        }

        const { data: store, error: storeErr } = await supabase
          .from("stores")
          .select("id, name, image_url")
          .eq("owner_id", owner.id)
          .single();
        if (storeErr || !store) {
          throw new Error(storeErr?.message || "Loja não encontrada");
        }

        setData({
          store_image_url: store.image_url,
          store_name: store.name,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndStore();
  }, []);

  if (loading) {
    return <div className="px-4 py-2">Carregando perfil da loja...</div>;
  }

  if (error) {
    return <div className="px-4 py-2 text-red-600">Erro: {error}</div>;
  }

  if (!data.store_name) {
    return null;
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="flex items-center gap-4 px-5 py-4 mx-4 mb-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm border border-gray-200"
    >
      <img
        src={
          data.store_image_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            data.store_name
          )}&background=random`
        }
        className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
        alt="Store image"
      />

      <div className="overflow-hidden">
        <p className="text-base font-medium text-gray-800 truncate">
          {data.store_name}
        </p>
      </div>
    </motion.div>
  );
}
