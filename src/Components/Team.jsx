import React from "react";

function Team({ teamMembers, employees, todos }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((memberId, index) => {
          // Find the employee details from the employees array
          const member = employees.find((emp) => emp.id === memberId);
          if (!member) return null; // Skip if member not found

          return (
            <div
              key={index}
              className="bg-[#24262b] rounded-lg border border-gray-800 p-6 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <span className="text-xl font-medium text-purple-500">
                    {member.username[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {member.username}
                  </h3>
                  <p className="text-sm text-gray-400">{member.user_type}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-semibold text-purple-500">
                    {
                      todos.filter(
                        (todo) => todo.user_assigned_to === member.id
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-400">Assigned Tasks</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-semibold text-green-500">
                    {
                      todos.filter(
                        (todo) =>
                          todo.user_assigned_to === member.id &&
                          todo.status === "completed"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Team;
