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
import DashHeader from "./DashHeader";
import PendingTodo from "./PendingTodo";
import TodoCard from "./TodoCard";
import CompletedTodo from "./CompletedTodo";
import Team from "./Team";
import Profile from "./Profile";

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
  

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      console.log("user", user);
    }
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
        const data = await getTeambyManager(user.id);
        console.log("Team:", data);
        setTeamMembers(data.members || []);
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
      const data = await createTodo(task, employee, user.id);
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

  // Filter todos based on active tab and sort in reverse order
  const filteredTodos =
    activeTab === "tasks"
      ? todos
          .filter(
            (todo) =>
              teamMembers?.includes(todo.user_assigned_to) ||
              todo.user_assigned_to === user.id // Include manager's pending tasks
          )
          .reverse() // Show all tasks in reverse order
      : activeTab === "pending"
      ? todos
          .filter(
            (todo) =>
              todo.status === "pending" &&
              (teamMembers?.includes(todo.user_assigned_to) ||
                todo.user_assigned_to === user.id) // Include manager's pending tasks
          )
          .reverse()
      : todos
          .filter(
            (todo) =>
              todo.status === "completed" &&
              (teamMembers?.includes(todo.user_assigned_to) ||
                todo.user_assigned_to === user.id) // Include manager's completed tasks
          )
          .reverse();
  const totalCount = todos.filter(
    (todo) =>
      teamMembers?.includes(todo.user_assigned_to) ||
      todo.user_assigned_to === user.id
  ).length;
  const pendingCount = todos.filter(
    (todo) =>
      todo.status === "pending" &&
      (teamMembers?.includes(todo.user_assigned_to) ||
        todo.user_assigned_to === user.id)
  ).length;
  const completedCount = todos.filter(
    (todo) =>
      todo.status === "completed" &&
      (teamMembers?.includes(todo.user_assigned_to) ||
        todo.user_assigned_to === user.id)
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
          <DashHeader
            setIsSidebarOpen={setIsSidebarOpen}
            activeTab={activeTab}
            setIsModalOpen={setIsModalOpen}
            totalCount={totalCount}
            pendingCount={pendingCount}
            completedCount={completedCount}
            role={user.user_type}
          />

          {activeTab === "tasks" && (
            <div className="w-full">
              {/* Tasks Section */}
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTodos.map((todo, index) => (
                    <TodoCard
                      key={index}
                      todo={todo}
                      user={user}
                      handleUpdateTodoStatus={handleUpdateTodoStatus}
                      handleDeleteTodo={handleDeleteTodo}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "pending" && (
            <PendingTodo
              filteredTodos={filteredTodos}
              user={user}
              handleUpdateTodoStatus={handleUpdateTodoStatus}
              handleDeleteTodo={handleDeleteTodo}
            />
          )}
          {activeTab === "completed" && (
            <CompletedTodo
              filteredTodos={filteredTodos}
              user={user}
              handleUpdateTodoStatus={handleUpdateTodoStatus}
              handleDeleteTodo={handleDeleteTodo}
            />
          )}

          {/* Team Section */}
          {activeTab === "members" && (
            <Team
              teamMembers={teamMembers}
              employees={employees}
              todos={todos}
            />
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
            <Profile user={user} />
            // <div className="space-y-8">
            //   <div className="bg-[#24262b] rounded-lg border border-gray-800 p-6">
            //     <div className="flex items-center justify-between mb-6">
            //       <div>
            //         <h2 className="text-xl font-semibold text-white">
            //           Profile
            //         </h2>
            //         <p className="text-sm text-gray-400 mt-1">
            //           Manage your account settings
            //         </p>
            //       </div>
            //       <div className="flex space-x-3">
            //         <button
            //           onClick={() => setIsPasswordModalOpen(true)}
            //           className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            //         >
            //           <svg
            //             className="w-5 h-5 mr-2"
            //             fill="none"
            //             stroke="currentColor"
            //             viewBox="0 0 24 24"
            //           >
            //             <path
            //               strokeLinecap="round"
            //               strokeLinejoin="round"
            //               strokeWidth={2}
            //               d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            //             />
            //           </svg>
            //           Change Password
            //         </button>
            //         <button
            //           onClick={() => setIsProfileModalOpen(true)}
            //           className="inline-flex items-center px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            //         >
            //           <svg
            //             className="w-5 h-5 mr-2"
            //             fill="none"
            //             stroke="currentColor"
            //             viewBox="0 0 24 24"
            //           >
            //             <path
            //               strokeLinecap="round"
            //               strokeLinejoin="round"
            //               strokeWidth={2}
            //               d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            //             />
            //           </svg>
            //           Edit Profile
            //         </button>
            //       </div>
            //     </div>

            //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            //       <div className="space-y-4">
            //         <div>
            //           <label className="block text-sm font-medium text-gray-400">
            //             Username
            //           </label>
            //           <p className="mt-1 text-white">{user.username}</p>
            //         </div>
            //         <div>
            //           <label className="block text-sm font-medium text-gray-400">
            //             Email
            //           </label>
            //           <p className="mt-1 text-white">
            //             {user.email || "Not set"}
            //           </p>
            //         </div>
            //         <div>
            //           <label className="block text-sm font-medium text-gray-400">
            //             Role
            //           </label>
            //           <p className="mt-1 text-white capitalize">
            //             {user.user_type}
            //           </p>
            //         </div>
            //       </div>
            //       <div className="space-y-4">
            //         <div>
            //           <label className="block text-sm font-medium text-gray-400">
            //             Account Created
            //           </label>
            //           <p className="mt-1 text-white">
            //             {new Date(user.date_joined).toLocaleDateString()}
            //           </p>
            //         </div>
            //         <div>
            //           <label className="block text-sm font-medium text-gray-400">
            //             Last Login
            //           </label>
            //           <p className="mt-1 text-white">
            //             {new Date(user.last_login).toLocaleString()}
            //           </p>
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            // </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
