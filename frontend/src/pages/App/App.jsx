import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Register from "../Register/Register.jsx";
import Home from "../Home/Home.jsx";
import Login from "../Login/Login.jsx";
import SearchResults from "../SearchResults/SearchResults.jsx";
import JobDetails from "../../components/JobDetails/JobDetails.jsx";
import Profile from "../../components/Profile/Profile.jsx";
import CreateJob from "../../components/CreateJob/CreateJob.jsx";
import Admin from "../../components/Admin/Admin.jsx";
import MyPostings from "../../components/MyPostings/MyPostings.jsx";
import MyApplications from "../../components/MyApplications/MyApplications.jsx";
import EditJob from "../../components/EditJob/EditJob.jsx";
import AdminDashboard from "../AdminDashboard/AdminDashboard.jsx";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.jsx";
import NotFound from "../NotFound/NotFound.jsx";

const StatusChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      try {
        const response = await fetch(`http://localhost:8000/api/users/${user._id || user.id}`);
        if (response.ok) {
          const userData = await response.json();
          // force logout if disabled
          if (userData.isActive === false) {
            console.warn("Account disabled by admin. Logging out...");
            localStorage.removeItem('user');
            alert("Your account has been disabled by an administrator.");
            window.location.href = '/login'; 
          }
        }
      } catch (err) {
        console.error("Status check failed:", err);
      }
    };

    console.log("StatusChecker interval started (5s)");
    const interval = setInterval(checkStatus, 5000);
    return () => {
      console.log("StatusChecker interval cleared");
      clearInterval(interval);
    };
  }, []);

  return null;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <StatusChecker />
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/edit-job/:id" element={<EditJob />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/my-postings" element={<MyPostings />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
