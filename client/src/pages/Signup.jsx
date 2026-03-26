import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/auth/register",
      { name, email, password }
    );

    // 👉 Automatically login after signup
    const loginRes = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );

    // Save token + user
    localStorage.setItem("token", loginRes.data.token);
    localStorage.setItem("user", JSON.stringify(loginRes.data.user));

    // Go to dashboard directly 🚀
    navigate("/dashboard");

  } catch (error) {
    alert(error.response?.data?.message || "Signup failed");
  }
};

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-4 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-6 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded"
        >
          Signup
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-600">
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}