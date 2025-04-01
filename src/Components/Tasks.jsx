import React, { useState, useEffect } from "react";
import Sidenav from "./Sidenav";
import { useUser } from "../context/UserContext";

function Tasks() {
  const [employees, setEmployees] = useState([]);
  const [todos, setTodos] = useState([]);
  const { user, logout } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodo();
        setTodos(data);
        console.log("Todos:", data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  });

  const handleCreateTodo = async (task, employee) => {
    try {
      const data = await createTodo(task, employee);
      try {
        const todosData = await getTodo();
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
      const data = await updateTodoStatus(todoId, newStatus);

      // Refresh todos after updating status
      const todosData = await getTodo();
      setTodos(todosData);
    } catch (error) {
      console.error("Error updating todo status:", error);
      alert("Failed to update task status. Please try again.");
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const data = await deleteTodo(todoId);
      // Refresh todos after deletion
      const todosData = await getTodo();
      // Filter todos for the current admin
      setTodos(todosData);
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const filteredTodos =
    activeTab === "tasks"
      ? [...todos].reverse() // Show all tasks in reverse order
      : todos.filter((todo) => todo.status === "completed").reverse();

  return (
    <div className="min-h-screen bg-[#1a1c1e] flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidenav
        isSidebarOpen={isSidebarOpen}
        user={user}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      <div className="flex-1 overflow-auto">
        <div className="p-4 lg:p-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

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
                    <span className="text-yellow-500">
                      {todos.filter((todo) => todo.status === "pending").length}{" "}
                      Pending
                    </span>
                    <span className="text-green-500">
                      {
                        todos.filter((todo) => todo.status === "completed")
                          .length
                      }{" "}
                      Completed
                    </span>
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
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Task
              </button>
            )}
          </div>

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
                            {(employees.find(
                              (emp) => emp.id === todo.user_assigned_to
                            )?.username || "?")[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {employees.find(
                            (emp) => emp.id === todo.user_assigned_to
                          )?.username || "Unassigned"}
                        </span>
                      </div>
                      <div
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          todo.status === "completed"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
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
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            handleUpdateTodoStatus(
                              todo.id,
                              todo.status === "completed"
                                ? "pending"
                                : "completed"
                            );
                          }}
                          className="text-xs font-medium text-purple-500 hover:text-purple-400"
                        >
                          {todo.status === "completed"
                            ? "Mark as Pending"
                            : "Mark as Complete"}
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-xs font-medium text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Task Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-[#24262b] rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white">
                      Create New Task
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
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
                    <label
                      htmlFor="todo"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Task Description
                    </label>
                    <div className="relative">
                      <textarea
                        id="todo"
                        name="todo"
                        rows="3"
                        className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500 resize-none pl-4 pr-4 py-3 transition-colors duration-200"
                        placeholder="Enter task description..."
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="employee"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Assign To
                    </label>
                    <div className="relative">
                      <select
                        id="employee"
                        name="employee"
                        className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-purple-500 focus:ring-purple-500 appearance-none pl-4 pr-10 py-3 transition-colors duration-200"
                        required
                      >
                        <option value="" className="text-gray-500">
                          Select team member...
                        </option>
                        {employees.map(
                          (employee, index) =>
                            employee.user_type === "employee" && (
                              <option
                                key={index}
                                value={employee.id}
                                className="text-white"
                              >
                                {employee.username}
                              </option>
                            )
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
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
}

export default Tasks;
