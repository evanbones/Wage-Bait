import './App.css'
import Header from './components/Header/Header.jsx'
import JobPosting from "./components/JobPosting/JobPosting.jsx";

function App() {

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
    </>
  )
}

export default App
