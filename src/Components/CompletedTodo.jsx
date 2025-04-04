import React from "react";
import TodoCard from "./TodoCard";

function CompletedTodo({ filteredTodos, employees, handleUpdateTodoStatus, handleDeleteTodo }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTodos.map((todo, index) => (
        <TodoCard
          key={index}
          index={index}
          todo={todo}
          user={employees.find(emp => emp.id === todo.user_assigned_to) || {}}
          handleUpdateTodoStatus={handleUpdateTodoStatus}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}
    </div>
  );
}

export default CompletedTodo;
