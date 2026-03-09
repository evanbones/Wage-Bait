import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./Register.jsx";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import SearchResults from "./SearchResults.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
