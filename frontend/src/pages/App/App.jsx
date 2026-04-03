import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <>
      <BrowserRouter>
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
          <Route path="/my-postings" element={<MyPostings />} />
          <Route path="/my-applications" element={<MyApplications />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
