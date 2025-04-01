import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  getTodo,
  getEmployees,
  createTodo,
  deleteTodo,
  updateTodoStatus,
  getTeamMembers,
  getTeamTasks,
  getTeambyManager,
  updateUserDetails,
  changePassword,
} from "../apis/dashRequest";
import Sidenav from "./Sidenav";

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [employees, setEmployees] = useState([]);
  const { user, logout, login } = useUser();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks");
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      console.log("user", user);
    }
    setProfileData({
      username: user.user.username,
      email: user.user.email || "",
    });
    const fetchTodos = async () => {
      try {
        const data = await getTodo();
        setTodos(data);
        console.log("Todos:", data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    const fetchTeam = async () => {
      try {
        const data = await getTeambyManager(user.user.id);
        console.log("Team:", data);
        setTeamMembers(data.members);
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };
    fetchTeam();
    fetchTodos();
    fetchEmployees();
  }, [user, navigate]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCreateTodo = async (task, employee) => {
    try {
      const data = await createTodo(task, employee, user.user.id);
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = await updateUserDetails(profileData, user.user.id);
      console.log("updated user details:", data);
      login(data);
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("New password and confirm password do not match!");
        return;
      }

      const data = await changePassword(passwordData, user.user.id);
      setIsPasswordModalOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
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

  // Filter todos based on active tab and sort in reverse order
  const filteredTodos =
    activeTab === "tasks"
      ? [...todos]
          .filter(
            (todo) =>
              teamMembers.includes(todo.user_assigned_to) ||
              todo.user_assigned_to === user.user.id // Include manager's own tasks
          )
          .reverse() // Show all tasks in reverse order
      : activeTab === "pending"
      ? todos
          .filter(
            (todo) =>
              todo.status === "pending" &&
              (teamMembers.includes(todo.user_assigned_to) ||
                todo.user_assigned_to === user.user.id) // Include manager's pending tasks
          )
          .reverse()
      : todos
          .filter(
            (todo) =>
              todo.status === "completed" &&
              (teamMembers.includes(todo.user_assigned_to) ||
                todo.user_assigned_to === user.user.id) // Include manager's completed tasks
          )
          .reverse();
  const pendingCount = todos.filter((todo) => todo.status === "pending").length;
  const completedCount = todos.filter(
    (todo) => todo.status === "completed"
  ).length;

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
                {activeTab === "members" && "My Team"}
                {activeTab === "pending" && "Pending Tasks"}
                {activeTab === "profile" && "My Profile"}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === "tasks" && (
                  <div className="flex items-center space-x-4">
                    <span>
                      Total:{" "}
                      {
                        todos.filter((todo) =>
                          teamMembers.includes(todo.user_assigned_to)
                        ).length
                      }
                    </span>
                    <span className="text-yellow-500">
                      {
                        todos.filter(
                          (todo) =>
                            todo.status === "pending" &&
                            teamMembers.includes(todo.user_assigned_to)
                        ).length
                      }{" "}
                      Pending
                    </span>
                    <span className="text-green-500">
                      {
                        todos.filter(
                          (todo) =>
                            todo.status === "completed" &&
                            teamMembers.includes(todo.user_assigned_to)
                        ).length
                      }{" "}
                      Completed
                    </span>
                  </div>
                )}
                {activeTab === "pending" && (
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-yellow-500">
                  {
                        todos.filter(
                          (todo) =>
                            todo.status === "pending" &&
                            teamMembers.includes(todo.user_assigned_to)
                        ).length
                      }{" "}
                    Pending Tasks
                  </span>
                </div>
              )}
                {activeTab === "completed" && "View completed tasks"}
                {activeTab === "members" && `View Team Members`}
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
                          {todo.status === "completed"
                            ? "Completed"
                            : "Pending"}
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
          )}
          {activeTab === "pending" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTodos.map((todo, index) => (
                <div
                  key={index}
                  className="bg-[#24262b] rounded-lg p-4 border border-gray-800 hover:border-yellow-500/50 transition-all duration-200"
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
                    <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                      Pending
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
                          handleUpdateTodoStatus(todo.id, "completed");
                        }}
                        className="text-xs font-medium text-purple-500 hover:text-purple-400"
                      >
                        Mark as Complete
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

          {/* Team Section */}
          {activeTab === "members" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((memberId, index) => {
                  // Find the employee details from the employees array
                  const member = employees.find((emp) => emp.id === memberId);
                  if (!member) return null; // Skip if member not found

                  return (
                    <div
                      key={index}
                      className="bg-[#24262b] rounded-lg border border-gray-800 p-6 hover:border-purple-500/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <span className="text-xl font-medium text-purple-500">
                            {member.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            {member.username}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {member.user_type}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="text-2xl font-semibold text-purple-500">
                            {
                              todos.filter(
                                (todo) => todo.user_assigned_to === member.id
                              ).length
                            }
                          </div>
                          <div className="text-sm text-gray-400">
                            Assigned Tasks
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="text-2xl font-semibold text-green-500">
                            {
                              todos.filter(
                                (todo) =>
                                  todo.user_assigned_to === member.id &&
                                  todo.status === "completed"
                              ).length
                            }
                          </div>
                          <div className="text-sm text-gray-400">Completed</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
                        {employees
                          .filter(
                            (employee) =>
                              employee.user_type === "employee" &&
                              teamMembers.includes(employee.id)
                          )
                          .map((employee, index) => (
                            <option
                              key={index}
                              value={employee.id}
                              className="text-white"
                            >
                              {employee.username}
                            </option>
                          ))}
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

          {/* Add Profile Section */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div className="bg-[#24262b] rounded-lg border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Profile
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Manage your account settings
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
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
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                      Change Password
                    </button>
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400">
                        Username
                      </label>
                      <p className="mt-1 text-white">{user.user.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">
                        Email
                      </label>
                      <p className="mt-1 text-white">
                        {user.user.email || "Not set"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">
                        Role
                      </label>
                      <p className="mt-1 text-white capitalize">
                        {user.user.user_type}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400">
                        Account Created
                      </label>
                      <p className="mt-1 text-white">
                        {new Date(user.user.date_joined).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400">
                        Last Login
                      </label>
                      <p className="mt-1 text-white">
                        {new Date(user.user.last_login).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isProfileModalOpen && (
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white">
                      Edit Profile
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsProfileModalOpen(false)}
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
                <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          username: e.target.value,
                        })
                      }
                      className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-2.5"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-2.5"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setIsProfileModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Password Change Modal */}
          {isPasswordModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-[#24262b] rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white">
                      Change Password
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
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
                <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPasswordModalOpen(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                    >
                      Update Password
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
