// src/components/Sidebar/Profile.tsx
import { LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export interface ProfileProps {}

export function Profile() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [userData, setUserData] = useState<{
    profile_image_url?: string;
    name?: string;
    email?: string;
  }>({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("profile_image_url, name, email")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setUserData(data);
        } else {
          setUserData({
            profile_image_url: user.user_metadata.avatar_url,
            name: user.user_metadata.full_name || user.email,
            email: user.email,
          });
        }
      }
    };

    fetchUserData();
  }, [user, supabase]);

  if (!user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <img
        src={
          userData.profile_image_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            userData.name || "User"
          )}&background=random`
        }
        className="h-10 w-10 rounded-full"
        alt="User avatar"
      />

      {/* Informações do usuário */}
      <div className="flex flex-col truncate">
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-100 truncate">
          {userData.name}
        </span>
        <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
          {userData.email}
        </span>
      </div>

      {/* Botão de logout */}
      <Button 
        variant="ghost" 
        className="ml-auto p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200" />
      </Button>
    </div>
  );
}
