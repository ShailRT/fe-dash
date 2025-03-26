import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
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
        // Production URL
        const response = await fetch("http://3.109.152.120:8000/apis/todos/");
        
        // Localhost URL
        // const response = await fetch("http://127.0.0.1:8000/apis/todos/");
        const data = await response.json();
        setTodos(data);
        console.log("Todos:", data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        // Production URL
        const response = await fetch("http://3.109.152.120:8000/apis/get-employee/");
        
        // Localhost URL
        // const response = await fetch("http://127.0.0.1:8000/apis/get-employee/");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchTodos();
    fetchEmployees();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCreateTodo = async (task, employee) => {
    try {
      // Production URL
      const response = await fetch("http://3.109.152.120:8000/apis/create-todo/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: task, assigned_to: employee }),
      });
      
      // Localhost URL
      // const response = await fetch("http://127.0.0.1:8000/apis/create-todo/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ title: task, assigned_to: employee }),
      // });

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-purple-600">TaskMaster</h1>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-3 text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-purple-500 transition-colors duration-200"
                >
                  <img
                    className="h-10 w-10 rounded-full ring-2 ring-purple-500"
                    src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                    alt="User"
                  />
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
                </button>
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200 ease-in-out border border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600 transition-colors duration-200"
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
      <main className="py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Team Members</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {employees.map((employee, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-white font-medium">{employee.username[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{employee.username}</h4>
                        <p className="text-sm text-gray-500">{employee.user_type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Task Management</h3>
              </div>
              
              <div className="p-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const task = e.target.todo.value;
                    const employee = e.target.employee.value;
                    handleCreateTodo(task, employee);
                    e.target.todo.value = "";
                    e.target.employee.value = "";
                  }}
                  className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="todo" className="block text-sm font-medium text-gray-700 mb-2">
                        Task Description
                      </label>
                      <input
                        type="text"
                        id="todo"
                        name="todo"
                        className="shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border border-gray-300 rounded-md px-4 py-2 placeholder-gray-400 bg-white text-gray-900 transition-colors duration-200"
                        placeholder="Enter new task..."
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-2">
                        Assign To
                      </label>
                      <select
                        id="employee"
                        name="employee"
                        className="shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 transition-colors duration-200"
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
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ease-in-out transform hover:scale-105"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Task
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="px-6 py-4 bg-white border-t border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-medium text-gray-900">Task Notes</h4>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500">Total: {todos.length}</span>
                    <span className="text-xs text-green-600">Completed: {todos.filter(todo => todo.status === "Completed").length}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {todos.map((todo, index) => (
                    <div
                      key={index}
                      className="group relative bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-purple-500"
                    >
                      <div className="absolute top-0 right-0 w-8 h-8 bg-purple-100 rounded-bl-lg rounded-tr-lg flex items-center justify-center">
                        <div className={`h-2 w-2 rounded-full ${
                          todo.status === "Completed" ? "bg-green-500" : "bg-yellow-500"
                        }`} />
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {todo.task}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                            {employees.find((emp) => emp.id === todo.user_assigned_to)?.username || "Unassigned"}
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
                            className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                          >
                            {todo.status === "Completed" ? "Undo" : "Complete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
