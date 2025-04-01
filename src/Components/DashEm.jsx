import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  getTodo,
  updateTodoStatus,
  updateUserDetails,
  changePassword,
} from "../apis/dashRequest";
import Sidenav from "./Sidenav";

const DashEm = () => {
  const [todos, setTodos] = useState([]);
  const [activeTab, setActiveTab] = useState("tasks");
  const { user, logout, login } = useUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    setProfileData({
      username: user.user.username,
      email: user.user.email || "",
    });

    const fetchTodos = async () => {
      try {
        const todosData = await getTodo();
        // Filter todos for the current employee
        const employeeTodos = todosData.filter(
          (todo) => todo.user_assigned_to === user.user.id
        );
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
      const data = await updateTodoStatus(todoId, newStatus);

      // Refresh todos after updating status
      const todosData = await getTodo();
      // Filter todos for the current employee
      const employeeTodos = todosData.filter(
        (todo) => todo.user_assigned_to === user.user.id
      );
      setTodos(employeeTodos);
    } catch (error) {
      console.error("Error updating todo status:", error);
      alert("Failed to update task status. Please try again.");
    }
  };

  // Add new handler for profile updates
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

  // Filter todos based on active tab and sort in reverse order
  const filteredTodos =
    activeTab === "tasks"
      ? [...todos].reverse() // Show all tasks in reverse order
      : activeTab === "pending"
      ? todos.filter((todo) => todo.status === "pending").reverse()
      : todos.filter((todo) => todo.status === "completed").reverse();

  const pendingCount = todos.filter((todo) => todo.status === "pending").length;
  const completedCount = todos.filter(
    (todo) => todo.status === "completed"
  ).length;

  if (!user) {
    return null;
  }

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

      {/* Main Content */}
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
                {activeTab === "tasks" && "My Tasks"}
                {activeTab === "completed" && "Completed Tasks"}
                {activeTab === "pending" && "Pending Tasks"}
                {activeTab === "profile" && "My Profile"}
              </h1>
              {activeTab === "tasks" ? (
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-400">
                    Total: {todos.length}
                  </span>
                  <span className="text-sm text-yellow-500">
                    {todos.filter((todo) => todo.status === "pending").length}{" "}
                    Pending
                  </span>
                  <span className="text-sm text-green-500">
                    {todos.filter((todo) => todo.status === "completed").length}{" "}
                    Completed
                  </span>
                </div>
              ) : activeTab === "pending" ? (
                <p className="text-sm text-gray-400 mt-1">
                  View your completed tasks
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-1">
                  View your completed tasks
                </p>
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
                              {user?.user?.first_name?.[0]?.toUpperCase() ||
                                user?.user?.username?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {user?.user?.first_name} {user?.user?.last_name}
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
                  className="bg-[#24262b] rounded-lg p-4 border border-gray-800 hover:border-purple-500/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-500">
                          {user?.user?.first_name?.[0]?.toUpperCase() ||
                            user?.user?.username?.[0]?.toUpperCase()}
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
          {activeTab === "pending" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTodos.map((todo, index) => (
                <div
                  key={index}
                  className="bg-[#24262b] rounded-lg p-4 border border-gray-800 hover:border-purple-500/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-500">
                          {user?.user?.first_name?.[0]?.toUpperCase() ||
                            user?.user?.username?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {user?.user?.first_name} {user?.user?.last_name}
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
                    <button
                      onClick={() => {
                        handleUpdateTodoStatus(todo.id, "completed");
                      }}
                      className="text-xs font-medium text-purple-500 hover:text-purple-400"
                    >
                      Mark as Complete
                    </button>
                  </div>
                </div>
              ))}
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

export default DashEm;
