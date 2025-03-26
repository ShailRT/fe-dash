import React, { useState } from "react";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const SupDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [employees, setEmployees] = useState([]);
  const { user, logout } = useUser();
  const navigate = useNavigate();

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
        body: JSON.stringify({ title: task, assigned_to: employee }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      console.log("successful:", data);
      setTodos([...todos, data.todo]);
    } catch (error) {
      console.error("There was a problem with the request:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
        
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white"
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                    alt="User"
                  />
                  <span className="text-sm font-medium text-gray-700 text-center flex items-center">
                    {user.username}
                  </span>
                </button>
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-6">
        
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 columns-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Users
              </h3>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {employees.map((employee, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-indigo-600">
                      {employee.username}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Tasks
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 sm:px-6"></div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const task = e.target.todo.value;
                  const employee = e.target.employee.value;
                  handleCreateTodo(task, employee);
                  e.target.todo.value = "";
                  e.target.employee.value = "";
                }}
                className="p-6 bg-white shadow-sm"
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="todo"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Task Description
                    </label>
                    <input
                      type="text"
                      id="todo"
                      name="todo"
                      className="shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400"
                      placeholder="Enter new task..."
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="employee"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Assign To
                    </label>
                    <select
                      id="employee"
                      name="employee"
                      className="shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md px-4 py-2 bg-white"
                      required
                    >
                      <option value="">Select team member...</option>
                      {employees.map((employee, index) => (
                        employee.user_type === "employee" && <option key={index} value={employee.id}>
                          {employee.username}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Task
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <ul className="divide-y divide-gray-200">
              {todos.map((todo, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-indigo-600">
                      {todo.task}
                    </div>
                    <div className="ml-2 flex-shrink-0 flex items-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {employees.find(
                          (emp) => emp.id === todo.user_assigned_to
                        )?.username || "Unassigned"}
                      </span>
                      <button
                        onClick={() => {
                          const newTodos = [...todos];
                          newTodos[index].status =
                            newTodos[index].status === "Completed"
                              ? "Pending"
                              : "Completed";
                          setTodos(newTodos);
                        }}
                        className="ml-4 px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        {todo.status === "Completed"
                          ? "Mark as Pending"
                          : "Mark as Completed"}
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {todo.status || "Pending"}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        
      </main>
    </div>
  );
};

export default SupDashboard;
