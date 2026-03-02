import { useState } from 'react'
import './App.css'
import { Header } from './components/Header'
import JobPosting from "./components/JobPosting";

function App() {

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
