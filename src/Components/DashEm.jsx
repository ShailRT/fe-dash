import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const { id } = useParams();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      console.log("user", user);
    }

    // Production URL
    fetch(`http://3.109.152.120:8000/apis/employee-todos/${id}/`)
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));

    // Localhost URL
    // fetch(`http://127.0.0.1:8000/apis/employee-todos/${id}/`)
    //   .then((response) => response.json())
    //   .then((data) => setTodos(data))
    //   .catch((error) => console.error("Error fetching todos:", error));
  }, [id, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-purple-600">
                  TaskMaster
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleDropdown}
                    className="text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-purple-500 transition-colors duration-200"
                  >
                    <img
                      className="h-10 w-10 rounded-full ring-2 ring-purple-500"
                      src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                      alt="User"
                    />
                  </button>
                    <span className="text-sm font-medium text-gray-700">
                      {user.username}
                    </span>
                </div>
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white transform transition-all duration-200 ease-in-out border border-gray-200">
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
          <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">My Tasks</h3>
            </div>
            <div className="px-6 py-4 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-medium text-gray-900">
                  My Task Notes
                </h4>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">
                    Total: {todos.length}
                  </span>
                  <span className="text-xs text-green-600">
                    Completed:{" "}
                    {todos.filter((todo) => todo.status === "Completed").length}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todos.length > 0 ? (
                  todos.map((todo, index) => (
                    <div
                      key={index}
                      className="group relative bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-purple-500"
                    >
                      <div className="absolute top-0 right-0 w-8 h-8 bg-purple-100 rounded-bl-lg rounded-tr-lg flex items-center justify-center">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            todo.status === "Completed"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {todo.task}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                            {todo.status || "Pending"}
                          </span>
                          <button
                            onClick={async () => {
                              const newTodos = [...todos];
                              newTodos[index].status =
                                newTodos[index].status === "Completed"
                                  ? "Pending"
                                  : "Completed";
                              try {
                                // Production URL
                                const response = await fetch(
                                  `http://3.109.152.120:8000/apis/update-todo-status/${newTodos[index].id}/`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      status: newTodos[index].status,
                                    }),
                                  }
                                );

                                // Localhost URL
                                // const response = await fetch(`http://127.0.0.1:8000/apis/update-todo-status/${newTodos[index].id}/`, {
                                //   method: "POST",
                                //   headers: {
                                //     "Content-Type": "application/json",
                                //   },
                                //   body: JSON.stringify({
                                //     status: newTodos[index].status,
                                //   })
                                // })
                              } catch (error) {
                                console.error(
                                  "Error updating todo status:",
                                  error
                                );
                              }
                              setTodos(newTodos);
                            }}
                            className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                          >
                            {todo.status === "Completed" ? "Undo" : "Complete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <div className="text-gray-600 text-lg">
                      No tasks assigned yet
                    </div>
                    <div className="text-gray-500 text-sm mt-2">
                      Your supervisor will assign tasks to you here
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
