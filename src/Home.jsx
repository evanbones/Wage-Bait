import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import JobPosting from "./components/JobPosting/JobPosting.jsx";
import "./Register.css";

function Register() {
  return (
    <>
      <Header />
      <JobPosting
        title="Software Developer"
        company="Microsoft"
        wage="$100k/year"
      />
      <JobPosting
        title="Unpaid Intern"
        company="Microsoft 2"
        wage="$0.00/year"
      />
      <JobPosting
        title="Fortnite Developer"
        company="Epic Games"
        wage="$19.00/year"
      />
      <Footer />
    </>
  );
}
export default Register;
