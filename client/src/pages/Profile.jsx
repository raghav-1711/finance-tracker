import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Profile() {

    const [darkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    );

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const [user, setUser] = useState({
        ...storedUser,
        phone: storedUser.phone || "",
        gender: storedUser.gender || "",
        profilePic: storedUser.profilePic || "",
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setUser({ ...user, profilePic: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        localStorage.setItem("user", JSON.stringify(user));
        alert("Profile updated ✅");
    };

    return (
        <div className={`${darkMode ? "bg-slate-900 text-white" : "bg-gray-100"} min-h-screen flex`}>

            <Sidebar darkMode={darkMode} />

            {/* FULL WIDTH CONTENT */}
            <div className="flex-1 p-10">

                <h1 className="text-3xl font-bold mb-8">Profile</h1>

                <div className={`${darkMode ? "bg-slate-800" : "bg-white"} p-10 rounded-2xl shadow-xl w-full max-w-5xl mx-auto`}>

                    {/* Top Section */}
                    <div className="flex items-center gap-8 mb-10">

                        <img
                            src={user.profilePic || "https://via.placeholder.com/120"}
                            alt="profile"
                            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500"
                        />

                        <div>
                            <h2 className="text-2xl font-bold">{user.name || "User"}</h2>
                            <p className="text-gray-400">{user.email}</p>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                className="mt-3 text-sm"
                            />
                        </div>

                    </div>

                    {/* GRID SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Phone */}
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Phone</p>
                            <input
                                name="phone"
                                value={user.phone}
                                onChange={handleChange}
                                placeholder="Enter phone"
                                className="w-full p-3 rounded border text-black"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Gender</p>
                            <select
                                name="gender"
                                value={user.gender}
                                onChange={handleChange}
                                className="w-full p-3 rounded border text-black"
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Account Type */}
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Account Type</p>
                            <p className="p-3 bg-gray-200 rounded text-black">
                                Standard User
                            </p>
                        </div>

                    </div>

                    {/* SAVE BUTTON */}
                    <div className="mt-10">
                        <button
                            onClick={handleSave}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
                        >
                            Save Changes
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}