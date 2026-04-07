import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Auth.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    alert(`Logging in with ${email}`);
    // TODO: call backend API
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo">📚</div>
        <h2>Welcome back</h2>
        <p className="subtitle">Sign in to your BookLib account</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="alex@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p style={{ color: "red", fontSize: 12 }}>{errors.email}</p>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p style={{ color: "red", fontSize: 12 }}>{errors.password}</p>}
          </div>

          <button className="auth-btn" type="submit">
            Sign in
          </button>
        </form>

        <div className="switch-text">
          Don't have an account? <Link to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;