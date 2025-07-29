import React from "react";
import { motion } from "motion/react";
import timeTrack from "../assets/time-track-removebg-preview.png";
import { Bell, Plus, Search, Settings, User } from "lucide-react";

const Nav = ({ setShowTaskModal }) => {
  return (
    <div>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
      >
        <div className="px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="h-20 w-20 md:h-20 md:w-32 rounded-xl flex items-center justify-center"
            >
              <img
                src={timeTrack}
                alt="Time Track Logo"
                className="object-contain h-32 w-full"
              />
            </motion.div>
          </div>

          {/* Search Bar */}

          <div className="flex items-center space-x-3 md:space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTaskModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all text-sm md:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </motion.button>

            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </motion.header>
    </div>
  );
};

export default Nav;
