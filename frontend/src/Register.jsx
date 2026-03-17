import Header from "./components/Header/Header.jsx";
import { InfoBox } from "./components/InfoBox/InfoBox.jsx";
import ActionButton from "./components/ActionButton/ActionButton.jsx";
import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !email || !password || !confirmPassword) {
      setMessage("At least one field is empty");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords must match");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password,
      })
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.message === "Got yer data and saved it.") {
          localStorage.setItem('user', JSON.stringify(data.receivedData));
          setMessage("Registration successful!");
          // Only clear fields on success
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");

          navigate("/")
      } else {
          setMessage(data.message || "Registration failed");
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setMessage("Server error. Please check if the backend is running.");
    });
  }

  return (
    <>
      <Header />
      <form className="register-container" onSubmit={handleSubmit}>
        <InfoBox
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InfoBox
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InfoBox
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InfoBox
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <ActionButton className="btn-register" type="submit"> Sign Up</ActionButton>
        <p id="error-message" style={{ color: message === "Registration successful!" ? "green" : "red" }}>
          {message}
        </p>
      </form>
    </>
  );
}
export default Register;
