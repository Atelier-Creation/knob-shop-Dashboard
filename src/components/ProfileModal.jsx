import React, { useState } from "react";
import { X, Upload, Save, Lock, XCircle } from "lucide-react";

function ProfileModal({ onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const [adminData, setAdminData] = useState({
    profileImage: "https://via.placeholder.com/150",
    name: "Admin User",
    email: "admin@example.com",
    createdAt: "2025-08-20",
  });

  const [editedName, setEditedName] = useState(adminData.name);
  const [editedImage, setEditedImage] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setAdminData((prev) => ({
      ...prev,
      name: editedName,
      profileImage: editedImage || prev.profileImage,
    }));

    if (showPasswordInput && newPassword) {
      console.log("Password Updated:", newPassword); // 🔑 call API here
    }

    setIsEditing(false);
    setShowPasswordInput(false);
    setNewPassword("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg w-full max-w-md p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>

        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={editedImage || adminData.profileImage}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-[#f9fafb] object-cover shadow "
            />
            {isEditing && (
              <label className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                <Upload size={16} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-5 space-y-2 text-center">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 outline-none rounded-lg px-3 py-2 text-center w-full shadow-sm"
            />
          ) : (
            <h2 className="text-xl font-semibold text-gray-800">
              {adminData.name}
            </h2>
          )}

          <p className="text-gray-500 text-sm">{adminData.email}</p>
          <p className="text-gray-400 text-xs">
            Created: {new Date(adminData.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Password Reset */}
        <div className="mt-4 text-center">
          {!showPasswordInput ? (
            <button
              onClick={() => setShowPasswordInput(true)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Reset Password
            </button>
          ) : (
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 outline-none"
            />
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition shadow-sm"
              >
                <Save size={16} /> Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedName(adminData.name);
                  setEditedImage(null);
                }}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition shadow-sm"
              >
                <XCircle size={16} /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-[#ffefe3] text-[#1f2937] px-4 py-2 rounded-lg hover:bg-[#ffddb8] transition shadow-sm"
            >
              <Lock size={16} /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
