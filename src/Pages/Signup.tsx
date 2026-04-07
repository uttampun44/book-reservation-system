import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Auth.css";

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    firstName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!firstName) newErrors.firstName = "First name is required";

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Confirm your password";
    else if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    alert(`Account created for ${firstName}`);
    // TODO: call backend API
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo">📚</div>
        <h2>Create your account</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>First name</label>
            <input
              type="text"
              placeholder="Alex"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && <p style={{ color: "red", fontSize: 12 }}>{errors.firstName}</p>}
          </div>

          <div className="input-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="you@email.com"
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

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p style={{ color: "red", fontSize: 12 }}>{errors.confirmPassword}</p>
            )}
          </div>

          <button className="auth-btn" type="submit">
            Create account
          </button>
        </form>

        <div className="switch-text">
          Already have an account? <Link to="/">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;