import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("tasks");
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      console.log("user", user);
    }
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://3.109.152.120:8000/apis/todos/");
        const data = await response.json();
        setTodos(data);
        console.log("Todos:", data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://3.109.152.120:8000/apis/get-users/");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchTodos();
    fetchEmployees();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCreateTodo = async (task, employee) => {
    try {
      const response = await fetch("http://3.109.152.120:8000/apis/create-todo/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: task,
          employee: parseInt(employee),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Server error response:", errorData);
        throw new Error(`Error creating task: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Task created successfully:", data);
      
      // Refresh todos after creating new task
      try {
        const todosResponse = await fetch("http://3.109.152.120:8000/apis/todos/");
        const todosData = await todosResponse.json();
        setTodos(todosData);
      } catch (error) {
        console.error("Error refreshing todos:", error);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleUpdateTodoStatus = async (todoId, newStatus) => {
    try {
      const response = await fetch(`http://3.109.152.120:8000/apis/update-todo-status/${todoId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Server error response:", errorData);
        throw new Error(`Error updating task: ${response.status}`);
      }

      // Refresh todos after updating status
      const todosResponse = await fetch("http://3.109.152.120:8000/apis/todos/");
      const todosData = await todosResponse.json();
      setTodos(todosData);
    } catch (error) {
      console.error("Error updating todo status:", error);
      alert("Failed to update task status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1c1e] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#24262b] border-r border-gray-800">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
              <img
                className="h-12 w-12 rounded-full"
                src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                alt="User"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{user.username}</h2>
              <p className="text-sm text-gray-400">{user.user_type}</p>
            </div>
          </div>
          <nav className="space-y-2">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("tasks");
              }}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                activeTab === "tasks" 
                  ? "bg-purple-500/10 text-purple-500" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              All Tasks
            </a>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("completed");
              }}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                activeTab === "completed" 
                  ? "bg-purple-500/10 text-purple-500" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </a>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white mt-4"
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === "tasks" && "All Tasks"}
                {activeTab === "completed" && "Completed Tasks"}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === "tasks" && (
                  <div className="flex items-center space-x-4">
                    <span>Total: {todos.length}</span>
                    <span className="text-yellow-500">{todos.filter(todo => todo.status === "pending").length} Pending</span>
                    <span className="text-green-500">{todos.filter(todo => todo.status === "completed").length} Completed</span>
                  </div>
                )}
                {activeTab === "completed" && "View completed tasks"}
              </p>
            </div>
            {activeTab === "tasks" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Task
              </button>
            )}
          </div>

          {activeTab === "tasks" && (
            <div className="w-full">
              {/* Tasks Section */}
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {todos.map((todo, index) => (
                    <div
                      key={index}
                      className="bg-[#24262b] rounded-lg p-4 border border-gray-800 hover:border-purple-500/50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-500">
                              {(employees.find((emp) => emp.id === todo.user_assigned_to)?.username || "?")[0].toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {employees.find((emp) => emp.id === todo.user_assigned_to)?.username || "Unassigned"}
                          </span>
                        </div>
                        <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          todo.status === "completed" 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}>
                          {todo.status === "completed" ? "Completed" : "Pending"}
                        </div>
                      </div>
                      <p className="text-white text-sm line-clamp-2 mb-3">
                        {todo.task}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                        <span className="text-xs text-gray-500">
                          {new Date().toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => {
                            handleUpdateTodoStatus(todo.id, todo.status === "completed" ? "pending" : "completed");
                          }}
                          className="text-xs font-medium text-purple-500 hover:text-purple-400"
                        >
                          {todo.status === "completed" ? "Mark as Pending" : "Mark as Complete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "completed" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todos
                .filter(todo => todo.status === "completed")
                .map((todo, index) => (
                  <div
                    key={index}
                    className="bg-[#24262b] rounded-lg p-4 border border-gray-800"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-500">
                            {(employees.find((emp) => emp.id === todo.user_assigned_to)?.username || "?")[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {employees.find((emp) => emp.id === todo.user_assigned_to)?.username || "Unassigned"}
                        </span>
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                        Completed
                      </div>
                    </div>
                    <p className="text-white text-sm line-clamp-2 mb-3">
                      {todo.task}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <span className="text-xs text-gray-500">
                        {new Date().toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => {
                          handleUpdateTodoStatus(todo.id, "pending");
                        }}
                        className="text-xs font-medium text-purple-500 hover:text-purple-400"
                      >
                        Mark as Pending
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Add Task Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#24262b] rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">Create New Task</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const task = e.target.todo.value;
                    const employee = e.target.employee.value;
                    handleCreateTodo(task, employee);
                    setIsModalOpen(false);
                    e.target.reset();
                  }}
                  className="p-6 space-y-6"
                >
                  <div>
                    <label htmlFor="todo" className="block text-sm font-medium text-gray-300 mb-2">
                      Task Description
                    </label>
                    <input
                      type="text"
                      id="todo"
                      name="todo"
                      className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter new task..."
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="employee" className="block text-sm font-medium text-gray-300 mb-2">
                      Assign To
                    </label>
                    <select
                      id="employee"
                      name="employee"
                      className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-purple-500 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select team member...</option>
                      {employees.map((employee, index) => (
                        employee.user_type === "employee" && (
                          <option key={index} value={employee.id}>
                            {employee.username}
                          </option>
                        )
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      Create Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
