import Header from "./components/Header/Header.jsx";
import { InfoBox } from "./components/InfoBox/InfoBox.jsx";
import ActionButton from "./components/ActionButton/ActionButton.jsx";
import "./Register.css";
import { useState } from "react";


function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = document.getElementById("error-message")
    err.textContent = "";
    if (!username || !email || !password || !confirmPassword) {
      err.textContent = "At least one field is empty";
      return;
    }
    if (password !== confirmPassword) {
      err.textContent = "Passwords must match";
      return;
    }
    if (password.length < 8) {
      err.textContent = "Password must be at least 8 characters long";
      return;
    }
    const response = fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password,
      })
    });

    response.then((res) => res.json()).then((data) => {
      console.log(data);
      err.textContent = data.message + " " + data.receivedData.username;
    });
    
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

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
        <p id="error-message"></p>
      </form>
    </>
  );
}
export default Register;
