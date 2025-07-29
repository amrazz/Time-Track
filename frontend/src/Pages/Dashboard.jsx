import React, { useState, useEffect } from "react";
import useApi from "../api/useApi";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AnimatePresence, motion } from "motion/react";
import Nav from "../Components/Nav";
import { Filter, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { X, Edit3, Circle, CheckCircle2, Save, Clock } from "lucide-react";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "pending",
    priority: "medium",
  });

  const api = useApi();
  const today = new Date().toISOString().split("T")[0];

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks/get-task");
      const tasksData = Array.isArray(response.data.task)
        ? response.data.task
        : [];
      setTasks(tasksData);
      setFilteredTasks(tasksData);
    } catch (error) {
      toast.error(`Error fetching tasks: ${error.message || "Unknown error"}`);
      console.error("Error fetching tasks:", error);
      setTasks([]);
      setFilteredTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    console.log(
      "Current user ID:",
      currentUser.id,
      "Full object:",
      currentUser
    );
    try {
      if (!newTask.title.trim()) return;
      const taskData = {
        ...newTask,
        user_id: currentUser.id,
        due_date: newTask.due_date
          ? new Date(newTask.due_date).toISOString()
          : null,
      };
      const response = await api.post("/tasks/create-task", taskData);
      if (response.data.status_code === 201) {
        await fetchTasks();
        setShowTaskModal(false);
        resetTaskForm();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await api.delete(`tasks/delete-task/${taskId}`);
      if (response.data.status_code === 200) {
        await fetchTasks();
      }
    } catch (error) {
      toast.error(`Error deleting task: ${error.message}`);

      console.error("Error deleting task:", error);
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await api.patch(`tasks/update-task/${taskId}`, updates);
      if (response.data.status_code === 200) {
        await fetchTasks();
        setEditingTask(null);
      }
    } catch (error) {
      toast.error(`Error updating task: ${error.message}`);

      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    let filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const resetTaskForm = () => {
    setNewTask({
      title: "",
      description: "",
      due_date: "",
      status: "pending",
      priority: "medium",
    });
  };
  const getCalendarEvents = () => {
    return tasks
      .map((task) => ({
        id: task.id || task._id,
        title: task.title,
        date: task.due_date
          ? new Date(task.due_date).toISOString().split("T")[0]
          : null,
        backgroundColor:
          task.priority === "high"
            ? "#ef4444"
            : task.priority === "medium"
            ? "#f59e0b"
            : "#10b981",
        borderColor:
          task.priority === "high"
            ? "#dc2626"
            : task.priority === "medium"
            ? "#d97706"
            : "#059669",
        extendedProps: {
          status: task.status,
          priority: task.priority,
          description: task.description,
        },
      }))
      .filter((event) => event.date);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-200"
    >
      <Nav setShowTaskModal={setShowTaskModal} />
      <div className="p-6">
        {/* Stats Cards */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tasks Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <Filter className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Search and Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="flex-1 py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3 max-h-96 overflow-y-auto">
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
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <motion.button
                              className="overflow-hidden"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateTask(task.id, {
                                  status:
                                    task.status === "completed"
                                      ? "pending"
                                      : "completed",
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
                                    : "text-gray-900"
                                }`}
                              >
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">
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
                                  <span className="text-xs text-gray-500">
                                    Due:{" "}
                                    {new Date(
                                      task.due_date
                                    ).toLocaleDateString()}
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
            </div>
          </motion.div>

          {/* Calendar Section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
              <p className="text-sm text-gray-600">View tasks by due date</p>
            </div>

            <div className="p-6">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={getCalendarEvents()}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth",
                }}
                height="auto"
                validRange={{
                  start: new Date().toISOString().split("T")[0],
                }}
                dayMaxEvents={3}
                eventDisplay="block"
                dateClick={(info) => {
                  setSelectedDate(info.dateStr);
                  setShowTaskModal(true);
                }}
                eventClick={(info) => {
                  const task = tasks.find(
                    (t) => (t.id || t._id) === info.event.id
                  );
                  if (task) setEditingTask(task);
                }}
                dayCellClassNames="hover:bg-gray-50 transition-colors cursor-pointer"
                eventClassNames="rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowTaskModal(false);
              resetTaskForm();
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
                <h3 className="text-lg font-semibold">Create New Task</h3>
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    resetTaskForm();
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  placeholder="Description (optional)"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 h-20"
                />

                <input
                  type="date"
                  min={today}
                  value={newTask.due_date}
                  onChange={(e) =>
                    setNewTask({ ...newTask, due_date: e.target.value })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>

                  <select
                    value={newTask.status}
                    onChange={(e) =>
                      setNewTask({ ...newTask, status: e.target.value })
                    }
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createTask}
                    disabled={!newTask.title.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
                  >
                    Create Task
                  </motion.button>
                  <button
                    onClick={() => {
                      setShowTaskModal(false);
                      resetTaskForm();
                    }}
                    className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingTask(null)}
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
                  onClick={() => setEditingTask(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  value={editingTask.description || ""}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 h-20"
                />

                <input
                  type="date"
                  min={today}
                  value={
                    editingTask.due_date
                      ? new Date(editingTask.due_date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, due_date: e.target.value })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={editingTask.priority}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        priority: e.target.value,
                      })
                    }
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>

                  <select
                    value={editingTask.status}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, status: e.target.value })
                    }
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateTask(editingTask.id, editingTask)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </motion.button>
                  <button
                    onClick={() => setEditingTask(null)}
                    className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {taskToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
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
                Are you sure you want to delete{" "}
                <strong>{taskToDelete.title}</strong>? This action cannot be
                undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setTaskToDelete(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    await deleteTask(taskToDelete.id);
                    setTaskToDelete(null);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Yes, Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .calendar-container .fc {
          font-family: inherit;
        }

        .calendar-container .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          color: #111827 !important;
        }

        .calendar-container .fc-button {
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          color: #475569 !important;
          border-radius: 0.5rem !important;
          padding: 0.375rem 0.75rem !important;
          font-weight: 500 !important;
          transition: all 0.2s !important;
        }

        .calendar-container .fc-button:hover {
          background: #e2e8f0 !important;
          border-color: #cbd5e1 !important;
          color: #334155 !important;
        }

        .calendar-container .fc-button-active {
          background: #3b82f6 !important;
          border-color: #2563eb !important;
          color: white !important;
        }

        .calendar-container .fc-event {
          border-radius: 0.25rem !important;
          padding: 1px 3px !important;
          margin: 1px 0 !important;
          font-size: 0.75rem !important;
        }

        .calendar-container .fc-day-today {
          background-color: #eff6ff !important;
        }
      `}</style>
    </motion.div>
  );
};

export default Dashboard;
