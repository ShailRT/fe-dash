import React, { useState } from "react";
import {
  createTeam,
  updateTeam,
  deleteTeam,
  getTeams,
  getEmployees,
  getManagers,
  deleteUser,
  updateUserRole,
} from "../apis/dashRequest";

function Teams({
  teams,
  employees,
  managers,
  todos,
  setTeams,
  setEmployees,
  setManagers,
  setTodos,
  user,
  isCreateTeamModalOpen,
  setIsCreateTeamModalOpen,
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteTeamModalOpen, setIsDeleteTeamModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [isUpdateRoleModalOpen, setIsUpdateRoleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddManager = () => {
    setSelectedManagers([...selectedManagers, { user_id: "" }]);
  };

  const handleAddEmployee = () => {
    setSelectedEmployees([...selectedEmployees, { user_id: "" }]);
  };

  const handleRemoveManager = (index) => {
    const updatedManagers = selectedManagers.filter((_, i) => i !== index);
    setSelectedManagers(updatedManagers);
  };

  const handleRemoveEmployee = (index) => {
    const updatedEmployees = selectedEmployees.filter((_, i) => i !== index);
    setSelectedEmployees(updatedEmployees);
  };

  const handleManagerChange = (index, value) => {
    const updatedManagers = [...selectedManagers];
    updatedManagers[index] = { ...updatedManagers[index], user_id: value };
    setSelectedManagers(updatedManagers);
  };

  const handleEmployeeChange = (index, value) => {
    const updatedEmployees = [...selectedEmployees];
    updatedEmployees[index] = { ...updatedEmployees[index], user_id: value };
    setSelectedEmployees(updatedEmployees);
  };

  const handleAssignTeam = async () => {
    setIsLoading(true);
    try {
      const teamData = {
        manager: selectedManagers.map((manager) => manager.user_id),
        employees: selectedEmployees.map((employee) => employee.user_id),
      };
      const teamdata = await createTeam(teamData);
      console.log("Team created:", teamdata);

      setIsCreateTeamModalOpen(false);
      const data = await getTeams();
      setTeams(data);
      setSelectedManagers([]);
      setSelectedEmployees([]);
      // Refresh employees list
      const empsdata = await getEmployees();
      const manadata = await getManagers();
      setEmployees(empsdata);
      setManagers(manadata);
    } catch (error) {
      console.error("Error assigning team members:", error);
      alert("Failed to assign team members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      // Refresh employees list
      const empsdata = await getEmployees();
      const manadata = await getManagers();
      setEmployees(empsdata);
      setManagers(manadata);
      setIsUpdateRoleModalOpen(false);
      setSelectedUser(null);
      setNewRole("");
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role. Please try again.");
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await deleteTeam(teamId);
      // Refresh teams list
      const teamsData = await getTeams();
      setTeams(teamsData);
      setIsDeleteTeamModalOpen(false);
      setTeamToDelete(null);
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team. Please try again.");
    }
  };

  const handleEditTeam = async () => {
    setIsLoading(true);
    try {
      const teamData = {
        manager: selectedManagers.map((manager) => manager.user_id),
        employees: selectedEmployees.map((employee) => employee.user_id),
      };
      await updateTeam(teamToEdit.id, teamData);

      // Refresh teams list
      const teamsData = await getTeams();
      setTeams(teamsData);
      setIsEditTeamModalOpen(false);
      setTeamToEdit(null);
      setSelectedManagers([]);
      setSelectedEmployees([]);
    } catch (error) {
      console.error("Error updating team:", error);
      alert("Failed to update team. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditTeam = (team) => {
    setTeamToEdit(team);
    // Initialize selected managers and employees with current team members
    setSelectedManagers(
      team.managers.map((managerId) => ({ user_id: managerId }))
    );
    setSelectedEmployees(
      team.members.map((employeeId) => ({ user_id: employeeId }))
    );
    setIsEditTeamModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      // Refresh employees and managers lists
      const empsdata = await getEmployees();
      const manadata = await getManagers();
      setEmployees(empsdata);
      setManagers(manadata);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <>
      <div className="space-y-8">
        {user.user_type === "super" && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team, index) => (
                <div
                  key={index}
                  className="bg-[#24262b] rounded-lg border border-gray-800 p-6 hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">
                      Team {index + 1}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                        {team.managers.length} Manager
                        {team.managers.length !== 1 ? "s" : ""}
                      </div>
                      <button
                        onClick={() => handleOpenEditTeam(team)}
                        className="text-blue-500 hover:text-blue-400"
                      >
                        <svg
                          className="h-5 w-5"
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
                      </button>
                      <button
                        onClick={() => {
                          setTeamToDelete(team);
                          setIsDeleteTeamModalOpen(true);
                        }}
                        className="text-red-500 hover:text-red-400"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Managers */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Managers
                    </h4>
                    <div className="space-y-2">
                      {team.managers.map((managerId, idx) => {
                        const manager = managers.find(
                          (m) => m.id === managerId
                        );
                        return (
                          <div
                            key={idx}
                            className="flex items-center space-x-3"
                          >
                            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-500">
                                {manager?.username?.[0]?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <span className="text-sm text-gray-300">
                              {manager?.username || "Unknown Manager"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Employees */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Employees
                    </h4>
                    <div className="space-y-2">
                      {team.members.map((employeeId, idx) => {
                        const employee = employees.find(
                          (e) => e.id === employeeId
                        );
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-purple-500">
                                  {employee?.username?.[0]?.toUpperCase() ||
                                    "?"}
                                </span>
                              </div>
                              <span className="text-sm text-gray-300">
                                {employee?.username || "Unknown Employee"}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedUser(employee);
                                setNewRole(employee?.user_type || "");
                                setIsUpdateRoleModalOpen(true);
                              }}
                              className="text-xs font-medium text-blue-500 hover:text-blue-400"
                            >
                              Update Role
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* All Managers Section */}
        {user.user_type === "super" && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              All Managers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managers.map(
              (manager, index) =>
                manager.user_type === "manager" && (
                  <div
                    key={index}
                    className="bg-[#24262b] rounded-lg border border-gray-800 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-medium text-blue-500">
                            {manager.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-white truncate">
                            {manager.username}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {manager.user_type}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(manager);
                            setNewRole(manager?.user_type || "");
                            setIsUpdateRoleModalOpen(true);
                          }}
                          className="text-xs font-medium text-blue-500 hover:text-blue-400"
                        >
                          Update Role
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(manager);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-xs font-medium text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-2xl font-semibold text-blue-500">
                          {
                            todos.filter(
                              (todo) => todo.user_assigned_to === manager.id
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
                                todo.user_assigned_to === manager.id &&
                                todo.status === "completed"
                            ).length
                          }
                        </div>
                        <div className="text-sm text-gray-400">Completed</div>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>)}

        {/* Individual Employees Section */}

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            All Employees
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map(
              (employee, index) =>
                employee.user_type === "employee" && (
                  <div
                    key={index}
                    className="bg-[#24262b] rounded-lg border border-gray-800 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-medium text-purple-500">
                            {employee.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-white truncate">
                            {employee.username}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {employee.user_type}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(employee);
                            setNewRole(employee?.user_type || "");
                            setIsUpdateRoleModalOpen(true);
                          }}
                          className="text-xs font-medium text-blue-500 hover:text-blue-400"
                        >
                          Update Role
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(employee);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-xs font-medium text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-2xl font-semibold text-purple-500">
                          {
                            todos.filter(
                              (todo) => todo.user_assigned_to === employee.id
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
                                todo.user_assigned_to === employee.id &&
                                todo.status === "completed"
                            ).length
                          }
                        </div>
                        <div className="text-sm text-gray-400">Completed</div>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      {/* Create Team Modal */}
      {isCreateTeamModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#24262b] rounded-xl shadow-2xl max-w-2xl w-full mx-auto transform transition-all">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">
                  Assign Team Members
                </h3>
              </div>
              <button
                onClick={() => setIsCreateTeamModalOpen(false)}
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
            <div className="p-6 space-y-8">
              {/* Managers Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-white">Managers</h4>
                  <button
                    onClick={handleAddManager}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 text-blue-500 text-sm font-medium rounded-lg hover:bg-blue-500/20"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
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
                    Add Manager
                  </button>
                </div>
                {selectedManagers.map((manager, index) => (
                  <div
                    key={index}
                    className="space-y-4 p-4 bg-gray-900/50 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-white">
                        Manager {index + 1}
                      </h4>
                      {index > 0 && (
                        <button
                          onClick={() => handleRemoveManager(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Manager
                      </label>
                      <select
                        value={manager.user_id}
                        onChange={(e) =>
                          handleManagerChange(index, e.target.value)
                        }
                        className="bg-gray-800 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5"
                        required
                      >
                        <option value="" className="text-gray-500">
                          Select a manager...
                        </option>
                        {managers.map(
                          (manager) =>
                            manager.user_type === "manager" && (
                              <option
                                key={manager.id}
                                value={manager.id}
                                className="text-white"
                              >
                                {manager.username}
                              </option>
                            )
                        )}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Employees Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-white">Employees</h4>
                  <button
                    onClick={handleAddEmployee}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 text-blue-500 text-sm font-medium rounded-lg hover:bg-blue-500/20"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
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
                    Add Employee
                  </button>
                </div>
                {selectedEmployees.map((employee, index) => (
                  <div
                    key={index}
                    className="space-y-4 p-4 bg-gray-900/50 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-white">
                        Employee {index + 1}
                      </h4>
                      {index > 0 && (
                        <button
                          onClick={() => handleRemoveEmployee(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Employee
                      </label>
                      <select
                        value={employee.user_id}
                        onChange={(e) =>
                          handleEmployeeChange(index, e.target.value)
                        }
                        className="bg-gray-800 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5"
                        required
                      >
                        <option value="" className="text-gray-500">
                          Select an employee...
                        </option>
                        {employees.map(
                          (emp) =>
                            emp.user_type === "employee" && (
                              <option
                                key={emp.id}
                                value={emp.id}
                                className="text-white"
                              >
                                {emp.username}
                              </option>
                            )
                        )}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  onClick={() => setIsCreateTeamModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTeam}
                  disabled={
                    isLoading ||
                    (selectedManagers.length === 0 &&
                      selectedEmployees.length === 0)
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Assigning...
                    </>
                  ) : (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Assign Team
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Role Modal */}
      {isUpdateRoleModalOpen && selectedUser && (
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
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">
                  Update User Role
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsUpdateRoleModalOpen(false);
                  setSelectedUser(null);
                  setNewRole("");
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
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User
                </label>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <span className="text-lg font-medium text-purple-500">
                      {selectedUser.username[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white">{selectedUser.username}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  onClick={() => {
                    setIsUpdateRoleModalOpen(false);
                    setSelectedUser(null);
                    setNewRole("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateRole(selectedUser.id, newRole)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                >
                  Update Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Delete User Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#24262b] rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg
                    className="h-4 w-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">Delete User</h3>
              </div>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setUserToDelete(null);
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
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <span className="text-lg font-medium text-purple-500">
                    {userToDelete.username[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white">{userToDelete.username}</p>
                  <p className="text-sm text-gray-400 capitalize">
                    {userToDelete.user_type}
                  </p>
                </div>
              </div>
              <p className="text-gray-300">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(userToDelete.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Delete Team Modal */}
      {isDeleteTeamModalOpen && teamToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#24262b] rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg
                    className="h-4 w-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">Delete Team</h3>
              </div>
              <button
                onClick={() => {
                  setIsDeleteTeamModalOpen(false);
                  setTeamToDelete(null);
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
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Managers
                  </h4>
                  <div className="space-y-2">
                    {teamToDelete.managers.map((managerId, idx) => {
                      const manager = managers.find((m) => m.id === managerId);
                      return (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-500">
                              {manager?.username?.[0]?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <span className="text-sm text-gray-300">
                            {manager?.username || "Unknown Manager"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Employees
                  </h4>
                  <div className="space-y-2">
                    {teamToDelete.members.map((employeeId, idx) => {
                      const employee = employees.find(
                        (e) => e.id === employeeId
                      );
                      return (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-500">
                              {employee?.username?.[0]?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <span className="text-sm text-gray-300">
                            {employee?.username || "Unknown Employee"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <p className="text-gray-300">
                Are you sure you want to delete this team? This action cannot be
                undone.
              </p>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  onClick={() => {
                    setIsDeleteTeamModalOpen(false);
                    setTeamToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTeam(teamToDelete.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                >
                  Delete Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {isEditTeamModalOpen && teamToEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#24262b] rounded-xl shadow-2xl max-w-2xl w-full mx-auto transform transition-all">
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
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">
                  Edit Team Members
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditTeamModalOpen(false);
                  setTeamToEdit(null);
                  setSelectedManagers([]);
                  setSelectedEmployees([]);
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
            <div className="p-6 space-y-8">
              {/* Managers Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-white">Managers</h4>
                  <button
                    onClick={handleAddManager}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 text-blue-500 text-sm font-medium rounded-lg hover:bg-blue-500/20"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
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
                    Add Manager
                  </button>
                </div>
                {selectedManagers.map((manager, index) => (
                  <div
                    key={index}
                    className="space-y-4 p-4 bg-gray-900/50 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-white">
                        Manager {index + 1}
                      </h4>
                      {index > 0 && (
                        <button
                          onClick={() => handleRemoveManager(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Manager
                      </label>
                      <select
                        value={manager.user_id}
                        onChange={(e) =>
                          handleManagerChange(index, e.target.value)
                        }
                        className="bg-gray-800 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5"
                        required
                      >
                        <option value="" className="text-gray-500">
                          Select a manager...
                        </option>
                        {managers.map(
                          (manager) =>
                            manager.user_type === "manager" && (
                              <option
                                key={manager.id}
                                value={manager.id}
                                className="text-white"
                              >
                                {manager.username}
                              </option>
                            )
                        )}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Employees Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-white">Employees</h4>
                  <button
                    onClick={handleAddEmployee}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 text-blue-500 text-sm font-medium rounded-lg hover:bg-blue-500/20"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
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
                    Add Employee
                  </button>
                </div>
                {selectedEmployees.map((employee, index) => (
                  <div
                    key={index}
                    className="space-y-4 p-4 bg-gray-900/50 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-white">
                        Employee {index + 1}
                      </h4>
                      {index > 0 && (
                        <button
                          onClick={() => handleRemoveEmployee(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Employee
                      </label>
                      <select
                        value={employee.user_id}
                        onChange={(e) =>
                          handleEmployeeChange(index, e.target.value)
                        }
                        className="bg-gray-800 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5"
                        required
                      >
                        <option value="" className="text-gray-500">
                          Select an employee...
                        </option>
                        {employees.map(
                          (emp) =>
                            emp.user_type === "employee" && (
                              <option
                                key={emp.id}
                                value={emp.id}
                                className="text-white"
                              >
                                {emp.username}
                              </option>
                            )
                        )}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  onClick={() => {
                    setIsEditTeamModalOpen(false);
                    setTeamToEdit(null);
                    setSelectedManagers([]);
                    setSelectedEmployees([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditTeam}
                  disabled={
                    isLoading ||
                    (selectedManagers.length === 0 &&
                      selectedEmployees.length === 0)
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Update Team
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Teams;
