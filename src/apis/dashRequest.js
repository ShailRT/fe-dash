const BASE_URL = "http://3.109.152.120:8000/apis";
// const BASE_URL = "http://localhost:8000/apis";

async function getTodo() {
  const response = await fetch(`${BASE_URL}/todos/`);
  const data = await response.json();
  return data;
}
async function getEmployees() {
  const response = await fetch(`${BASE_URL}/get-users/`);
  const data = await response.json();
  return data;
}

async function createTodo(task, employee, manager) {
  const response = await fetch(`${BASE_URL}/create-todo/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task: task,
      employee: parseInt(employee),
      manager: parseInt(manager),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error("Server error response:", errorData);
    throw new Error(
      `Error creating task: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log("Task created successfully:", data);

  // Refresh todos after creating new task
  return data;
}

async function updateTodoStatus(todoId, newStatus) {
  const response = await fetch(`${BASE_URL}/update-todo-status/${todoId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: newStatus,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error("Server error response:", errorData);
    throw new Error(`Error updating task: ${response.status}`);
  }
  const data = await response.json();
  console.log("Task updated successfully:", data);
  return data;
}

async function registerUser(userData) {
  const response = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      password: userData.password,
      user_type: userData.user_type,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }
  return data;
}

const loginUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
};

async function deleteTodo(todoId) {
  const response = await fetch(`${BASE_URL}/delete-todo/${todoId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log("Task deleted successfully:", data);
  return data;
}

async function getManagers() {
  const response = await fetch(`${BASE_URL}/get-managers/`);
  const data = await response.json();
  return data;
}

async function createTeam(teamData) {
  const response = await fetch(`${BASE_URL}/create-team/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(teamData),
  });
  const data = await response.json();
  return data;
}

async function getTeams() {
  const response = await fetch(`${BASE_URL}/get-teams/`);
  const data = await response.json();
  return data;
}

async function getTeambyManager(managerId) {
  const response = await fetch(`${BASE_URL}/get-team-by-manager/${managerId}/`);
  const data = await response.json();
  return data;
}

async function getTeamMembers(teamId) {
  const response = await fetch(`${BASE_URL}/get-team-members/${teamId}/`);
  const data = await response.json();
  return data;
}

async function getTeamTasks(teamId) {
  const response = await fetch(`${BASE_URL}/get-team-tasks/${teamId}/`);
  const data = await response.json();
  return data;
}

async function updateUserRole(userId, userType) {
  const response = await fetch(`${BASE_URL}/update-user-role/${userId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_type: userType,
    }),
  });
  const data = await response.json();
  return data;
}

async function updateUserDetails(userData, userId) {
  const response = await fetch(`${BASE_URL}/update-user-details/${userId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return data;
}

async function changePassword(userData, userId) {
  const response = await fetch(`${BASE_URL}/change-password/${userId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return data;
}

const deleteUser = async (userId) => {
  const response = await fetch(`${BASE_URL}/delete-user/${userId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

async function deleteTeam(teamId) {
  const response = await fetch(`${BASE_URL}/delete-team/${teamId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

async function updateTeam(teamId, teamData) {
  const response = await fetch(`${BASE_URL}/update-team/${teamId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(teamData),
  });
  const data = await response.json();
  return data;
}

export {
  getTodo,
  getEmployees,
  createTodo,
  updateTodoStatus,
  registerUser,
  loginUser,
  deleteTodo,
  getManagers,
  createTeam,
  getTeams,
  getTeamMembers,
  getTeamTasks,
  getTeambyManager,
  updateUserRole,
  updateUserDetails,
  changePassword,
  deleteUser,
  deleteTeam,
  updateTeam,
};
