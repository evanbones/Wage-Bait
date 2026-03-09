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

    const response = fetch("http://localhost:8000/api/submit", {
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
      </form>
    </>
  );
}
export default Register;
