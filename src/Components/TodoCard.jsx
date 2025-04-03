import React from "react";

function TodoCard({
  todo,
  user,
  handleUpdateTodoStatus,
  handleDeleteTodo,
  index,
}) {
  return (
    <div
      key={index}
      className="bg-[#24262b] rounded-lg p-4 border border-gray-800 hover:border-purple-500/50 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
            <span className="text-sm font-medium text-purple-500">
              {user?.first_name?.[0]?.toUpperCase() ||
                user?.username?.[0]?.toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-gray-400">
            {user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.username}
          </span>
        </div>
        <div
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            todo.status === "completed"
              ? "bg-green-500/10 text-green-500"
              : "bg-yellow-500/10 text-yellow-500"
          }`}
        >
          {todo.status === "completed" ? "Completed" : "Pending"}
        </div>
      </div>
      <p className="text-white text-sm line-clamp-2 mb-3">{todo.task}</p>
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <span className="text-xs text-gray-500">
          {new Date().toLocaleDateString()}
        </span>
        <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            handleUpdateTodoStatus(
              todo.id,
              todo.status === "completed" ? "pending" : "completed"
            );
          }}
          className="text-xs font-medium text-purple-500 hover:text-purple-400"
        >
          {todo.status === "completed" ? "Mark as Pending" : "Mark as Complete"}
        </button>
        {user.user_type !== "employee" && (
          <button
            onClick={() => handleDeleteTodo(todo.id)}
            className="text-xs font-medium text-red-500 hover:text-red-400"
          >
            Delete
          </button>
        )}
        </div>
      </div>
    </div>
  );
}

export default TodoCard;
