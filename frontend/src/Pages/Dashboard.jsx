import React, { useState, useEffect } from "react";
import useApi from "../api/useApi";
import { AnimatePresence, motion } from "motion/react";
import Nav from "../Components/Nav";
import { Filter, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { X, Edit3, Circle, CheckCircle2, Save, Clock } from "lucide-react";
import CalendarCom from "../Components/CalendarCom";
import DeleteConfirmationModal from "../Components/DeleteConfirmationModal";
import EditTaskModal from "../Components/EditTaskModal";
import CreateTaskModal from "../Components/CreateTaskModal";
import TaskList from "../Components/TaskList";

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
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "",
    status: "",
  });

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
      console.error("Error fetching tasks:", error);
      setTasks([]);
      setFilteredTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const validateAndCreateTask = async () => {
    const newErrors = {
      title: "",
      description: "",
      due_date: "",
      priority: "",
      status: "",
    };

    let isValid = true;

    // Validate title
    if (!newTask.title.trim()) {
      newErrors.title = "Task title is required";
      isValid = false;
    } else if (newTask.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
      isValid = false;
    }

    // Validate description
    if (newTask.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
      isValid = false;
    }

    if (selectedDate) {
      newTask.due_date = selectedDate;
    }

    // Validate due date
    if (!newTask.due_date) {
      newErrors.due_date = "Due date is required";
      isValid = false;
    } else {
      const selectedDate = new Date(newTask.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.due_date = "Due date cannot be in the past";
        isValid = false;
      }
    }

    // Validate priority
    if (!newTask.priority) {
      newErrors.priority = "Priority is required";
      isValid = false;
    }

    // Validate status
    if (!newTask.status) {
      newErrors.status = "Status is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      return;
    }

    // Proceed with task creation if validation passes
    try {
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
        setErrors({
          title: "",
          description: "",
          due_date: "",
          priority: "",
          status: "",
        });
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

  const validateAndUpdateTask = async (taskId, updates) => {
    console.log("brooo");
    const newErrors = {
      title: "",
      description: "",
      due_date: "",
      priority: "",
      status: "",
    };

    let isValid = true;

    // Validate title
    if (updates.title && !updates.title.trim()) {
      newErrors.title = "Task title is required";
      isValid = false;
    } else if (updates.title && updates?.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
      isValid = false;
    }

    // Validate description
    if (updates.description && updates.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
      isValid = false;
    }

    // Validate due date
    if (updates.due_date && !updates.due_date) {
      newErrors.due_date = "Due date is required";
      isValid = false;
    } else {
      const selectedDate = new Date(updates.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.due_date = "Due date cannot be in the past";
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (!isValid) {
      return;
    }

    try {
      const response = await api.patch(`tasks/update-task/${taskId}`, updates);
      if (response.data.status_code === 200) {
        await fetchTasks();
        setEditingTask(null);
        setErrors({
          title: "",
          description: "",
          due_date: "",
          priority: "",
          status: "",
        });
        toast.success("Task updated successfully");
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
      .map((task) => {
        const dueDate = task.due_date ? new Date(task.due_date) : null;

        if (!dueDate || isNaN(dueDate.getTime())) {
          return null;
        }

        return {
          id: task.id || task._id,
          title: task.title,
          start: dueDate.toISOString(),
          allDay: true,
          extendedProps: {
            description: task.description,
            priority: task.priority,
            status: task.status,
          },
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
          textColor: "#ffffff",
          className: `priority-${task.priority} status-${task.status}`,
        };
      })
      .filter((event) => event !== null);
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
      className="min-h-screen bg-gradient-to-tr from-gray-300 to-gray-800"
    >
      <Nav setShowTaskModal={setShowTaskModal} />
      <div className="p-6">
        {/* Stats Cards */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          {/* Tasks Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className=" rounded-2xl shadow-sm border border-gray-100 bg-gray-800"
          >
            <div className="p-6 border-b border-gray-100 bg-gray-800 rounded-2xl">
              <div className="flex items-center justify-center mb-4">
                <h2 className="text-2xl text-center font-semibold text-white">
                  TASKS
                </h2>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-gray-400 bg-transparent"
                  />
                </div>

                <div className="flex space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="all" className="text-black">
                      All Status
                    </option>
                    <option value="pending" className="text-black">
                      Pending
                    </option>
                    <option value="in-progress" className="text-black">
                      In Progress
                    </option>
                    <option value="completed" className="text-black">
                      Completed
                    </option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="flex-1 py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="all" className="text-black">
                      All Priority
                    </option>
                    <option value="high" className="text-black">
                      High
                    </option>
                    <option value="medium" className="text-black">
                      Medium
                    </option>
                    <option value="low" className="text-black">
                      Low
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-800">
              <div className="space-y-3 max-h-[30rem] overflow-y-auto ">
                <TaskList
                  filteredTasks={filteredTasks}
                  loading={loading}
                  setEditingTask={setEditingTask}
                  setTaskToDelete={setTaskToDelete}
                  validateAndUpdateTask={validateAndUpdateTask}
                  getStatusIcon={getStatusIcon}
                  getPriorityColor={getPriorityColor}
                />
              </div>
            </div>
          </motion.div>

          {/* Calendar Section */}
          <CalendarCom
            getCalendarEvents={getCalendarEvents}
            setSelectedDate={setSelectedDate}
            setShowTaskModal={setShowTaskModal}
            setEditingTask={setEditingTask}
            tasks={tasks}
          />
        </div>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <CreateTaskModal
            isOpen={showTaskModal}
            setShowTaskModal={setShowTaskModal}
            onCreate={validateAndCreateTask}
            resetTaskForm={resetTaskForm}
            newTask={newTask}
            setNewTask={setNewTask}
            errors={errors}
            setErrors={setErrors}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            setTask={setEditingTask}
            onClose={() => setEditingTask(null)}
            onSave={validateAndUpdateTask}
            errors={errors}
            setErrors={setErrors}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {taskToDelete && (
          <DeleteConfirmationModal
            task={taskToDelete}
            onClose={() => setTaskToDelete(null)}
            onConfirm={async () => {
              await deleteTask(taskToDelete.id);
              setTaskToDelete(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
