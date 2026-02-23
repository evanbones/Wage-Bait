import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/Button'
import { Header } from './components/Header'
import JobPosting from "./components/JobPosting";

function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <>
      <Header />
      <JobPosting 
        title="Software Developer"
        company="Microsoft"
        wage="100k/year"
      />
      <JobPosting 
        title="Software Developer 2"
        company="Microsoft 2"
        wage="100k/year 2"
      />
      <JobPosting 
        title="Software Developer 3"
        company="Microsoft 3"
        wage="100k/year 3"
      />
    </>
  )
}

export default App
