import React from "react";
import { motion } from "motion/react";

const DeleteConfirmationModal = ({ task, onClose, onConfirm }) => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/10 bg-opacity-20 backdrop-blur-xl flex items-center justify-center z-50 p-4"
        onClick={() => setTaskToDelete(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 w-full max-w-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Confirm Delete
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete <strong>{task.title}</strong>? This
            action cannot be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
              Yes, Delete
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmationModal;
