"use client";

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>

      {user ? (
        <div className="space-y-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
        </div>
      ) : (
        <p className="text-gray-500">No profile data found.</p>
      )}
    </div>
  );
}
