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
      navigate('/');
      return;
    } else{
      console.log("user", user);
    }
    
    fetch(`http://3.109.152.120:8000/apis/employee-todos/${id}/`)
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, [id, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (!user) {
    return null;
  }

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
                  <h2 className="text-sm font-medium text-gray-700 flex items-center">{user.username}</h2>
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
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Task List
              </h3>
            </div>
            <div className="border-t border-gray-200"></div>
            <ul className="divide-y divide-gray-200">
              {todos.length>0 ? todos.map((todo, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-indigo-600">
                      {todo.task}
                    </div>
                    <div className="ml-2 flex-shrink-0 flex items-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {todo.employee}
                      </span>
                      <button
                        onClick={async() => {
                          const newTodos = [...todos];
                          newTodos[index].status =
                            newTodos[index].status === "Completed"
                              ? "Pending"
                              : "Completed";
                          try{
                            const response = await fetch(`http://3.109.152.120:8000/apis/update-todo-status/${newTodos[index].id}/`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                status: newTodos[index].status,
                              })
                            })
                          }
                          catch(error){
                            console.error("Error updating todo status:", error);
                          }
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
              )): <li className="px-4 py-4 sm:px-6">No tasks found</li>}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
