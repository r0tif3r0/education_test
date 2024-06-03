import '../styles/App.css'
import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom"
import { Loader } from "../components/Loader/Loader"
import HomePage from '../pages/HomePage/HomePage';
import TestPage from '../pages/TestPage/TestPage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/test' element={<TestPage/>} />
      </Routes>
    </>
  )
}

export default App