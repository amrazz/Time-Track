import React from "react";
import { motion } from "motion/react";
import { Save, X } from "lucide-react";

const EditTaskModal = ({
  task,
  setTask,
  onClose,
  onSave,
  errors,
  setErrors,
}) => {
    const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/10 bg-opacity-20 backdrop-blur-xl flex items-center justify-center z-50 p-4"
        onClick={() => {
          setTask(null);
          setErrors({
            title: "",
            description: "",
            due_date: "",
            priority: "",
            status: "",
          });
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Edit Task</h3>
            <button
              onClick={() => {
                setTask(null);
                setErrors({
                  title: "",
                  description: "",
                  due_date: "",
                  priority: "",
                  status: "",
                });
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={task.title}
                onChange={(e) => {
                  setTask({ ...task, title: e.target.value });
                  if (e.target.value.trim()) {
                    setErrors({ ...errors, title: "" });
                  }
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <textarea
                value={task.description || ""}
                onChange={(e) => {
                  setTask({
                    ...task,
                    description: e.target.value,
                  });
                  if (e.target.value.length <= 500) {
                    setErrors({ ...errors, description: "" });
                  }
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-20 ${
                  errors.description ? "border-red-500" : "border-gray-200"
                }`}
              />
              <div className="flex justify-between">
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
                <span
                  className={`text-xs ${
                    task.description?.length > 500
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {task.description?.length || 0}/500
                </span>
              </div>
            </div>

            <div>
              <input
                type="date"
                min={today}
                value={
                  task.due_date
                    ? new Date(task.due_date).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  setTask({
                    ...task,
                    due_date: e.target.value,
                  });
                  if (e.target.value) {
                    setErrors({ ...errors, due_date: "" });
                  }
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.due_date ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.due_date && (
                <p className="mt-1 text-sm text-red-500">{errors.due_date}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <select
                  value={task.priority}
                  onChange={(e) => {
                    setTask({
                      ...task,
                      priority: e.target.value,
                    });
                    setErrors({ ...errors, priority: "" });
                  }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.priority ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-500">{errors.priority}</p>
                )}
              </div>

              <div>
                <select
                  value={task.status}
                  onChange={(e) => {
                    setTask({
                      ...task,
                      status: e.target.value,
                    });
                    setErrors({ ...errors, status: "" });
                  }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.status ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSave(task.id, task)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </motion.button>
              <button
                onClick={() => {
                  setTask(null);
                  setErrors({
                    title: "",
                    description: "",
                    due_date: "",
                    priority: "",
                    status: "",
                  });
                }}
                className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EditTaskModal;
