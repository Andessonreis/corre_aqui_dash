import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bell, X } from "lucide-react";

interface SidebarHeaderProps {
  isDesktop?: boolean;
  isOpen?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  notificationCount: number;
}

export function SidebarHeader({ isDesktop, setIsOpen, notificationCount }: SidebarHeaderProps) {
  return (
    <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center flex-1"
      >
        <span className="text-2xl font-bold text-gray-900">
          <span className="text-red-500 mr-1">Corre</span>
          <span>Aqui</span>
        </span>

        <div className="relative ml-27">
          <Link href="/dashboard/notifications">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
            >
              <Bell className="h-6 w-6 text-gray-500" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {!isDesktop && (
        <button
          onClick={() => setIsOpen(false)}
          className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-gray-100"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
      )}
    </div>
  );
}
