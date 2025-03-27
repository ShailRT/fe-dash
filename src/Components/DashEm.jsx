import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const DashEm = () => {
  const [todos, setTodos] = useState([]);
  const [activeTab, setActiveTab] = useState("tasks");
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchTodos = async () => {
      try {
        const response = await fetch("http://3.109.152.120:8000/apis/todos/");
        const data = await response.json();
        // Filter todos for the current employee
        const employeeTodos = data.filter(todo => todo.user_assigned_to === user.user.id);
        setTodos(employeeTodos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
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
      // Filter todos for the current employee
      const employeeTodos = todosData.filter(todo => todo.user_assigned_to === user.user.id);
      setTodos(employeeTodos);
    } catch (error) {
      console.error("Error updating todo status:", error);
      alert("Failed to update task status. Please try again.");
    }
  };

  // Filter todos based on active tab
  const filteredTodos = activeTab === "tasks" 
    ? todos.filter(todo => todo.status === "pending")
    : todos.filter(todo => todo.status === "completed");

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a1c1e] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#24262b] border-r border-gray-800">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-lg font-semibold text-white">
                {user?.user?.first_name?.[0]?.toUpperCase() || user?.user?.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {user?.user?.first_name} {user?.user?.last_name}
              </h2>
              <p className="text-sm text-gray-400">{user?.user?.user_type}</p>
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
              My Tasks
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
                {activeTab === "tasks" && "My Tasks"}
                {activeTab === "completed" && "Completed Tasks"}
              </h1>
              {activeTab === "tasks" ? (
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-400">Total: {todos.length}</span>
                  <span className="text-sm text-yellow-500">{todos.filter(todo => todo.status === "pending").length} Pending</span>
                  <span className="text-sm text-green-500">{todos.filter(todo => todo.status === "completed").length} Completed</span>
                </div>
              ) : (
                <p className="text-sm text-gray-400 mt-1">View your completed tasks</p>
              )}
            </div>
          </div>

          {activeTab === "tasks" && (
            <div className="w-full">
              {/* Tasks Section */}
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTodos.map((todo, index) => (
                    <div
                      key={index}
                      className="bg-[#24262b] rounded-lg p-4 border border-gray-800 hover:border-purple-500/50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-500">
                              {user?.user?.first_name?.[0]?.toUpperCase() || user?.user?.username?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {user?.user?.first_name} {user?.user?.last_name}
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
              {filteredTodos.map((todo, index) => (
                <div
                  key={index}
                  className="bg-[#24262b] rounded-lg p-4 border border-gray-800"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-500">
                          {user?.user?.first_name?.[0]?.toUpperCase() || user?.user?.username?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {user?.user?.first_name} {user?.user?.last_name}
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
        </div>
      </div>
    </div>
  );
};

export default DashEm;
