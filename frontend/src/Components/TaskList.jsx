import React from "react";
import {motion, AnimatePresence} from 'motion/react'
import { Edit3, Trash2 } from "lucide-react";

const TaskList = ({ filteredTasks, loading, getStatusIcon, getPriorityColor, setEditingTask, setTaskToDelete, validateAndUpdateTask }) => {
  return (
    <div>
      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-8"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </motion.div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 text-gray-500"
          >
            No tasks found
          </motion.div>
        ) : (
          filteredTasks.map((task, index) => (
            <motion.div
              key={task.id || task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <motion.button
                    className="overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      validateAndUpdateTask(task.id, {
                        status:
                          task.status === "completed" ? "pending" : "completed",
                      })
                    }
                  >
                    {getStatusIcon(task.status)}
                  </motion.button>

                  <div className="flex-1">
                    <h3
                      className={`font-medium ${
                        task.status === "completed"
                          ? "line-through text-gray-500"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-white mt-1">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-2 mt-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      {task.due_date && (
                        <span className="text-xs text-white">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 ml-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditingTask(task)}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTaskToDelete(task)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
