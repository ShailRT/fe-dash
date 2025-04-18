import React, { useEffect } from "react";

function DashHeader({setIsSidebarOpen, activeTab, setIsModalOpen, totalCount, pendingCount, completedCount, role, setIsCreateTeamModalOpen}) {
  
  useEffect(() => {
    console.log(role);
  }, [role]);
  return (
    <>
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
          <div className="text-sm text-gray-400 mt-1">
            {activeTab === "tasks" && (
              <div className="flex items-center space-x-4">
                <span>
                  Total:{" "}
                  {totalCount}
                </span>
                <span className="text-yellow-500">
                  {pendingCount}{" "}
                  Pending
                </span>
                <span className="text-green-500">
                  {completedCount}{" "}
                  Completed
                </span>
              </div>
            )}
            {activeTab === "pending" && "View pending tasks"}
            {activeTab === "completed" && "View completed tasks"}
            {activeTab === "members" && `View Team Members`}
          </div>
        </div>
        {(activeTab === "tasks" && role !== "employee") && (
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
        {(activeTab === "members" && role === "super") && (
          <button
          onClick={() => setIsCreateTeamModalOpen(true)}
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Create Team
        </button>
          
        )}
        
      </div>
    </>
  );
}

export default DashHeader;
