import Header from "./components/Header/Header.jsx";
import { InfoBox } from "./components/InfoBox/InfoBox.jsx";
import ActionButton from "./components/ActionButton/ActionButton.jsx";
import "./Login.css";

function Login() {
  return (
    <>
      <Header />
      <div className="login-container">
        <InfoBox label="Username" />

        <InfoBox label="Password" type="password" />

        <ActionButton className="btn-login">Login</ActionButton>
      </div>
    </>
  );
}
export default Login;
