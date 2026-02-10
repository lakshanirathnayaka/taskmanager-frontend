import { useEffect, useState, useCallback } from "react";
import { Calendar, MapPin, Clock, Pencil, Trash2, Plus, LogOut, X, Search, CheckCircle } from "lucide-react";

function TaskDashboard({ onLogout, user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    task_name: "",
    location_name: "",
    task_date: "",
    task_time: "",
    completed: false,
  });

  const [searchType, setSearchType] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  const totalTasks = tasks.length;
  const upcomingTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  // Fetch tasks
  const fetchTasks = useCallback(async (type = null, query = "") => {
    if (!user) return;

    try {
      setLoading(true);
      setError("");

      let url = `${process.env.REACT_APP_BACKEND_URL}/tasks`;
      const headers = {
        "Authorization": `Bearer ${user.token}`
      };
      const params = new URLSearchParams();
      
      if (type === "date" && query) {
       params.append("task_date", query);
      } else if (type === "name" && query) {
        params.append("task_name", query);
      }

    if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, { headers });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch tasks");
        } else {
          const errorText = await res.text();
          throw new Error(`Error ${res.status}: ${errorText}`);
        }
      }

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user, fetchTasks]);

  // Delete task
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${user.token}` }
      });
      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((task) => task.task_id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle task completion status
  const toggleTaskStatus = async (task) => {
    try {
      const updatedStatus = !task.completed;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tasks/${task.task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${user.token}` },
        body: JSON.stringify({ ...task, completed: updatedStatus }),
      });

      if (!res.ok) throw new Error("Failed to update task status");

      setTasks(tasks.map(t => t.task_id === task.task_id ? { ...t, completed: updatedStatus } : t));
    } catch (err) {
      alert(err.message);
    }
  };

  // Open modal for new task
  const handleNewTask = () => {
    if (!user) {
      alert("Please login to add tasks");
      return;
    }
    setEditingId(null);
    setFormData({
      task_name: "",
      location_name: "",
      task_date: "",
      task_time: "",
      completed: false,
    });
    setShowModal(true);
  };

  // Open modal for editing task
  const handleEditTask = (task) => {
    setEditingId(task.task_id);
    
    // Format date to YYYY-MM-DD for input
    let d = task.task_date || "";
    if (d.includes("T")) d = d.split("T")[0];

    // Format time to HH:mm for input
    let t = task.task_time || "";
    if (t.length > 5) t = t.substring(0, 5);

    setFormData({
      task_name: task.task_name,
      location_name: task.location_name,
      task_date: d,
      task_time: t,
      completed: task.completed,
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit task (create or update)
  const handleSubmitTask = async (e) => {
    e.preventDefault();

    if (!formData.task_name.trim()) {
      alert("Task name can't be empty");
      return;
    }

    const taskData = {
      ...formData,
      
    };

    try {
      let res;
      const headers = { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      };
      if (editingId) {
        // Update existing task
         res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tasks/${editingId}`, {
          method: "PUT", headers, body: JSON.stringify(taskData),
        }); 
      } else {
        // Create new task
         res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tasks`, {
          method: "POST", headers, body: JSON.stringify(taskData),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save task");
      }

      // Refresh tasks
      await fetchTasks();
      
      // Close modal and reset form
      setShowModal(false);
      setEditingId(null);
      setFormData({
        task_name: "",
        location_name: "",
        task_date: "",
        task_time: "",
        completed: false,
      });
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Error saving task: " + error.message);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
            <div className="bg-blue-600 p-2.5 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Manage your tasks efficiently</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={handleNewTask}
              className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center shadow-sm">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Search by:</span>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSearchQuery("");
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
              <option value="name">Task Name</option>
              <option value="date">Date</option>
            </select>
          </div>

          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {searchType === 'date' ? <Calendar className="w-4 h-4 text-gray-500" /> : <Search className="w-4 h-4 text-gray-500" />}
            </div>
            <input
              type={searchType === 'date' ? 'date' : 'text'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder={searchType === 'name' ? "Search tasks..." : ""}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => fetchTasks(searchType, searchQuery)}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none w-full md:w-auto"
            >
              Search
            </button>
            <button
              onClick={() => {
                setSearchQuery("");
                fetchTasks();
              }}
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 w-full md:w-auto"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Tasks */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tasks</h3>
            <p className="text-4xl font-bold text-gray-900">{totalTasks}</p>
          </div>

          {/* Upcoming */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Upcoming</h3>
            <p className="text-4xl font-bold text-blue-600">{upcomingTasks}</p>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Completed</h3>
            <p className="text-4xl font-bold text-green-600">{completedTasks}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks yet. Create your first task!</p>
          </div>
        ) : (
          /* Task Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.task_id}
                className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow ${task.completed ? "opacity-75" : ""}`}
              >
                <div className="flex justify-between items-start mb-4">
                  {/* Task Title */}
                  <h3 className={`text-xl font-bold pb-3 border-b-4 border-blue-600 inline-block ${task.completed ? "line-through text-gray-500 border-gray-300" : "text-gray-900"}`}>
                    {task.task_name}
                  </h3>

                  {/* Completion Circle */}
                  <button 
                    onClick={() => toggleTaskStatus(task)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Clock className="w-6 h-6 text-yellow-500" />
                    )}
                  </button>
                </div>

                {/* Task Details */}
                <div className="space-y-3 mt-6 mb-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">{task.location_name || "No location"}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-sm">{task.task_date || "No date"}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">{task.task_time || "No time"}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.task_id)}
                    className="flex items-center justify-center gap-2 border border-red-300 text-red-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal for Add/Edit Task */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? "Edit Task" : "New Task"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Name *
                </label>
                <input
                  type="text"
                  name="task_name"
                  value={formData.task_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location_name"
                  value={formData.location_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="task_date"
                  value={formData.task_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  name="task_time"
                  value={formData.task_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {editingId ? "Update Task" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDashboard;