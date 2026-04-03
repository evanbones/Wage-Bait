import Header from "../../components/Header/Header.jsx";
import { InfoBox } from "../../components/InfoBox/InfoBox.jsx";
import ActionButton from "../../components/ActionButton/ActionButton.jsx";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";


function Register() {

  const dialogRef = useRef(null);
  
    const openPopup = () => dialogRef.current.showModal();
    const closePopup = () => dialogRef.current.close();
    const [PFPFile, setPFPFile] = useState(null);
    const [previewPFP, setPreviewPFP] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
  
    const handlePFPChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 8 * 1024 * 1024) {
          alert("Picture must be smaller than 8MB");
          e.target.value = null;
          return;
        }
        setPFPFile(file);
        setPreviewPFP(URL.createObjectURL(file));
      }
    };
  
    const handlePFPUpload = async () => {
      if (!PFPFile) return;
      const reader = new FileReader();
      reader.readAsDataURL(PFPFile);
      reader.onloadend = async () => {
        setProfilePic(reader.result);
        setPreviewPFP(reader.result);
        setPFPFile(null);
        closePopup();
    };
  };




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
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) === false) {
      setMessage("Invalid email");
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
        profilePic
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
          setProfilePic(null);

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
        <div className="profile-pic-container">
            {previewPFP ? (
              <img className="pfp-preview" src={previewPFP} alt="Profile" />
            ) : (
              "Profile Picture"
            )}
            <button type="button" onClick={openPopup} className="upload-btn">
              Upload Photo
            </button>
            <dialog ref={dialogRef} className="pfp-popup">
              <p> Upload Profile Picture</p>

              <input
                type="file"
                accept="image/*"
                onChange={handlePFPChange}
                className="pfp-input"
              />

              {previewPFP && (
                <img src={previewPFP} alt="Preview" className="pfp-preview" />
              )}
              <div>
                <button type="button" onClick={handlePFPUpload}> Confirm</button>
                <button type="button"
                  onClick={() => {
                    if (previewPFP) {
                      URL.revokeObjectURL(previewPFP);
                    }
                    setPreviewPFP(null);
                    setPFPFile(null);
                    closePopup();
                  }}
                >
                  Cancel
                </button>
              </div>
            </dialog>
          </div>
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
