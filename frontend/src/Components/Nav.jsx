import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import timeTrack from "../assets/time-track-removebg-preview.png";
import { Bell, LogOut, Plus, Search, Settings, User } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

const Nav = ({ setShowTaskModal }) => {
  const [logoutModal, setLogoutModal] = useState(false);
  const { logout } = useAuth();
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 border-b border-gray-700 shadow-lg"
    >
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2"
        >
          <img
            src={timeTrack}
            alt="Time Track Logo"
            className="h-10 w-32 object-contain"
          />
        </motion.div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTaskModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Task</span>
          </motion.button>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors relative"
            >
              <LogOut className="w-5 h-5"
              onClick={() => setLogoutModal(true)}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center cursor-pointer">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-gray-800 rounded-full"></span>
            </motion.div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {logoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 bg-opacity-20 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            onClick={() => setLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Confirm Logout
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to Logout{" "}
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setLogoutModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => logout()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Yes, Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Nav;
