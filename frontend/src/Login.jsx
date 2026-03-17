import Header from "./components/Header/Header.jsx";
import { InfoBox } from "./components/InfoBox/InfoBox.jsx";
import ActionButton from "./components/ActionButton/ActionButton.jsx";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setMessage("");
    if (!username || !password) {
      setMessage("At least one field is empty");
      return;
    }
    fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Login successful") {
          localStorage.setItem('user', JSON.stringify(data.receivedData));
          setMessage("Login successful!");
          setUsername("");
          setPassword("");

          navigate("/")
        } else {
          setMessage(data.message);
        }
  })
  .catch(err => {
    console.error(err);
    setMessage("Server error");
  });
  }

  return (
    <>
      <Header />
      <form className="login-container" onSubmit={handleSubmit}>
        <InfoBox 
          label="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <InfoBox 
          label="Password" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <ActionButton className="btn-login" type="submit">Login</ActionButton>
        <p id="error-message">{message}</p>
      </form>
    </>
  );
}
export default Login;
