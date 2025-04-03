import React from "react";
import TodoCard from "./TodoCard";

function CompletedTodo({ filteredTodos, user, handleUpdateTodoStatus, handleDeleteTodo }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTodos.map((todo, index) => (
        <TodoCard
          key={index}
          index={index}
          todo={todo}
          user={user}
          handleUpdateTodoStatus={handleUpdateTodoStatus}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}
    </div>
  );
}

export default CompletedTodo;
