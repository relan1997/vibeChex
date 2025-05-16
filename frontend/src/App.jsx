import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import Questions from './pages/Questions/Questions'
function App() {
  

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/:id/questions' element={<Questions/>}/>
      </Routes>
    </>
    )
}

export default App
