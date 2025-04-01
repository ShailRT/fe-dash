import React from "react";

function Sidenav({
  isSidebarOpen,
  setIsSidebarOpen,
  user,
  setActiveTab,
  activeTab,
  handleLogout,
}) {
  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#24262b] border-r border-gray-800 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
              <img
                className="h-12 w-12 rounded-full"
                src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                alt="User"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {user.user.username.length > 15
                  ? user.user.username.substring(0, 15) + "..."
                  : user.user.username}
              </h2>
              <p className="text-sm text-gray-400">{user.user.user_type}</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
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
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            All Tasks
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("pending");
            }}
            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
              activeTab === "pending"
                ? "bg-purple-500/10 text-purple-500"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Pending Tasks
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
            <svg
              className="mr-3 h-5 w-5"
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
            Completed
          </a>
          {user.user.user_type !== "employee" && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("members");
              }}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                activeTab === "members"
                  ? "bg-purple-500/10 text-purple-500"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <svg
                className="mr-3 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Team Members
            </a>
          )}
<a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("profile");
              }}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                activeTab === "profile"
                  ? "bg-purple-500/10 text-purple-500"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <svg
                className="mr-3 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white mt-4"
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Sidenav;
