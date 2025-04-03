import React, { useState, useEffect } from "react";
import { updateUserDetails, changePassword } from "../apis/dashRequest";
import { useUser } from "../context/UserContext";

function Profile({ user }) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { login } = useUser();

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = await updateUserDetails(profileData, user.id);
      console.log("updated user details:", data);
      if (data.status === "success") {
        login(data.user);
      } else {
        alert(data.message);
      }
      setProfileData({
        username: user.username,
        email: user.email || "",
      });
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("New password and confirm password do not match!");
        return;
      }

      const data = await changePassword(passwordData, user.id);
      if (data.status === "success") {
        alert("Password changed successfully!");
        console.log("password changed:", data.message);
        setIsPasswordModalOpen(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    }
  };

  useEffect(() => {
    setProfileData({
      username: user.username,
      email: user.email || "",
    });
  }, [user]);

  return (
    <>
      <div className="space-y-8">
        <div className="bg-[#24262b] rounded-lg border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Profile</h2>
              <p className="text-sm text-gray-400 mt-1">
                Manage your account settings
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
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
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                Change Password
              </button>
              <button
                onClick={() => setIsProfileModalOpen(true)}
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Full Name
                </label>
                <p className="mt-1 text-white">
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : "Not set"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Username
                </label>
                <p className="mt-1 text-white">{user.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Email
                </label>
                <p className="mt-1 text-white">{user.email || "Not set"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Role
                </label>
                <p className="mt-1 text-white capitalize">{user.user_type}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Account Created
                </label>
                <p className="mt-1 text-white">
                  {new Date(user.date_joined).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#24262b] rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <svg
                    className="h-4 w-4 text-purple-500"
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
                <h3 className="text-lg font-medium text-white">Edit Profile</h3>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
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
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={profileData.username}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      username: e.target.value,
                    })
                  }
                  className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-2.5"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      email: e.target.value,
                    })
                  }
                  className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-2.5"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPasswordModalOpen && (
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
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">
                  Change Password
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
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
            <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="bg-gray-900 block w-full rounded-lg border-gray-700 text-white text-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
